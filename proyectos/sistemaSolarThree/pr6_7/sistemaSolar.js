/*
	Sistema Solar

	A partir de la plantilla "tutorials by example" de Lee Stemkoski

	Autores: Darío Rodríguez Hernández y Gerardo Molpeceres Rodríguez
 */
	
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';
import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/loaders/GLTFLoader.js';
import {ShaderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/postprocessing/ShaderPass.js';

// Variables globales
var container, scene, camera, renderer, controls;
var clock = new THREE.Clock();
var planetSelectId = "";
var planetSelect;
var posOrigen, posDestino; // Para la animación de la camara entre planetas.
var lookAtOrigen = {x: 0, y: 0, z:0}; // Para la animación de la camara entre planetas.
var lookAtDestino = {x: 0, y: 0, z:0}; // Para la animación de la camara entre planetas.
var Gmostrado = false; //Para saber si hay informacion mostrada
var Pmostrado = false; 

// Bloom effect - Sol
var composerScene, finalComposer; // Usamos composer para crear efectos de postprocesado que "renderer" solo no nos deja.
var bloomLayer = new THREE.Layers();
bloomLayer.set(1);
var darkMaterial = new THREE.MeshBasicMaterial({color: "black"});
var materials = {};

// Meshes
var cube;
var asteroids = [];
const NumAsteroids = 600;
var planets = [];
var sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto;
const OrbitMercury = 25;
const VelocityMercury = 0.13;
const EccentricityMercury = 0.2056;
const OrbitVenus = 35;
const VelocityVenus = 0.2;
const EccentricityVenus = 0.0068;
const OrbitEarth = 45;
const VelocityEarth = 0.01;
const EccentricityEarth = 0.0167;
const OrbitMars = 55;
const VelocityMars = 0.105;
const EccentricityMars = 0.0934;
const OrbitJupiter = 95;
const VelocityJupiter = 0.4;
const EccentricityJupiter = 0.0484;
const OrbitSaturn = 115;
const VelocitySaturn = 0.086;
const EccentricitySaturn = 0.05415;
const OrbitUranus = 135;
const VelocityUranus = 0.09;
const EccentricityUranus = 0.0444;
const OrbitNeptune = 155;
const VelocityNeptune = 0.1;
const EccentricityNeptune = 0.00858;
const OrbitPluto = 165;
const VelocityPluto = 0.9;
const EccentricityPluto = 0.2502;

// Inicialización de variables
init();

// Loop de animación
animate();

///////////////
// FUNCIONES //
///////////////

/********
* init()
* Inicialización de las variables
********/
function init() 
{
	///////////
	// SCENE //
	///////////

	scene = new THREE.Scene();
	
	
	////////////
	// CAMERA //
	////////////

	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;	
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,-150,400);
	camera.lookAt(scene.position);	
	
	
	//////////////
	// RENDERER //
	//////////////

	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// attach renderer to the container div
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );

	/* Postprocesado
	*
	* Shaders para bloom
	* Fuente: https://threejs.org/examples/webgl_postprocessing_unreal_bloom_selective
	*
	*/

	var renderScene = new RenderPass( scene, camera );
	renderScene.clear = true;

	const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 3., 1, 0.85 );

	composerScene = new EffectComposer(renderer);
	composerScene.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	composerScene.addPass(renderScene);
	composerScene.addPass(bloomPass);
	composerScene.renderToScreen = false;


	var finalPass = new ShaderPass(
		new THREE.ShaderMaterial( {
			uniforms: {
				baseTexture: { value: null },
				bloomTexture: { value: composerScene.renderTarget2.texture }
			},
			vertexShader: document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
			defines: {}
		} ), "baseTexture"
	);
	finalPass.needsSwap = true;

	finalComposer = new EffectComposer( renderer );
	finalComposer.addPass(renderScene);
	finalComposer.addPass(finalPass);


	/////////////
	// EVENTOS //
	/////////////

	// automatically resize renderer
	THREEx.WindowResize(renderer, camera);
	// Pulsar m para pantalla completa
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	

	//////////////
	// CONTROLES //
	//////////////

	controls = new OrbitControls( camera, renderer.domElement );	

	///////////
	// LUCES //
	///////////
	
	// Luz ambiente
	var ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
	scene.add(ambientLight);
	
	// Luz solar
    var sunLight = new THREE.PointLight( 0xffffff, 1.5, 0, 0);
    sunLight.castShadow = true;
    sunLight.position.set(0, 0, 0);
    scene.add( sunLight );


	///////////////
	// GEOMETRÍA //
	///////////////

	// Sun
	var sunTexture = new THREE.TextureLoader().load( "images/textures/planets/sun.jpg" );
    sunTexture.wrapS = THREE.RepeatWrapping;
	sunTexture.wrapT = THREE.RepeatWrapping;

	var sunGeometry= new THREE.SphereGeometry( 12.92, 16, 16 );
	var sunMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, map: sunTexture } );
	sun = new THREE.Mesh( sunGeometry, sunMaterial );
	sun.position.set(0, 0, 0);
	sun.rotateX (Math.PI/2);
	sun.layers.enable(1);
	scene.add(sun);
	planetSelect = sun;

	// Mercury
	var mercuryTexture = new THREE.TextureLoader().load( "images/textures/planets/mercury.jpg" );
    mercuryTexture.wrapS = THREE.RepeatWrapping;
	mercuryTexture.wrapT = THREE.RepeatWrapping;
	var mercuryGeometry= new THREE.SphereGeometry( 1.244, 16, 16 );
	var mercuryMaterial = new THREE.MeshLambertMaterial( {map: mercuryTexture} );
	mercury = new THREE.Mesh( mercuryGeometry, mercuryMaterial );
	mercury.name = "mercury";
	mercury.position.set(OrbitMercury, 0, 0); 	// Pos incicial (OrbitMercury: radio en X)
	mercury.rotateX (Math.PI/2); 				// Verticales con respecto al libro
	mercury.orbitX = OrbitMercury; 				// Eje X, el Y se calculo después automaticacmente para calcular la elipse dependiendo de su excentricidad.
	mercury.velocity = VelocityMercury; 		// Velocidad de rotación
	mercury.e = EccentricityMercury; 			// Excentricidad de la elipse
	mercury.time = 0; 							// Tiempo en el que se encuentra. No usamos el tiempo real (global) para que cuando pausamos el planeta y
					  							// el resto sigue rotando, cuando deje de estar en pausa continue desde donde está y no se teletransporte.
	mercury.desfaseInicial = Math.random() * (2*Math.PI); // Desfase inicial para que no se posicionen todos los planetas en linea inicialmente.
	planets.push(mercury);
	scene.add(mercury);

	// Venus
	var venusTexture = new THREE.TextureLoader().load( "images/textures/planets/venus.jpg" );
    venusTexture.wrapS = THREE.RepeatWrapping;
	venusTexture.wrapT = THREE.RepeatWrapping;

	var venusGeometry= new THREE.SphereGeometry( 1.609, 16, 16 );
	var venusMaterial = new THREE.MeshLambertMaterial( {map: venusTexture} );
	venus = new THREE.Mesh( venusGeometry, venusMaterial );
	venus.name = "venus";
	venus.position.set(OrbitVenus, 0, 0);
	venus.rotateX (-(Math.PI/2));
	venus.orbitX = OrbitVenus;
	venus.velocity = VelocityVenus;
	venus.e = EccentricityVenus;
	venus.time = 0;
	venus.desfaseInicial = Math.random() * (2*Math.PI);
	planets.push(venus);
	scene.add(venus);

	// Earth
	var earthTexture = new THREE.TextureLoader().load( "images/textures/planets/earth/earth.png" );
    earthTexture.wrapS = THREE.RepeatWrapping;
	earthTexture.wrapT = THREE.RepeatWrapping;

	var earthGeometry= new THREE.SphereGeometry( 1.6378, 16, 16 );
	var earthMaterial = new THREE.MeshLambertMaterial( {map: earthTexture} );
	earthMaterial.transparent = true;
	var earthPlanet = new THREE.Mesh( earthGeometry, earthMaterial );

	var earthWaterTexture = new THREE.TextureLoader().load( "images/textures/planets/earth/water.png" );
    earthWaterTexture.wrapS = THREE.RepeatWrapping;
	earthWaterTexture.wrapT = THREE.RepeatWrapping;

	var earthWaterGeometry= new THREE.SphereGeometry( 1.6378, 16, 16 );
	var earthWaterMaterial = new THREE.MeshPhongMaterial( {map: earthWaterTexture} );
	earthWaterMaterial.transparent = true;
	var earthWaterPlanet = new THREE.Mesh( earthWaterGeometry, earthWaterMaterial );

	var earthCloudsTexture = new THREE.TextureLoader().load( "images/textures/planets/earth/earth-clouds.png" );
    earthCloudsTexture.wrapS = THREE.RepeatWrapping;
	earthCloudsTexture.wrapT = THREE.RepeatWrapping;

	var earthCloudsGeometry= new THREE.SphereGeometry( 1.68, 16, 16 );
	var earthCloudsMaterial = new THREE.MeshPhongMaterial( {map: earthCloudsTexture} );
	earthCloudsMaterial.transparent = true;
	var earthCloudsPlanet = new THREE.Mesh( earthCloudsGeometry, earthCloudsMaterial );



	earth = new THREE.Group(); // Creamos un grupo que contiene la tierra, el agua y las nubes. El agua tiene una iluminación diferente.
	earth.name = "earth";
	earth.add( earthPlanet );
	earth.add( earthWaterPlanet );
	earth.add( earthCloudsPlanet);
	earth.position.set(OrbitEarth, 0, 0);
	earth.rotateX (Math.PI*0.35);
	earth.orbitX = OrbitEarth;
	earth.velocity = VelocityEarth;
	earth.e = EccentricityEarth;
	earth.time = 0;
	earth.desfaseInicial = Math.random() * (2*Math.PI); 
	planets.push(earth);
	scene.add(earth);

	// Mars
	var marsTexture = new THREE.TextureLoader().load( "images/textures/planets/mars.jpg" );
    marsTexture.wrapS = THREE.RepeatWrapping;
	marsTexture.wrapT = THREE.RepeatWrapping;

	var marsGeometry= new THREE.SphereGeometry( 1.338, 16, 16 );
	var marsMaterial = new THREE.MeshLambertMaterial( {map: marsTexture} );
	mars = new THREE.Mesh( marsGeometry, marsMaterial );
	mars.name = "mars";
	mars.position.set(OrbitMars, 0, 0);
	mars.rotateX (Math.PI*0.36);
	mars.orbitX = OrbitMars;
	mars.velocity = VelocityMars;
	mars.e = EccentricityMars;
	mars.time = 0;
	mars.desfaseInicial = Math.random() * (2*Math.PI); 
	planets.push(mars);
	scene.add(mars);

	// Jupiter
	var jupiterTexture = new THREE.TextureLoader().load( "images/textures/planets/jupiter.jpg" );
    jupiterTexture.wrapS = THREE.RepeatWrapping;
	jupiterTexture.wrapT = THREE.RepeatWrapping;

	var jupiterGeometry= new THREE.SphereGeometry( 7.14, 32, 32 );
	var jupiterMaterial = new THREE.MeshLambertMaterial( {map: jupiterTexture} );
	jupiter = new THREE.Mesh( jupiterGeometry, jupiterMaterial );
	jupiter.name = "jupiter";
	jupiter.position.set(OrbitJupiter, 0, 0);
	jupiter.rotateX (Math.PI*0.48);
	jupiter.orbitX = OrbitJupiter;
	jupiter.velocity = VelocityJupiter;
	jupiter.e = EccentricityJupiter;
	jupiter.time = 0;
	jupiter.desfaseInicial = Math.random() * (2*Math.PI); 
	planets.push(jupiter);
	scene.add(jupiter);

	// Saturn
	var saturnTexture = new THREE.TextureLoader().load( "images/textures/planets/saturn.jpg" );
    saturnTexture.wrapS = THREE.RepeatWrapping;
	saturnTexture.wrapT = THREE.RepeatWrapping;

	var saturnGeometry= new THREE.SphereGeometry( 6.00, 32, 32 );
	var saturnMaterial = new THREE.MeshLambertMaterial( {map: saturnTexture} );
	var satPlanet = new THREE.Mesh( saturnGeometry, saturnMaterial );
	

	//Saturn's Rings
	var ringsTexture = new THREE.TextureLoader().load( "images/textures/planets/saturn-ring.png" );
    ringsTexture.wrapS = THREE.RepeatWrapping;
	ringsTexture.wrapT = THREE.RepeatWrapping;
	
	var ringsGeometry = new THREE.RingGeometry( 7, 11, 32 );
	var ringsMaterial = new THREE.MeshBasicMaterial( {map: ringsTexture, side: THREE.DoubleSide, transparent: true} );
	var rings = new THREE.Mesh( ringsGeometry, ringsMaterial );
	rings.rotateX (-Math.PI/2);
	
	saturn = new THREE.Group(); // Agrupa saturno y su anillo
	saturn.name = "saturn";
	saturn.add( satPlanet );
	saturn.add( rings );
	saturn.position.set(OrbitSaturn, 0, 0);
	saturn.rotateX (Math.PI*0.35);
	saturn.orbitX = OrbitSaturn;
	saturn.velocity = VelocitySaturn;
	saturn.e = EccentricitySaturn;
	saturn.time = 0;
	saturn.desfaseInicial = Math.random() * (2*Math.PI); 
	planets.push(saturn);
	scene.add( saturn );


	// Uranus
	var uranusTexture = new THREE.TextureLoader().load( "images/textures/planets/uranus.jpg" );
    uranusTexture.wrapS = THREE.RepeatWrapping;
	uranusTexture.wrapT = THREE.RepeatWrapping;

	var uranusGeometry= new THREE.SphereGeometry( 3.50, 32, 32);
	var uranusMaterial = new THREE.MeshLambertMaterial( {map: uranusTexture} );
	uranus = new THREE.Mesh( uranusGeometry, uranusMaterial );
	uranus.name = "uranus";
	uranus.position.set(OrbitUranus, 0, 0);
	uranus.orbitX = OrbitUranus;
	uranus.velocity = VelocityUranus;
	uranus.e = EccentricityUranus;
	uranus.time = 0;
	uranus.desfaseInicial = Math.random() * (2*Math.PI); 
	planets.push(uranus);
	scene.add(uranus);

	// Neptune
	var neptuneTexture = new THREE.TextureLoader().load( "images/textures/planets/neptune.jpg" );
    neptuneTexture.wrapS = THREE.RepeatWrapping;
	neptuneTexture.wrapT = THREE.RepeatWrapping;

	var neptuneGeometry= new THREE.SphereGeometry( 3.25, 32, 32);
	var neptuneMaterial = new THREE.MeshLambertMaterial( {map: neptuneTexture} );
	neptune = new THREE.Mesh( neptuneGeometry, neptuneMaterial );
	neptune.name = "neptune";
	neptune.position.set(OrbitNeptune, 0, 0);
	neptune.rotateX (Math.PI*0.34);
	neptune.orbitX = OrbitNeptune;
	neptune.velocity = VelocityNeptune;
	neptune.e = EccentricityNeptune;
	neptune.time = 0;
	neptune.desfaseInicial = Math.random() * (2*Math.PI); 
	planets.push(neptune);
	scene.add(neptune);

	// Pluto
	var plutoTexture = new THREE.TextureLoader().load( "images/textures/planets/pluto.jpg" );
    plutoTexture.wrapS = THREE.RepeatWrapping;
	plutoTexture.wrapT = THREE.RepeatWrapping;
	
	var plutoGeometry= new THREE.SphereGeometry( 0.8, 16, 16 );
	var plutoMaterial = new THREE.MeshLambertMaterial( {map: plutoTexture} );
	pluto = new THREE.Mesh( plutoGeometry, plutoMaterial );
	pluto.name = "pluto";
	pluto.position.set(OrbitPluto, 0, 0);
	pluto.rotateX (Math.PI*0.68);
	pluto.orbitX = OrbitPluto;
	pluto.velocity = VelocityPluto;
	pluto.e = EccentricityPluto;
	pluto.time = 0;
	pluto.desfaseInicial = Math.random() * (2*Math.PI); 
	planets.push(pluto);
	scene.add(pluto);
	
	// Se asigna la orbitaY a partir de la orbitaX a cada planeta
	for (var i = 0; i < planets.length; i++) {
		planets[i].orbitY = Math.sqrt(Math.pow(planets[i].orbitX, 2) - Math.pow(planets[i].orbitX, 2) * Math.pow(planets[i].e, 2));
	}
	
	// Libro
	let loader = new GLTFLoader();
	loader.load('models/libro/scene.gltf', function(gltf){
		var libro = gltf.scene.children[0];
		libro.scale.set(150,150,150);
		libro.position.set(0, 0, -50);
		scene.add(gltf.scene);
	});

	createOrbitDraws(); // Crea la geometría de el dibujo de las orbitas de cada planeta.

	// Estrellas
		// Sistema de partículas
	var numStars = 500,
		stars = new THREE.Geometry(),
		starsMaterial = new THREE.PointsMaterial({
					color: 0xFFFFFF,
					size: 1.5,
					sizeAttenuation:false
		});
		// Las posiciona aleatoriamente dentro de un rango.
	for (var i = 0; i < numStars; i++) {
		var pX = Math.random() * 1000 - 500;
		var pY = Math.random() * 1000 - 500;
		var pZ = Math.random() * 1000 - 500;
		var star = new THREE.Vector3(pX, pY, pZ);
		stars.vertices.push(star);
	}

	var particleSystemStars = new THREE.Points(stars, starsMaterial);
	scene.add(particleSystemStars);

	// Cinturon asteroides
		// En este caso no se ha utilizado un sistema de aprticula porque queremos que cada asteoride tenga diferentes tamaños y que sean meshes.
	for (var i = 0 ; i < NumAsteroids; i++){
		var angle = Math.random() * (2*Math.PI);
		var radius = 75;
		var tamAsteroide = 0.7;
		var asteroidGeometry = new THREE.IcosahedronGeometry(Math.random() * tamAsteroide, 0);
		asteroids[i] = new THREE.Mesh( asteroidGeometry, plutoMaterial );
		asteroids[i].position.set(Math.sin(angle)*radius  + (Math.random()*10 - 5), Math.cos(angle)*radius + (Math.random()*10 - 5), (Math.random()*6 - 3));
		asteroids[i].rotation.set(Math.random() * (2*Math.PI), Math.random() * (2*Math.PI), Math.random() * (2*Math.PI));

		asteroids[i].radius = Math.sqrt(Math.pow(asteroids[i].position.x, 2) + Math.pow(asteroids[i].position.y, 2));
		asteroids[i].velocity = Math.random() * 0.1;
		scene.add(asteroids[i]);
	
	
	}
}

