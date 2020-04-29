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
    "projectName": "Portfolio",
    "active": true,
    "briefDescription": "Desarrollo de portfolio personal.",
    "tags": ["HTML5", "JavaScript", "CSS5", "Bootstrap 4"],
    "tagsColor": ["orange", "yellow", "blue", "violet"],
    "date": "4/06/1965",
    "siteSource": "proyectos/proyectoAudio.html",
    "imgSource": "media/images/proyectoAudio.jpg"
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
    "projectName": "Emisor de partículas - Fuegos artificiales",
    "active": true,
    "briefDescription": "Implementación de emisores de partículas con diferentes formas.",
    "tags": [ "Processing", "Universidad"],
    "tagsColor": ["violet", "blue"],
    "date": "03/2020",
    "siteSource": "proyectos/proyectoFireworks.html",
    "imgSource": "media/images/fireworks.gif"
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
                        + '<div class="contenedor1UnderBottom d-flex justify-content-center align-items-center">';
                            for(j = 0; j < proyectos[i].tags.length; j++){
                                str += '<div class="tag '+proyectos[i].tagsColor[j]+'"> <span>' + proyectos[i].tags[j] + '</span></div>';
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