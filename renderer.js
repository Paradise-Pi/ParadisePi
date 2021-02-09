// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

//device info
//todo convert to sqlite database
var presetFile = {
    name: "untitled",
    deviceName: "untitled device",
    presetConfig: {
        1:{
            enabled: true,
            label: "1",
            universe: 1,
            setValues: {45:255,2:255},
            unSetValues: {45:0,2:0},
        },
        2:{
            enabled: true,
            label: "2",
            universe: 1,
            setValues: {10:255, 12:255, 14:255},
            unSetValues: {10:0, 12:0, 14:0},
        },
        3:{
            enabled: true,
            label: "3",
            universe: 1,
            setValues: {100:255, 120:255, 121:255},
            unSetValues: {100:0, 120:0, 121:0},
        },
        4:{
            enabled: true,
            label: "4",
            universe: 1,
            setValues: {200:255, 201:255, 202:255},
            unSetValues: {200:0, 201:0, 202:0},
        },
}
}

let presetStatus = [null, false, false, false, false]; //used to store on or off values of each preset

//db handling
/**
 * This function updates the relevant element with the information from the database
 * it relies on each type of button having the specified class.
 */
window.api.receive("dbRequestReply", (data) => {
    console.log(data);
    let element = document.getElementById(data.element);
    element.innerText = data.data.name;
    element.setAttribute('data-status', "false");
    element.disabled = !data.data.enabled;
    if (element.className === "lx"){
        //for LX presets
        element.setAttribute('data-universe', data.data.universe);
        element.setAttribute('data-set', data.data.setValues);
        element.setAttribute('data-unset', data.data.unSetValues);
    } else if (element.className === "snd"){
        //for sound presets
        element.setAttribute('data-address', data.data.address);
        element.setAttribute('data-set', data.data.setArguments);
        element.setAttribute('data-unset', data.data.unSetArguments);
    }
})

/**
 * request information from the database
 * will return an entire entry from the given table using the given entry id
 * @param elementID - calling element so that changes can be made
 * @param table - table to query
 * @param id - entry id
 */
function updateElement(elementID, table, id){
    window.api.send("queryDB", {element:elementID, tableName: table, value:id})
}

/**
 * generic function to send an sACN call.
 * @param universe - int - universe number
 * @param channels - object - channels to update in form {channel:dmxValue}
 */
function sendACN(universe, channels){
    window.api.send("sendACN", {"universe":universe, "channelsValues": channels})
}

/**
 * generic function to send an OSC call
 * @param command - string - osc command to send
 * @param args - array - osc arguments
 */
function sendOSC(command, args = []) {
    window.api.send("sendOSC", {"command": command, "commandArgs": args})
}

window.api.receive("fromOSC", (data) => {
    console.log(data);
});

/**
 * button click function
 * gets preset number from preset data attribute
 */
function presetEvent () {
    var universe = this.getAttribute("data-universe");
    var values = JSON.parse(this.getAttribute("data-set"));
    if (this.getAttribute("data-status") === "true"){
        values = JSON.parse(this.getAttribute("data-unset"));
        this.setAttribute("data-status", "false");
    } else {
        this.setAttribute("data-status", "true");
    }
    sendACN(universe, values);
}

//Add above function to all preset buttons
let elements = document.getElementsByClassName("lx");
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', presetEvent);
}


// this function maaay not be useful cause of network demand
function OSCfade(command, start, end){
    if (start == end){
        sendOSC(command, [{type:"f", value:start}])
    } else if (start < end) {
        for (let i = start; i < end; i += 0.01){
            sendOSC(command, [{type:"f", value:i}]);
        }
    } else {
        for (let i = start; i > end; i -= 0.01){
            sendOSC(command, [{type:"f", value:i}]);
        }
    }
}

function soundEvent () {
    /*if (soundStatus[1] === false){
        sendOSC("/ch/01/mix/fader", [{type:"f", value:0.75}]);
    } else {
        sendOSC("/ch/01/mix/fader", [{type:"f", value:0.0}]);
    }
    soundStatus[1] = !soundStatus[1];*/
    updateElement(this.id, "lxPreset", 1)
}

document.getElementById("snd1").addEventListener('click', soundEvent)