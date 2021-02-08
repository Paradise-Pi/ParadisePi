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
let soundStatus = [null, false];

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
 * @param response - boolean - does the caller want the response from the remote device
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
    var preset = this.getAttribute("data-preset");
    var universe = presetFile.presetConfig[preset].universe;
    var values = presetFile.presetConfig[preset].setValues;
    if (presetStatus[preset] === true){
        values = presetFile.presetConfig[preset].unSetValues;
    }
    sendACN(universe, values);
    presetStatus[preset] = !presetStatus[preset];
}

//Add above function to all preset buttons
let elements = document.getElementsByClassName("preset");
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
    if (soundStatus[1] === false){
        sendOSC("/ch/01/mix/fader", [{type:"f", value:0.75}]);
    } else {
        sendOSC("/ch/01/mix/fader", [{type:"f", value:0.0}]);
    }
    soundStatus[1] = !soundStatus[1];
}

document.getElementById("sound1").addEventListener('click', soundEvent)