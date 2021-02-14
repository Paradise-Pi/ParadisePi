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
    window.api.asyncSend("simpleQueryDB", {"tableName": "lxPreset"}).then((result) => {
        $.each(result, function (key,value) {
            $("#lxContainer").append('<button type="button" class="lx" data-preset="'+ (value.id) +'">' + value.name +'</button>');
        });
    });
    window.api.asyncSend("simpleQueryDB", {"tableName": "sndPreset"}).then((result) => {
        $.each(result, function (key,value) {
            $("#sndContainer").append('<button type="button" class="snd" data-preset="' + (value.id) + '">' + value.name +'</button>');
        });
    });

    //create Faders dynamically
    window.api.asyncSend("simpleQueryDB", {"tableName": "sndFaders"}).then((result) => {
        $.each(result, function (key,value) {
            console.log(value);
            $("#sndFaders").append('<div class="channel">\n' +
                '            <label>' + value.name + '</label>\n' +
                '            <input class="fader" type="range" max="1" step="0.01" data-channel="' + (value.channel < 10 ? '0'+value.channel : value.channel ) + '" value="0">\n' +
                '            <button class="channel-toggle" data-channel="' + (value.channel < 10 ? '0'+value.channel : value.channel ) + '" data-status="1">OFF</button>\n' +
                '          </div>');
        });
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
    window.api.asyncSend("getConfig", {}).then((result) => {
        $("#deviceName").html(result['MAINConfig']['deviceName']);
    });

    //Channel Fader handlimg
    //handle fader movement
    $(document).on('input', '.fader', function() {
        sendOSC("/ch/" + this.getAttribute("data-channel") + "/mix/fader", {type:"f", value:this.value});
    });
    //handle button toggle
    $(document).on("click", ".channel-toggle", function () {
        let  status = this.getAttribute("data-status")
        sendOSC("/ch/" + this.getAttribute("data-channel")+ "/mix/on", {type: "i", value:status});
        if (status == 1) {
            this.setAttribute("data-status", 0);
            this.innerText = "ON";
        } else {
            this.setAttribute("data-status", 1);
            this.innerText = "OFF";
        }
    });

});