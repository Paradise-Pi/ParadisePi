// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

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

/**
 * button click function for LX
 */
function lxPreset (id) {
    window.api.asyncSend("simpleQueryDB", {"tableName": "lxPreset","keyName": "id", "value":id}).then((result) => {
        if (result.length == 1) {
            result = result[0];
            sendACN(result.universe, JSON.parse(result["setArguments"]));
        }
    });
}

function soundPreset (id) {
    window.api.asyncSend("simpleQueryDB", {"tableName": "sndPreset","keyName": "id", "value":id}).then((result) => {
        if (result.length == 1) {
            result = result[0];
            if (result.enabled) {
                var data = JSON.parse(result['data']);
                for (const [key, value] of Object.entries(data)) {
                    sendOSC(key, [value]);
                }
            }
        }
    });
}
window.api.receive("fromOSC", (data) => {
    console.log(data);
});


$(document).ready(function() {
    //create buttons dynamically
    window.api.asyncSend("countQueryDB", {"tableName":"lxPreset"}).then((result) => {
        for (i = 1; i <= result; i++){
            window.api.asyncSend("simpleQueryDB", {"tableName": "lxPreset","keyName": "id", "value":i}).then((result) => {
                $("#lxContainer").append('<button type="button" class="lx" data-preset="'+ (i-1) +'">' + result[0].name +'</button>');
            })

        }
    });
    window.api.asyncSend("countQueryDB", {"tableName":"sndPreset"}).then((result) => {
        for (i = 1; i <= result; i++){
            window.api.asyncSend("simpleQueryDB", {"tableName": "sndPreset","keyName": "id", "value":i}).then((result) => {
                $("#sndContainer").append('<button type="button" class="snd" data-preset="' + (i-1) + '">' + result[0].name +'</button>');
            })
        }
    });


    //setup all bindings/handlers
    $(document).on("click",".snd",function() {
        soundPreset($(this).data("preset"));
    });
    $(document).on("click",".lx",function() {
        lxPreset($(this).data("preset"));
    });
    $(document).on("click",".reboot",function() {
        window.api.send("reboot", {});
    });
});