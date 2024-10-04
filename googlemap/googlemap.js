let map;

async function initMap() {

  const position = { lat: 25.049212, lng: 121.514012 };
  const position1 = { lat: 25.049111, lng: 121.514333 };//新增標點


  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 15,
    center: position,
    mapId: "DEMO_MAP_ID",
  });
  
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Uluru",
  });

  //新增標點
  const marker1 = new AdvancedMarkerElement({
    map: map,
    position: position1,
    title: "taipai",
  });
  
}

initMap();

