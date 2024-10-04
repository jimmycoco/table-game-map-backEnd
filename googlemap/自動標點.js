let map;
let marker=[];

async function initMap() {

  const position =  { lat: 25.049212, lng: 121.514012 };
  const position1= [{ lat: 25.049212, lng: 121.514012 },{ lat: 25.049111, lng: 121.514333 }];//新增標點
  const position2= { lat: 25.041234, lng: 121.513773 };



  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 15,
    center: position,
    mapId: "DEMO_MAP_ID",
  });
  
//   const marker = new AdvancedMarkerElement({
//     map: map,
//     position: position,
//     title: "Uluru",
//   });

//   //新增標點
//   const marker1 = new AdvancedMarkerElement({
//     map: map,
//     position:position,
//     title: "taipai",
//   });
  
//   const marker2 = new AdvancedMarkerElement({
//     map: map,
//     position: position2,
//     title: "taipai",
//   });

  for (let i=0; i<=5; i++){
    addmarker(i);
    
  }


function addmarker(a){
    marker[a]=new AdvancedMarkerElement({
          map:map,
        position:position1[a]
      
        
    })
}
}

initMap();

