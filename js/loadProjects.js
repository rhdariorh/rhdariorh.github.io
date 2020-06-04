// Tags color: blue, lightBlue, green, violet, pink, red, orange, yellow. 
let proyectos = [
    {
    "projectName": "Proyecto final de herramientas de animación",
    "active": true,
    "briefDescription": "Creación de un Add-on para la interpolación de trayectorias con oscilación y orientación con diferentes método de interpolación.",
    "tags": [ "Python", "Blender", "Universidad"],
    "tagsColor": ["yellow", "orange", "blue"],
    "date": "11/2019",
    "siteSource": "proyectos/proyectoAnimacion.html",
    "imgSource": "media/images/proyectoAnimacion.png"
    },
    {
    "projectName": "Simulación de mallas deformables",
    "active": true,
    "briefDescription": "Implementación de estructuras 2D y 1D para la simulación de diferentes materiales.",
    "tags": ["Processing", "Universidad"],
    "tagsColor": ["violet", "blue"],
    "date": "04/2020",
    "siteSource": "proyectos/proyectoMallasDeformables.html",
    "imgSource": "media/images/proyectoMallasDeformables.gif"
    },
    {
    "projectName": "Sistema Solar interactivo",
    "active": true,
    "briefDescription": "Sistema Solar web interactivo y educativo.",
    "tags": ["Three.js", "Universidad"],
    "tagsColor": ["pink", "blue"],
    "date": "04/2020",
    "siteSource": "proyectos/proyectoSistemaSolarThree.html",
    "imgSource": "media/images/sistemaSolarThree.png"
    },
    {
    "projectName": "Colisión de particulas",
    "active": true,
    "briefDescription": "Simulación de colisiones a través diferentes métodos y estructuras de datos.",
    "tags": [ "Processing", "Universidad"],
    "tagsColor": ["violet", "blue"],
    "date": "04/2020",
    "siteSource": "proyectos/proyectoColision.html",
    "imgSource": "media/images/collisions.gif"
    },
    {
<<<<<<< HEAD
    "projectName": "Integradores numéricos en simulación",
=======
    "projectName": "Emisores de partículas",
>>>>>>> 0d78ca1b5beff6f14d8c06edd0734a2e7f7b388d
    "active": true,
    "briefDescription": "Implementación y análisis de diferentes métodos de integración utilizados en simulación.",
    "tags": [ "Processing", "Excel", "Universidad"],
    "tagsColor": ["violet", "green", "blue"],
    "date": "03/2020",
<<<<<<< HEAD
    "siteSource": "proyectos/proyectoIntegradores.html",
    "imgSource": "media/images/integracion.png"
=======
    "siteSource": "proyectos/proyectoEmisores.html",
    "imgSource": "media/images/fireworks.gif"
>>>>>>> 0d78ca1b5beff6f14d8c06edd0734a2e7f7b388d
    },
    {
    "projectName": "Emisores de partículas",
    "active": true,
    "briefDescription": "Implementación de emisores de partículas con diferentes formas.",
    "tags": [ "Processing", "Universidad"],
    "tagsColor": ["violet", "blue"],
    "date": "03/2020",
<<<<<<< HEAD
    "siteSource": "proyectos/proyectoEmisores.html",
    "imgSource": "media/images/fireworks.gif"
=======
    "siteSource": "proyectos/proyectoFireworks.html",
    "imgSource": "media/images/solidoRigido.png"
>>>>>>> 0d78ca1b5beff6f14d8c06edd0734a2e7f7b388d
    },
    {
    "projectName": "Sólido rígido",
    "active": true,
    "briefDescription": "Cálculo de velocidad angular a partir de la velocidad lineal para la rotacion de una esfera sin deslizamiento.",
    "tags": [ "Processing", "Universidad"],
    "tagsColor": ["violet", "blue"],
    "date": "05/2020",
<<<<<<< HEAD
    "siteSource": "proyectos/proyectoSolidoRigido.html",
    "imgSource": "media/images/solRigido.png"
    },
    {
    "projectName": "OpenGL, OSG y POV-Ray",
    "active": true,
    "briefDescription": "aaa.",
    "tags": [ "OpenGL", "OSG", "POV-Ray", "Universidad"],
    "tagsColor": ["lightBlue", "red", "green", "blue"],
    "date": "05/2020",
    "siteSource": "proyectos/proyectoSolidoRigido.html",
    "imgSource": "media/images/solRigido.png"
=======
    "siteSource": "proyectos/proyectoFireworks.html",
    "imgSource": "media/images/solidoRigido.png"
>>>>>>> 0d78ca1b5beff6f14d8c06edd0734a2e7f7b388d
    }
];

function loadProjects() {
    var elem = document.getElementById('projects');
    if(!elem) return;
    var i, j;
    str = "";
    // loop through all elements in the array, building a form for each object
    for (i = 0; i < proyectos.length; i++ ) {
        str += '<div class="col-xl-6 mb-5">'
                + '<a class="contenedor1 show-on-scroll "href="'+ proyectos[i].siteSource +'">'
                    + '<div class="contenedor1Above">'
                        + '<h2>' + proyectos[i].projectName + '</h2><p>'
                        + proyectos[i].briefDescription + '</p>'
                    + '</div>'
                    + '<div class="contenedor1Under">'
                        + '<img src="'+ proyectos[i].imgSource +'" alt="'+ proyectos[i].projectName +'">'
                        + '<div class="centroContenedor1 d-flex justify-content-center align-items-center">'
                            + '<h2>' + proyectos[i].projectName + '</h2>'
                        + '</div>'
                        + '<div class="contenedor1UnderBottom d-flex flex-wrap justify-content-center align-items-center">';
                            for(j = 0; j < proyectos[i].tags.length; j++){
                                str += '<div class="tag mt-2 '+proyectos[i].tagsColor[j]+'"> <span>' + proyectos[i].tags[j] + '</span></div>';
                            }
                    str += '</div>'
                    + '</div>'
                + '</a>'
            + '</div>';
    /*    for(j = 0; j < proyectos[i].tags.length; j++){
            str += '<div class="tag '+proyectos[i].tagsColor[j]+'"> <span>' + proyectos[i].tags[j] + '</span></div>';
        }*/
        
    };
    elem.innerHTML = str;
}

//loadProjects();

window.addEventListener('load', loadProjects);