/********
* updateOrbit()
* Actualiza la posición de los planetas y los asteroides
********/
function updateOrbit() { 
	var tiempo = Date.now() * 0.001;
	for (var i = 0; i < planets.length; i++) {
		if (planetSelectId != planets[i].name){
			var ang = planets[i].time * planets[i].velocity + planets[i].desfaseInicial;
			planets[i].position.x = Math.cos(ang) * planets[i].orbitX;
			planets[i].position.y = Math.sin(ang) * planets[i].orbitY;	
			planets[i].time += 0.03;
		}

		planets[i].rotation.y = tiempo * 0.2; 
	}

	for(var i = 0; i < NumAsteroids; i++){
		asteroids[i].position.x =  Math.cos(tiempo * asteroids[i].velocity) * asteroids[i].radius;
		asteroids[i].position.y =  Math.sin(tiempo * asteroids[i].velocity) * asteroids[i].radius;
	}
}

/********
* createOrbitDraws()
* Crea lineas que marcan las trayectorias de las órbitass y las añade a la escena
********/
function createOrbitDraws(){
	//var materialOrbita = new THREE.LineBasicMaterial( { color: 0xffff00 } );
	var materialOrbita = new THREE.LineDashedMaterial( {
	color: 0x514627,
	linewidth: 0.01,
	scale: 1,
	dashSize: 1,
	gapSize: 3,
	} );
	for (var i = 0; i < planets.length; i++) {
		
		var points = [];
		var incr = 2*Math.PI / 100;
		var posX = planets[i].position.x;
		var posY = planets[i].position.y;

		for(var ang = 0; ang <= (2*Math.PI + incr); ang += incr){
			points.push(new THREE.Vector3( posX, posY, 0 ));
			posX = Math.cos(ang) * planets[i].orbitX;
			posY = Math.sin(ang) * planets[i].orbitY;
		}
		
		var orbitDrawGeometry = new THREE.BufferGeometry().setFromPoints( points );
		var orbitDraw = new THREE.Line(  orbitDrawGeometry, materialOrbita );
		orbitDraw.computeLineDistances();
		scene.add(orbitDraw);
	}
}

