export {distanceInKm, kmToLat, kmToLong};

/*
Latitude: 1 deg = 110.574 km
Longitude: 1 deg = 111.320*cos(latitude) km
*/
function distanceInKm(a, b) {
    if (typeof a === 'undefined' || typeof b === 'undefined') {
        return null;
    } 
    const kmLat = kmToLat(a[1] - b[1]);
    const kmLng = kmToLong(a[0] - b[0], a[1]);

    const km = Math.sqrt(kmLat * kmLat + kmLng * kmLng);
    return km;
}

function kmToLat(a) {
    return 110.574*Math.abs(a);
}

function kmToLong(a, lat) {
    const latRadians = lat*Math.PI / 180;
    return 111.32 * Math.abs(a) * Math.cos(latRadians);
}
