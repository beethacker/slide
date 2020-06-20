export default DEBUG;

let PRODUCTION = false;

//Some debugging options
let DEBUG_FLAGS = {
    CLEAR_STATE: false,
    SET_GPS: false,
    CELL_OVERAL: false,
    DISABLE_MOVE_CHECK: false,
    LOCAL_SERVER: false
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