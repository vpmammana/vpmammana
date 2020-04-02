import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import GPX from 'ol/format/GPX';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

var key = '8TjUJJjC4y0sGLxbssSW';
var attributions = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

var raster = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    maxZoom: 20,
  })
});

var style = {
  'Point': new Style({
    image: new CircleStyle({
      fill: new Fill({
        color: 'rgba(0,255,0,0.4)'
      }),
      radius: 5,
      stroke: new Stroke({
        color: '#ff0',
        width: 1
      })
    })
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: '#f00',
      width: 3
    })
  }),
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: '#0f0',
      width: 3
    })
  })
};

var vector = new VectorLayer({
  source: new VectorSource({
    url: 'AGSN_IBGE.gpx',
    format: new GPX()
  }),
  style: function(feature) {
    return style[feature.getGeometry().getType()];
  }
});

var map = new Map({
  layers: [raster, vector],
  target: document.getElementById('map'),
  view: new View({
//    center: [-7916041.528716288, 5228379.045749711],
//center: [-46.5957, -23.6832],
//    center: [-46.6334, -23.5507],
     projection: 'EPSG:4326',
     center: [-46.5957, -23.6832],
     zoom: 10,
     maxResolution: 0.703125
  })
});

var displayFeatureInfo = function(pixel) {
  var features = [];
  map.forEachFeatureAtPixel(pixel, function(feature) {
    features.push(feature);
  });
  if (features.length > 0) {
    var info = [];
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      info.push(features[i].get('desc'));
    }
    document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
    map.getTarget().style.cursor = 'pointer';
  } else {
    document.getElementById('info').innerHTML = '&nbsp;';
    map.getTarget().style.cursor = '';
  }
};

map.on('pointermove', function(evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on('click', function(evt) {
  displayFeatureInfo(evt.pixel);
});