/********
* moveCamera()
* Cambia la posición origen y destino para que Tween interpole entre ellas al mover la cámara.
* También indica que astro está seleccionado.
********/
var moveCamera = function(planetSelec) {
	switch(planetSelec){
		case "sun":
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: sun.position.x, y: sun.position.y - 20, z: sun.position.z + 40};
			planetSelect = sun;
		break;
		
		case "mercury":
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: mercury.position.x, y: mercury.position.y - 10, z: mercury.position.z + 5};
			planetSelect = mercury;
				
		break;

		case "venus":
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: venus.position.x, y: venus.position.y - 10, z: venus.position.z + 5};
			planetSelect = venus;
		break;

		case "earth":
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: earth.position.x, y: earth.position.y - 10, z: earth.position.z + 5};
			planetSelect = earth;
		break;

		case "mars":
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: mars.position.x, y: mars.position.y - 10, z: mars.position.z + 5};
			planetSelect = mars;
		break;

		case "jupiter":
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: jupiter.position.x, y: jupiter.position.y - 20, z: jupiter.position.z + 10};
			planetSelect = jupiter;
		break;

		case "saturn":
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: saturn.position.x, y: saturn.position.y - 20, z: saturn.position.z + 10};
			planetSelect = saturn;
		break;
			
		case "uranus":
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: uranus.position.x, y: uranus.position.y - 15, z: uranus.position.z + 5};
			planetSelect = uranus;
		break;
		 
		case "neptune":
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: neptune.position.x, y: neptune.position.y - 15, z: neptune.position.z + 5};
			planetSelect = neptune;
		break;
			
		case "pluto":
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: pluto.position.x, y: pluto.position.y - 10, z: pluto.position.z + 5};
			planetSelect = pluto;
		break;

		default:
			posOrigen = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
			posDestino = {x: 0, y: -150, z: 400};
			planetSelect = sun;	
	}
	createTween();
}
window.moveCamera = moveCamera;  // Hacer global para poder usarla fuera del ambito del modulo (en el html).

