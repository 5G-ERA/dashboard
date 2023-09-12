$(function () {
    initMap()
});
//debugger;
var APIkey = '2lGWWmmQCVPdDYwJIcVGsgZ1m22nwvM7'
var points = []
var linestrings = []


function isMobileOrTablet() { var i, a = !1; return i = navigator.userAgent || navigator.vendor || window.opera, (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(i) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(i.substr(0, 4))) && (a = !0), a } window.isMobileOrTablet = window.isMobileOrTablet || isMobileOrTablet;

var points = [];
var linestrings = [];
var geojson = {
    'type': 'FeatureCollection',
    'features': []
}; 

var coordsEbos = "33.319328,35.121861:33.32054252731706,35.12263722873416:33.32165797403829,35.12381790704056:33.32306868606716,35.125642558031515:33.32293786809137,35.126152379687085:33.32280663906562,35.12647437066151:33.32215049393602,35.1267963603638:33.32139592703683,35.12701101945842:33.32093662544514,35.12727934253037"
var coordsMadrid = "-3.63284, 40.39853:-3.6323973034874766,40.39935768045208:-3.632252954059981,40.39974242970553:-3.631991320722646,40.399783652709424:-3.6313237046204803,40.39962563105744:-3.6284276942313545,40.39898667016093:-3.626415823882642,40.39843015086547:-3.62625343077671,40.39818967815252:-3.6255948365137622,40.39800417004424" // -3.626109081349214:40.398141583506856"
var coords = coordsMadrid;
var map

function initMap() {
    //debugger;
    var centerEbos = [33.319328, 35.121861];
    var centerMardid = [-3.63284, 40.39853];
    var center = centerMardid;
    map = tt.map({
        key: APIkey,
        container: 'map',
        maxZoom: 17,
        minZoom: 7,
        zoom: 15,
        center: center,
        trackResize: true,
        dragPan: !isMobileOrTablet()
    });


    var points_toAdd = coords.split(":");
   
    for (var i = 0; i < points_toAdd.length; i++) {
        var point = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [
                    points_toAdd[i].split(",")[0],
                    points_toAdd[i].split(",")[1]
                ]
            },
            'properties': {
                'id': String(new Date().getTime()) + i.toString()
            }
        };
        points.push(point);
    }

    map.on('load', function () {

        map.addSource('geojson', {
            'type': 'geojson',
            'data': geojson
        });

        map.addLayer({
            id: 'measure-lines',
            type: 'line',
            source: 'geojson',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': '#e6462e',
                'line-width': 6
            },
            filter: ['in', '$type', 'LineString']
        });

        map.addLayer({
            id: 'measure-points',
            type: 'circle',
            source: 'geojson',
            dragable: true,
            paint: {
                'circle-radius': 2,
                'circle-color': '#3a3a3a',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#FFF'
            },
            filter: ['in', '$type', 'Point']
        });

        //map.on('click', function (event) {
        //    if (shouldRemovePoint(event.point)) {
        //        removePoint(event.point);
        //    } 
        //    else {
        //        addNewPoint(event.lngLat);
        //    }
        //    updateView();
        //});

        updateView();

    });
}


function shouldRemovePoint(point) {
    var features = map.queryRenderedFeatures(point, {
        layers: ['measure-points']
    });
    return features.length > 0;
}

function removePoint(point) {
    var features = map.queryRenderedFeatures(point, {
        layers: ['measure-points']
    });
    var id = features[0].properties.id;
    points = points.filter(function (point) {
        return point.properties.id !== id;
    });
}

function addNewPoint(lngLat) {
    var point = {
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [
                lngLat.lng,
                lngLat.lat
            ]
        },
        'properties': {
            'id': String(new Date().getTime())
        }
    };
    points.push(point);
}

function updateLines() {
    linestrings = [];
    for (var i = 1; i < points.length; ++i) {
        var greatCircle = turf.greatCircle(points[i - 1], points[i], {
            offset: 100
        });
        linestrings.push(greatCircle);
    }
}

function updateView() {
    updateLines();
    writeCoords();
    map.getSource('geojson').setData(getGeoJsonData());
}

function getGeoJsonData() {
    geojson.features = [];
    geojson.features = geojson.features.concat(linestrings).concat(points);

    return geojson;
}

function writeCoords() {

    var coordsFound = [];
    for (var i = 0; i < points.length; i++) {
        var lnglatFound = points[i]['geometry']['coordinates'][0] + "," + points[i]['geometry']['coordinates'][1]

        coordsFound.push(lnglatFound);
    }

    coords = coordsFound.join(":");
    //console.log(coords)
}