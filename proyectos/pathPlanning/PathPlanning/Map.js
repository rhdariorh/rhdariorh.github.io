/********************************************
* Clase celda
* Añadir descripción
*********************************************/
class Node {
  
  constructor(x, y, pos){
    this.id = createVector(x, y); // coordenadas x, y del grid
    this.pos = pos; // Posición en la pantalla para recorrerlo con boids
    
    this.predecessor = createVector(-1, -1); // Ninguno
    this.f = 0;
    this.g = 0;
  }

}

/********************************************
* Clase mapa
* Añadir descripción
*********************************************/
class Map{
 
  constructor(nodesX, nodesY, margin){
    this.nodesX = nodesX; // Nº de nodos en X.
    this.nodesY = nodesY; // Nº de nodos en Y.
    this.margin = margin; // Margen del grid por los lados.
    this.openList = []; // Lista de nodos.
    this.closedList = []; // Lista de nodos.
    this.obstacles = []; // Lista de vectores id que indica que ids del mapa son obstáculos.
    this.heuristicWeight = 0.5;
    
    this.init(); // Crea el nodo inicial y final
  }
  
  /*
  * Crea nodo inicial y final
  */
  init(){
    var id = createVector(0, 0);
    id.x = Math.round(random(0, this.nodesX-1));
    id.y = Math.round(random(0, this.nodesY-1));
    this.iniNode = this.createNode(id);
    do{
      id.x = Math.round(random(0, this.nodesX-1));
      id.y = Math.round(random(0, this.nodesY-1));
    } while (id == this.iniNode.id && (this.nodesX > 0 && this.nodesY > 0));
    this.finNode = this.createNode(id);
  }
   
  /*
  * Devuelve el ancho en pixeles de la celda del grid
  */
  get widthCell(){
    return (width - this.margin*2) / this.nodesX;
  }
  
  /*
  * Devuelve el alto en pixeles de la celda del grid
  */
  get heightCell(){
    return (height - this.margin*2) / this.nodesY;
  }
  
  /*
  * Devuelve el path en posiciones y el coste en celdas del path.
  */
  getPath(algorithm){
    this.restart();
    var path = [];
    var cost = 0;
    
    if(this.pathFinding(algorithm)){
      var node = this.finNode;
      path.push(node.pos);
      
      while(node.id.x != this.iniNode.id.x || node.id.y != this.iniNode.id.y){
        node = this.closedList.find(element => (element.id.x == node.predecessor.x && element.id.y == node.predecessor.y));
        path.push(node.pos);
      }
      
      cost = this.finNode.g;
    }
    
    return [path, cost];
  }
  
  /*
  * Algoritmo de busqueda de ruta (A*, Dijkstra, BFS o Custom).
  * @param {Algorithm} algorithm Tipo de algoritmo a utilizar, cambia el cálculo de f(n).
  * @return {boolean}  Existe una ruta o no.
  */
  pathFinding(algorithm){
    this.iniNode.g = 0;
    this.iniNode.f = 0;
    this.openList.push(this.iniNode);
    var found = false;
    var i = 0;
    while(this.openList.length > 0 && !found){
      var n = this.openList.shift();
      this.closedList.push(n);
      if(n.id == this.finNode.id){
        found = true;
      }
      else{
        var successors = this.genSuccessors(n);
        for(var s of successors){
          var newG = n.g + p5.Vector.sub(s.id, n.id).mag();
          
          if(this.checkOpenList(s)){
            if(s.g > newG){
              s.predecessor = n.id;
              s.g = newG;
              this.calculateF(s, algorithm);
            }
          }
          else if(this.checkClosedList(s)){
            if(s.g > newG){
              s.predecessor = n.id;
              s.g = newG;
              this.calculateF(s, algorithm);
              this.closedList = this.closedList.filter(e => e.id != s.id);
              this.openList.push(s);
            }
          }
          else{
            s.predecessor = n.id;
            s.g = newG;
            this.calculateF(s, algorithm);
            this.openList.push(s);
          }
        }
        
      this.openList.sort(this.compare);
      }
    }
    return found;
  }

  /*
  * Devuelve una lista con los vecinos accesibles del nodo introducido.
  * @param {Node} n Nodo del cual se quiere saber los vecinos.
  * @return {Array[node]}  Lista de vecinos.
  */
  genSuccessors(n){
    var successors = [];
    for(var x = n.id.x - 1; x <= n.id.x + 1 ; x++){
      for(var y = n.id.y - 1; y <= n.id.y + 1 ; y++){
        
        if((x != n.predecessor.x || y != n.predecessor.y) && (x != n.id.x || y != n.id.y)){ // No padre ni si mismo
          if(x >= 0 && y >= 0 && x < this.nodesX && y < this.nodesY){ // dentro del rango
            var obs = this.obstacles.find(e => (e.x == x && e.y == y));
            if(obs === undefined){
              
              if(x == this.finNode.id.x && y == this.finNode.id.y){successors.push(this.finNode);}
              else{successors.push(this.createNode(createVector(x, y)));}
            }
          }
        }
      }
    }
    return successors;
  }
  
  /*
  * Crea un nodo con los valores correctos a partir de la id('x' e 'y' del grid) y el tipo de nodo.
  * @param {p5.Vector} id Id del nodo.
  * @return {node}  Nodo creado.
  */
  createNode(id){
    var pos = createVector(this.margin + id.x*this.widthCell + this.widthCell/2, this.margin + id.y*this.heightCell + this.heightCell/2);
    var node = new Node(id.x, id.y, pos);
    return node;
  }
  