/********
* createTween()
* Crea los objetos interpoladores (Tween) para la posición de la camera y a donde está mirando (lookAt).
********/
function createTween(){
	var tween = new TWEEN.Tween(posOrigen);
	tween.to(posDestino, 2000);
	tween.easing(TWEEN.Easing.Sinusoidal.InOut);
	tween.onUpdate(function(){
		camera.position.set(posOrigen.x, posOrigen.y, posOrigen.z);
	});

	lookAtDestino.x = planetSelect.position.x;
	lookAtDestino.y = planetSelect.position.y;
	lookAtDestino.z = planetSelect.position.z;

	var tweenLookAt = new TWEEN.Tween(lookAtOrigen);
	tweenLookAt.to(lookAtDestino, 2000);
	tweenLookAt.easing(TWEEN.Easing.Sinusoidal.InOut);
	tweenLookAt.onUpdate(function(){
		controls.target.set( lookAtOrigen.x, lookAtOrigen.y, lookAtOrigen.z ); // Se usa controls.target en vez de lookAt porque la camara la controla orbitControls
	});

	
	tweenLookAt.start();
	tween.start();
}

/********
* activatePlanet()
* Cambia el origen de interpolación de a donde mira la cámara y llama
* a las funciones necesarias para actualzar el estado de la animación.
********/
var activatePlanet = function(element){
	// Coge a donde está mirando en este momento como inicio de la interpolación.
	lookAtOrigen.x = controls.target.x;
	lookAtOrigen.y = controls.target.y;
	lookAtOrigen.z = controls.target.z;
	
	mostrarInfo(element);
	planetSelectId = element.id;
	moveCamera(planetSelectId);
}
window.activatePlanet = activatePlanet; // Hacer global para poder usarla fuera del ambito del modulo (en el html).

