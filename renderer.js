// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var presetFile = {
    name: "untitled",
    deviceName: "untitled device",
    presetConfig: {
        1:{
            enabled: true,
            label: "1",
            universe: 1,
            values: {45:255,2:255}
        },
        2:{
            enabled: true,
            label: "2",
            universe: 1,
            values: {10:255, 12:255, 14:255}
        },
        3:{
            enabled: true,
            label: "3",
            universe: 1,
            values: {100:255, 120:255, 121:255}
        },
        4:{
            enabled: true,
            label: "4",
            universe: 1,
            values: {200:255, 201:255, 202:255}
        },
}
}

let presetStatus = [null, false, false, false, false]; //used to store on or off values of each preset

/**
 * generic function to send an sACN call.
 * @param universe - int - universe number
 * @param channels - object - channels to update in form {channel:dmxValue}
 */
function sendACN(universe, channels){
    window.api.send("sendACN", {"universe":universe, "channelsValues": channels})
}

window.api.receive("fromMain", (data) => {
    console.log(`Received ${data} from main process`);
});

/**
 * Sets all preset channel values to 0
 * values should be a copy of a value object
 * @param values - object
 * @returns {*}
 */
function zeroChannelValues(values){
    Object.keys(values).forEach(function (key){values[key] = 0})
    return values;
}

/**
 * button click function
 * gets preset number from preset data attribute
 */
function presetEvent () {
    var preset = this.getAttribute("data-preset");
    var universe = presetFile.presetConfig[preset].universe;
    var values = JSON.parse(JSON.stringify(presetFile.presetConfig[preset].values));//dirty copy
    if (presetStatus[preset] === true){
        values = zeroChannelValues(values);
    }
    sendACN(universe, values);
    presetStatus[preset] = !presetStatus[preset];
}

//Add above function to all preset buttons
let elements = document.getElementsByClassName("preset");
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', presetEvent);
}

