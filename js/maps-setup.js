// initialize the variables we need
// we do this here to make sure we can access them
// whenever we need to -- they have 'global scope'
var my_map; // this will hold the map
var my_map_options; // this will hold the options we'll use to create the map
var my_center = new google.maps.LatLng(26.199022, 101.325066); // center of map
var my_markers = []; // we use this in the main loop below to hold the markers
// this one is strange.  In google maps, there is usually only one
// infowindow object -- its content and position change when you click on a
// marker.  This is counterintuitive, but we need to live with it.  
var infowindow = new google.maps.InfoWindow({content: ""});
var legendHTML = "<h1>Legend</h1>";

// I'm complicating things a bit with this next set of variables, which will help us
// to make multi-colored markers
var blueURL = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
var redURL = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
var greenURL = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
var purpleURL = "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
var yellowURL = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
var red_markers = [];
var blue_markers = [];
var green_markers = [];
var purple_markers = [];
var yellow_markers = []

// this is for fun, if you want it.  With this powerful feature you can add arbitrary
// data layers to your map.  It's cool. Learn more at:
// https://developers.google.com/maps/documentation/javascript/datalayer#load_geojson
var myGeoJSON = {
    "type": "FeatureCollection",
    "features":
        [{
            "type": "Feature",
            "properties": {myColor: 'red'},
            "myColor": "red",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[-85.60546875, 49.03786794532644], [-96.6796875, 40.713955826286046],
                    [-79.62890625, 37.71859032558816], [-81.2109375, 49.26780455063753],
                    [-85.60546875, 49.03786794532644]]]
            }
        },
            {
                "type": "Feature",
                "properties": {myColor: 'green'},
                "myColor": "green",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-113.203125, 58.35563036280967], [-114.78515624999999, 51.944264879028765],
                        [-101.6015625, 51.944264879028765], [-112.32421875, 58.263287052486035],
                        [-113.203125, 58.35563036280967]]]
                }
            },
            {
                "type": "Feature",
                "properties": {myColor: 'red'},
                "myColor": "red",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[22.966458, 97.752535], [24.880095, 102.832891],
                        [22.966458, 97.752535]]]
                }
            }]
};


/* a function that will run when the page loads.  It creates the map
 and the initial marker.  If you want to create more markers, do it here. */
