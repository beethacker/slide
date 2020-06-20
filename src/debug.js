export default DEBUG;

let PRODUCTION = false;

//Some debugging options
let DEBUG_FLAGS = {
    SET_GPS: true,
    CELL_OVERAL: false,
    DISABLE_MOVE_CHECK: false,
    LOCAL_SERVER: true
};


//If I set production, force all debug options off
if (PRODUCTION) {
    for(let key of Object.keys(DEBUG_FLAGS)) {
        DEBUG_FLAGS[key] = false;
    }
}

function DEBUG(flag) {
    return DEBUG_FLAGS[flag];
}