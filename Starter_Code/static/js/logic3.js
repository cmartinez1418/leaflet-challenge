// link to earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// call in data
d3.json(queryUrl).then(function (data) {
    //console.log(data.features)
    createFeatures(data.features);
});

//function to relate circle size to magnitude
function circleSize(magnitude) {
    return magnitude * 30000
};

//different color ranges for depth
function chooseColor(depth) {
    if (depth > 90) return "darkred";
    if (depth > 70) return "red";
    if (depth > 50) return "orange";
    if (depth > 30) return "yellow";
    if (depth > 10) return "yellowgreen";
    else return "green"
};

function createFeatures(earthquakeData) {

    //binds popups with info
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
        <hr><p>Magnitude: ${feature.properties.mag}<p>`);
    }
    //plots each earthquake
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            //changes the markers to circles
            var markers = {
                radius: circleSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 2,
                fillOpacity: "0.75"
            }
            return L.circle(latlng, markers)
        }
    });
    //creates map
    createMap(earthquakes);
}

function createMap(earthquakes) {
    
    //map baselayer
    var street =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    //creating basemap layer and earthquake map layer
    var baseMaps = {
        "Street Map": street
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };
    
    //puts base layer and earthquake layer in map
    var myMap = L.map("map", {
        center: [32.77586407059242, -96.8088843834698],
        zoom: 4,
        layers: [street, earthquakes]
    });

    //creates the legend and adds it to map
    var legend = L.control({ position: "bottomright"});

    legend.onAdd = function (map) {


        var div = L.DomUtil.create('div', 'info legend'),
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];
            div.innerHTML += "<h1>Depth</h1>";

        for (var i=0; i < depths.length; i++) {
            div.innerHTML += 
                '<i style="background:' + chooseColor(depths[i] +1) + '"></i> ' + 
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i +1] + '<br>' : '+');

        }

        return div;

    };

    legend.addTo(myMap);

}



