//===================================DR Congo===============================//

var point = ee.Geometry.Point(23.291015625,-1.9332268264771106);


// LANDSAT imagery sort and filter
var l8 = ee.ImageCollection('LANDSAT/LC8_L1T')
        .filterBounds(point)
        .filterDate('2016-01-01', '2016-12-31')
        .sort('CLOUD_COVER', true)
        .sort('CLOUD_COVER_LAND', true);//use boolean as second args. Default is true


//number of images
var count = l8.size();
print('Number of images-',count);

// first least cloudy image.
var scene = ee.Image(l8.first());
print('scene:', scene);

//extracting metadata
var when = scene.get('DATE_ACQUIRED');
var row = scene.get('WRS_ROW');
var path = scene.get('WRS_PATH');

print('Date of image acquisition',when);
print('Image WRS Row', row);
print('Image WRS Path', path);


//============NDVI: Normalized Difference Vegetation Index============//

//NDVI Formular: (b5-b4)/(b5+b4)

//select needed bands for NDVI calculations
var nir = scene.select('B5');
var red = scene.select('B4');

var ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI');
var ndviParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};

//============NDWI: Normalized Difference Water Index============//

//NDWI Formular: (b3-b5)/(b3+b5) i.e (Green - Near Infrared)/(Green + Near Infrared)

//select last band needed for NDWI calculations
var green = scene.select('B3');

var ndwi = nir.subtract(green).divide(nir.add(green)).rename('NDWI');
var ndwiParams = {min: -1, max: 1, palette: ['blue', 'white', 'red']};


//=============DISPLAY==============//

Map.centerObject(scene, 8);
Map.addLayer(point, {}, 'Point reference for image collection selection');

//Composite: This composite makes vegetation and ally easy to extract
Map.addLayer(scene, {bands: ['B6', 'B5', 'B4']}, 'Landsat 8 scene composite');

//Blue is low, while Green is high NDVI
Map.addLayer(ndvi, ndviParams, 'NDVI image');

//Blue is low, while Red is high NDVI
Map.addLayer(ndwi, ndwiParams, 'NDWI image');


print("Done");