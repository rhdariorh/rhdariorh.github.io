//
//  Darío Rodríguez Hernández
//  Técnicas procedurales de animación - Ingeniería multimedia (ETSE - UV)
//
//  ALGORITMOS DE BÚSQUEDA DE CAMINOS
//  A*:
//    g(n): Coste real del camino que empieza en la celda inicial y termina en n.
//    h(n): Estimación del coste del camino de n a F. Heurística.
//    f(n) = g(n) + h(n): función de evaluación, se escogerá el nodo que
//                        tenga menos f(n), lista ordenada.
//    Estructura de datos: Lista abierta: ordenada por f, nodos por explorar.
//                         Lista cerrada: no ordenada, explorados.
// Dijkstra:
//  Igual que A*, pero sin función heurística: f(n) = g(n). No tiene información sobre el nodo final.
//
// BFS:
//  Igual que A*, pero solo utiliza la función heurística: f(n) = h(n). Algoritmo boraz, va directo al objetivo.
//

const Algorithm = {
  ASTAR: 'A*',
  DIJKSTRA: 'Dijkstra',
  BFS: 'Best-First-Search',
  CUSTOM: 'Custom',
};

var map;
var path;
var cost;
var algorithm;
var obstacles; // Activar o desactivar obstáculos.
var numObstacles;
var writer;

function preload() {
  writer = createWriter('data.txt');
}

function setup() {
  createCanvas(windowWidth, windowWidth*0.5625);
  map = new Map(60, 32, 0);
  path = [];
  cost = 0;
  obstacles = false;
  numObstacles = 600;
  
  algorithm = "NONE";
}


function draw() {
  background(40, 44, 52);
  
  map.display();
  printPath(path);
  
  noStroke();
  fill(255);
  textSize(20);
  text("Algorithm: "+ algorithm, 10, 25);
  text("Cost: "+ cost.toFixed(4), 10, 45);
  textSize(13);
  if(algorithm == Algorithm.CUSTOM){
    fill(255, 210, 45);
    text("Heuristic value: " + map.heuristicWeight.toFixed(2) + "   ↑w  ↓s", width - 180, 45);
  }
  
}

function keyPressed(){
  
  var pathInfo = [createVector(0, 0), 0];
  
  switch (key) {
      case '1':
        pathInfo = map.getPath(Algorithm.ASTAR);
        algorithm = Algorithm.ASTAR; // Para dibujar en el draw
        path = pathInfo[0];
        cost = pathInfo[1];
        break;
        
      case '2':
        pathInfo = map.getPath(Algorithm.DIJKSTRA);
        algorithm = Algorithm.DIJKSTRA;
        path = pathInfo[0];
        cost = pathInfo[1];
        break;
        
      case '3':
        pathInfo = map.getPath(Algorithm.BFS);
        algorithm = Algorithm.BFS;
        path = pathInfo[0];
        cost = pathInfo[1];
        break;
      
      case '4':
        pathInfo = map.getPath(Algorithm.CUSTOM);
        algorithm = Algorithm.CUSTOM;
        path = pathInfo[0];
        cost = pathInfo[1];
        break;
        
      case 'r':
      case 'R':
        map.clearMap();
        path = [];
        cost = 0;
        if(obstacles){map.removeObstacles(); map.createRandomObstacles(numObstacles);}
        break;
      
      case 'o':
      case 'O':
        obstacles = !obstacles;
        if(obstacles){
          map.createRandomObstacles(numObstacles);
          //map.createObstaclesLayout1();
        }
        else {map.removeObstacles();}
        break;
      
      case 't':
      case 'T':
        //test(10);
        print("Los tests están deshabilitados.");
        break;
        
      case 'w':
      case 'W':
        if(algorithm == Algorithm.CUSTOM){
          if(map.heuristicWeight < 0.95){map.heuristicWeight = map.heuristicWeight + 0.05;}
          else{map.heuristicWeight = 1.0;}
          pathInfo = map.getPath(Algorithm.CUSTOM);
          algorithm = Algorithm.CUSTOM;
          path = pathInfo[0];
          cost = pathInfo[1];
        }
        break;
        
      case 's':
      case 'S':
        if(algorithm == Algorithm.CUSTOM){
          if(map.heuristicWeight > 0.05){map.heuristicWeight = map.heuristicWeight - 0.05;}
          else{map.heuristicWeight = 0.0;}
          if(map.heuristicWeight < 0.04){map.heuristicWeight = 0.0;}
          pathInfo = map.getPath(Algorithm.CUSTOM);
          algorithm = Algorithm.CUSTOM;
          path = pathInfo[0];
          cost = pathInfo[1];
        }
        break;
        
      default:
    }
}

function testObs(iterations){
  var time, cost;
  for(var i = 100; i <= 500; i+=100){
    print("Computing " + i + "x" + i + "...");
    map = new Map(i, i, 60);
    map.clearMap();
    path = [];
    cost = 0;
    numObstacles = (i*i*0.08);
    time = millis();
    for (var j = 0; j < iterations; j++){
      map.clearMap();
      map.removeObstacles(); 
      map.createRandomObstacles(numObstacles);
      pathInfo = map.getPath(Algorithm.ASTAR);
      if(j%5==0){print(j+" of "+iterations+" done.");}
    }
    time = millis() - time;
    writer.print(time/iterations + "\t" + i);
    print("Finished.");
  }
  writer.close();
}

function test(iterations){
  var time, cost;
  for(var i = 100; i <= 500; i+=100){
    print("Computing " + i + "x" + i + "...");
    map = new Map(i, i, 60);
    map.clearMap();
        path = [];
        cost = 0;
    time = millis();
    for (var j = 0; j < iterations; j++){
      map.clearMap();
      pathInfo = map.getPath(Algorithm.ASTAR);
      if(j%5==0){print(j+" of "+iterations+" done.");}
    }
    time = millis() - time;
    writer.print(time/iterations + "\t" + i);
    print("Finished.");
  }
  writer.close();
}

function printPath(path){
  stroke(255, 255, 0);
  for(let i = 0; i < path.length - 1; i++){
    line(path[i].x, path[i].y, path[i+1].x, path[i+1].y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowWidth*0.5625);
}