/********
* mostarInfo()
* Actualiza la UI para que se mustre la información correspondiente al astro seleccionado. 
********/
function mostrarInfo(element) {
	var ultimaInfo = planetSelectId + "Info";
	var nuevaInfo = element.id + "Info";
	var general = document.getElementById("informacion");

	if(!Gmostrado){
		general.style.display = "block";
		Gmostrado = true;
	}

	if(Pmostrado){
		var ult = document.getElementById(ultimaInfo);
		ult.style.display = "none";
		Pmostrado = false;
	}

	var nuevo = document.getElementById(nuevaInfo);
	nuevo.style.display = "block";
	Pmostrado = true;
	
}

/********
* ocultarInfo()
* Oculta la información del asstro seleccionado.
********/
var ocultarInfo = function() {
	var general = document.getElementById("informacion");
	var ultimaInfo = planetSelectId + "Info";
	var ult = document.getElementById(ultimaInfo);

	general.style.display = "none";
	ult.style.display = "none";
	Gmostrado = false;
	Pmostrado = false;

}
window.ocultarInfo = ocultarInfo; 

/********
* animate()
* Crea el bucle de animación.
********/
function animate() 
{

	requestAnimationFrame( animate );
	render();		
	update();
}

/********
* update()
* Actualiza el estado de la animación
********/
function update()
{
	// delta = change in time since last call (in seconds)
	var delta = clock.getDelta(); 

	updateOrbit();
	TWEEN.update();	
	controls.update();
}