function initializeMap() {
    my_map_options = {
        center: my_center, // to change this value, change my_center above
        zoom: 6,  // higher is closer-up
        mapTypeId: google.maps.MapTypeId.HYBRID // you can also use TERRAIN, STREETMAP, SATELLITE
    };

    // this one line creates the actual map
    my_map = new google.maps.Map(document.getElementById("map_canvas"),
        my_map_options);
    // this is an *array* that holds all the marker info
    var all_my_markers =
        [{
            position: new google.maps.LatLng(22.966458, 97.752535),
            map: my_map,
            icon: blueURL, // this sets the image that represents the marker in the map to the one
                           // located at the URL which is given by the variable blueURL, see above
            title: "Burma, Lashio",
            window_content: "<h4>Burma, Lashio</h4><p>Blue Marker: The starting destination of the Burma Road.</p>"
        },
            {
                position: new google.maps.LatLng(29.431586, 106.912251),
                map: my_map,
                icon: redURL, // this sets the image that represents the marker in the map
                title: "Chongqing, China",
                window_content: "<h4>Chongqing, China</h4><p>Red Marker: Japanese occupied Wuhan and forced the Nationalist government to relocate to Chongqing</p>"
            },
            {
                position: new google.maps.LatLng(24.880095, 102.832891),
                map: my_map,
                icon: greenURL, // this sets the image that represents the marker in the map
                title: "Kuming, China",
                window_content: '<h4>Kuming, Chima</h4><p>Green Marker: The final destination of the transport system</p>'
            },
            {
                position: new google.maps.LatLng(26.647661, 106.630153),
                map: my_map,
                icon: purpleURL, // this sets the image that represents the marker in the map
                title: "Guiyang, China",
                window_content: '<h4>Guiyang, China</h4><p>Purple Marker: One of the stop of the Burma Road, knowned for its twenty four sharp bends road. Illustrated how difficult the mountain roads was</p>'
            }, {
            position: new google.maps.LatLng(27.294139, 95.737881),
            map: my_map,
            icon: yellowURL, // this sets the image that represents the marker in the map
            title: "Ledo, Assam, India",
            window_content: '<h4>Ledo, Assam, India</h4><p>Yellow Marker: Was a British colony. Also supplied sources to China from UK</p>'
        }
        ];

    for (j = 0; j < all_my_markers.length; j++) {
        var marker = new google.maps.Marker({
            position: all_my_markers[j].position,
            map: my_map,
            icon: all_my_markers[j].icon,
            title: all_my_markers[j].title,
            window_content: all_my_markers[j].window_content
        });

        // this next line is ugly, and you should change it to be prettier.
        // be careful not to introduce syntax errors though.  
        legendHTML +=
            "<div class=\"pointer\" onclick=\"locateMarker(my_markers[" + j + "])\"> " +
            marker.window_content + "</div>";
        marker.info = new google.maps.InfoWindow({content: marker.window_content});
        var listener = google.maps.event.addListener(marker, 'click', function () {
            // if you want to allow multiple info windows, uncomment the next line
            // and comment out the two lines that follow it
            //this.info.open(this.map, this);
            infowindow.setContent(this.window_content);
            infowindow.open(my_map, this);
        });
        my_markers.push({marker: marker, listener: listener});
        if (all_my_markers[j].icon == blueURL) {
            blue_markers.push({marker: marker, listener: listener});
        } else if (all_my_markers[j].icon == redURL) {
            red_markers.push({marker: marker, listener: listener});
        }
        else if (all_my_markers[j].icon == greenURL) {
            green_markers.push({marker: marker, listener: listener});
        }
        else if (all_my_markers[j].icon == purpleURL) {
            purple_markers.push({marker: marker, listener: listener});
        }
        else if (all_my_markers[j].icon == yellowURL) {
            yellow_markers.push({marker: marker, listener: listener});
        }

    }
    var legendCanvas = document.createElement("div");
    legendCanvas.innerHTML = legendHTML;
    legendCanvas.className = "legendCanvas"
    document.getElementById("map_legend").appendChild(legendCanvas);
    my_map.data.addGeoJson(myGeoJSON);


    var flightPlanCoordinates = [
        {lat: 27.294139, lng: 95.737881},
        {lat: 22.966458, lng: 97.752535},
        {lat: 24.880095, lng: 102.832891},
        {lat: 26.647661, lng: 106.630153},
        {lat: 29.431586, lng: 106.912251}
    ];
    var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(my_map);

    var romeCircle = new google.maps.Rectangle({
        strokeColor: '#fc8c41',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#fc8c41',
        fillOpacity: 0.35,
        // in general, we always have to *set the map* when we
        // add features.
        map: my_map,
        bounds: {
            north: 29.431586,
            south: 22.966458,
            east: 106.912251,
            west: 95.737881
        },

        center: {"lat": 26.199022, "lng": 101.325066},
        radius: 1000
    });
    my_map.data.setStyle(function (feature) {
        var thisColor = feature.getProperty("myColor");
        return {
            fillColor: thisColor,
            strokeColor: thisColor,
            strokeWeight: 5
        };

    });
}

// this hides all markers in the array
// passed to it, by attaching them to
// an empty object (instead of a real map)
function hideMarkers(marker_array) {
    for (var j in marker_array) {
        marker_array[j].marker.setMap(null);
    }
}

// by contrast, this attaches all the markers to
// a real map object, so they reappear
function showMarkers(marker_array, map) {
    for (var j in marker_array) {
        marker_array[j].marker.setMap(map);
    }
}

//global variable to track state of markers

var markersHidden = false;

function toggleMarkers(marker_array, map) {
    for (var j in marker_array) {
        if (markersHidden) {
            marker_array[j].marker.setMap(map);
        } else {
            marker_array[j].marker.setMap(null);
        }
    }
    markersHidden = !markersHidden;
}


// I added this for fun.  It allows you to trigger the infowindow
// from outside the map.  
function locateMarker(marker) {
    console.log(marker);
    my_map.panTo(marker.marker.position);
    google.maps.event.trigger(marker.marker, 'click');
}