  /*
  * Crea un escenario totalmente nuevo.
  */
  clearMap(){
    this.openList = [];
    this.closedList = [];
    this.init();
  }
  
  /*
  * Limpia las listas sin eliminar los obstáculos ni nodos inicial y final.
  * Útil para probar diferentes algoritmos con un mismo escenario.
  */
  restart(){
    this.openList = [];
    this.closedList = [];
  }
  
  /*
  * Crea obstáculos aleatorios en el mapa.
  * @param {Number} amount Número de obstáculos a crear.
  */
  createRandomObstacles(amount){
    for(let i = 0; i < amount; i++){
      var x, y;
      var obstacle;
      do{
        x = round(random(0, this.nodesX - 1));
        y = round(random(0, this.nodesY - 1));
        obstacle = this.obstacles.find(e => (e.x == x && e.y == y));
      }while ((x == this.iniNode.id.x && y == this.iniNode.id.y) || (x == this.finNode.id.x && y == this.finNode.id.y) || 
        (obstacle != undefined && this.obstacles.length <= this.nodesX*this.nodesY-3));
      
      if (obstacle === undefined){
        this.obstacles.push(createVector(x, y));
      }
    }
  }
  
  /*
  * Obstáculos utilizados en algunas pruebas.
  */
  createObstaclesLayout1(){
    var x, y;
    for(let i = 10; i < this.nodesX-30; i++){
      x = i;
      y = 5;
      if ((x != this.iniNode.id.x || y != this.iniNode.id.y) && (x != this.finNode.id.x || y != this.finNode.id.y)){
        this.obstacles.push(createVector(x, y));
      }
    }
    for(let i = 10; i < this.nodesX-30; i++){
      x = i;
      y =this.nodesY-5;
      if ((x != this.iniNode.id.x || y != this.iniNode.id.y) && (x != this.finNode.id.x || y != this.finNode.id.y)){
        this.obstacles.push(createVector(x, y));
      }
    }
    for(let i = 5; i < this.nodesY-4; i++){
      x = this.nodesX-30;
      y =i;
      if ((x != this.iniNode.id.x || y != this.iniNode.id.y) && (x != this.finNode.id.x || y != this.finNode.id.y)){
        this.obstacles.push(createVector(x, y));
      }
    }
  }
  
  /*
  * Elimina todos los obstaculos.
  */
  removeObstacles(){
    this.obstacles = [];
  }

  /*
  *  Chequea si el nodo está en lista abierta y si lo está se lo asigna para tener sus valores.
  *  @return {boolean}  Se ha encontrado o no.
  */
  checkOpenList(node){
    let found = false;
    
    for(var n of this.openList){
      if(n.id.x == node.id.x && n.id.y == node.id.y){
        found = true;
        node = n;
      }
    }
    
    return found;
  }
  
  /*
  *  Chequea si el nodo está en lista cerrada y si lo está se lo asigna para tener sus valores.
  *  @return {boolean}  Se ha encontrado o no.
  */
  checkClosedList(node){
    let found = false;
    
    for(var n of this.closedList){
      if(n.id.x == node.id.x && n.id.y == node.id.y){
        found = true;
        node = n;
      }
    }
    return found;
  }
  
  /*
  * Calcula la f(n) del nodo según el algoritmo utilizado.
  * @param {Node} node Nodo del que se quiere calcular la f(n).
  * @param {Algorithm} algorithm Algoritmo para el que se quiere calcular la f(n).
  */
  calculateF(node, algorithm){
    var hWeight;
    switch (algorithm) {
      case Algorithm.ASTAR:
        hWeight = 0.5;
        break;
      case Algorithm.DIJKSTRA:
        hWeight = 0.0;
        break;
      case Algorithm.BFS:
        hWeight = 1.0;
        break;
      case Algorithm.CUSTOM:
        hWeight = this.heuristicWeight;
        break;
      default:
        console.log('El algoritmo de búsqueda de ruta no es válido.');
    }

    node.f = (1.0-hWeight) * node.g + hWeight * p5.Vector.sub(this.finNode.id, node.id).mag();
  }
  
  /*
  * Comparación entre f(n)s para la ordenación de la lista abierta.
  * @param {Node} a Primer nodo.
  * @param {Node} b Segundo nodo.
  * @return {boolean}  Resultado de comparación.
  */
  compare( a, b ) {
    if ( a.f < b.f ){
      return -1;
    }
    if ( a.f > b.f ){
      return 1;
    }
    return 0;
  }
  
  /*
  * Función de dibujado
  */
  display(){
    // Rectangulo grande
    noFill();
    strokeWeight(2);
    stroke(71, 78, 92);
    rect(this.margin,
           this.margin,
           this.widthCell * this.nodesX,
           this.heightCell * this.nodesY);
    
    // Celdas
    strokeWeight(1);
    stroke(40, 44, 52);
    
    fill(100,50,50);
    for(let node of this.closedList){
      this.paintNode(node);
    }
    
    fill(50,100,50);
    for(let node of this.openList){
      this.paintNode(node);
    }
    
    fill(0, 255, 0);
    this.paintNode(this.iniNode);
    fill(255, 0, 0);
    this.paintNode(this.finNode);
    
    
    noStroke();
    
    fill(200);
    for(let o of this.obstacles){
      ellipse(this.margin + o.x*this.widthCell + this.widthCell/2,
           this.margin + o.y*this.heightCell + this.heightCell/2,
           this.widthCell - 2,
           this.heightCell - 2);
    }
  } 
  
  paintNode(node){
    rect(this.margin + node.id.x*this.widthCell,
           this.margin + node.id.y*this.heightCell,
           this.widthCell,
           this.heightCell);
  }
}
