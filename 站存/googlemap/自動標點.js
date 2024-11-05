let map;

async function initMap() {
  let a;
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
    title: "",
  });

  //新增標點
  const marker1 = new AdvancedMarkerElement({
    map: map,
    position: position1,
    title: "taipai",
  });

  // 設定資訊視窗（InfoWindow）內容
  const infoWindowContent = `
            <div>
                <h3>台北車站</h3>
                <p>店家資訊：</p>
                <ul>
                    <li>無</li>
                    <li>無</li>
                    <li>無</li>
                    <li>無</li>
                    <li>無</li>
                    <li>無</li>
                    <li>無</li>
                    <li>無</li>
                </ul>
                <p>營業時間：</p>
                <ul>
                    <li>無</li>
                </ul>
                <p>地址：</p>
            </div>
        `;
         // 建立資訊視窗
        const infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent,
      });

  //點擊顯示店家資訊
  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
  marker1.addListener("click", () => {

    
    // window.open("標點申請單.html");


  });
  
}

initMap();











//arr標點
/*let map;
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
//   });

//   //新增標點
//   const marker1 = new AdvancedMarkerElement({
//     map: map,
//     position:position,
//   });
  
//   const marker2 = new AdvancedMarkerElement({
//     map: map,
//     position: position2,
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

*/