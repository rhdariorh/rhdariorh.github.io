function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation not supported");}
}
function showPosition(position){
    latitud = position.coords.latitude;
    longitud = position.coords.longitude;
    loadMap(latitud, longitud);
   // alert('Tus coordenadas son: ('+latitud+','+longitud+')');
}
function loadMap(latitud, longitud){
    var map = L.map('map').setView([latitud, longitud], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([latitud, longitud]).addTo(map)
        .bindPopup('¡Aquí estás tú!')
        .openPopup();
    L.marker([40.421463, -3.712314]).addTo(map)
        .bindPopup('VisualGear')
        .openPopup();
}
getLocation();