/********
* render()
* Renderiza la escena
********/
function render() 
{	
	// Renderiza la escene con bloom
	renderBloom(true);
	// renderiza oda la escena, con el bloom por encima
	finalComposer.render();	
}

/********
* resizeRender()
* Redimensiona los Scene Composer.
********/
function resizeRender(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	composerScene.setSize(window.innerWidth, window.innerHeight);
	finalComposer.setSize(window.innerWidth, window.innerHeight);
}

/* Functiones para el bloom
*	Fuente: https://threejs.org/examples/webgl_postprocessing_unreal_bloom_selective
*/

/********
* renderBloom()
* Renderiza el composer que hace el efecto de Bloom
********/
function renderBloom( mask ) {

	if ( mask === true ) { // Para crear la máscara, pone los objetos indeseados en negro, renderiza y después les devuelve el material original.

		scene.traverse( darkenNonBloomed );
		composerScene.render();
		scene.traverse( restoreMaterial );

	}
}

/********
* darkenNonBloomed()
* Cambia el material de los objetos que no se quieren bloomear y los deja en negro.
********/
function darkenNonBloomed( obj ) {

	if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

		materials[ obj.uuid ] = obj.material;
		obj.material = darkMaterial;

	}

}

/********
* restoreMaterial()
* Restablece el material del objeto.
********/
function restoreMaterial( obj ) {

	if ( materials[ obj.uuid ] ) {

		obj.material = materials[ obj.uuid ];
		delete materials[ obj.uuid ];

	}

}


window.addEventListener("resize", resizeRender);