// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

//global var for which lx universe to use for keypad
let universe = 1;
//global var for channel check mode
let currentChannel = 0;

/**
 * generic function to send an sACN call.
 * @param universe - int - universe number
 * @param channels - object - channels to update in form {channel:dmxValue}
 * @param fadeTime - int - fade time for call
 */
function sendACN(universe, channels,fadeTime){
    if (locked) {
        modalShow("lockedWarning");
        return false;
    }
    window.api.send("sendACN", {"universe":universe, "channelsValues": channels,"fadeTime":fadeTime})
}
/**
 * generic function to send an OSC call
 * @param command - string - osc command to send
 * @param args - array - osc arguments
 */
function sendOSC(command, args = []) {
    if (locked) {
        modalShow("lockedWarning");
        return false;
    }
    window.api.send("sendOSC", {"command": command, "commandArgs": args})
}

/**
 * generic function to change tab view
 * @param tab - int - tab to select
 */
function changeTab(tab) {
    $(".tab[data-tab]").hide();
    $(".tab[data-tab='" + tab + "']").show();
    $("#menu td.selected").removeClass( "selected" );
    $("#menu td[data-tab='" + tab + "']").addClass( "selected" );
}
/*

 */
function modalShow(id) {
    $("#"+id).css("display", "block");
    var timeout = $("#"+id).data("timeout");
    clearTimeout(modalTimeouts[id]);
    if (timeout === 0) { //0 is infinite
        timeout = false;
    } else if (!isNaN(timeout)) {
        timeout = timeout*1000;
    } else {
        timeout = 5000;
    }
    if (timeout) {
        modalTimeouts[id] = setTimeout(function() {
            //Close the modal after 5 seconds
            $("#"+id).hide();
        }, timeout);
    }
}
/**
 * generic function triggered by frontend JS on the admin tab
 */
function adminFunctions(type) {
    switch (type) {
        case 'lock':
            window.api.asyncSend("toggleLock", {}).then((result) => {
            });
            break;
        case 'reboot':
            window.api.send("reboot", {});
            break;
        case 'exit':
            window.api.send("exit", {});
            break;
        case 'devTools':
            window.api.send("devTools", {});
            break;
    }
}
/**
 * button click function for LX
 */
function lxPreset (id) {
    window.api.asyncSend("simpleQueryDB", {"tableName": "lxPreset","keyName": "id", "value":id}).then((result) => {
        if (result.length == 1) {
            result = result[0];
            if (result.enabled) {
                sendACN(result.universe, JSON.parse(result["setArguments"]),result.fadeTime);
            }
        }
    });
}

/**
 * button click function for snd
 */
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
/**
 * Status updater for OSC
 */
window.api.receive("OSCStatus", (status) => {
    if (status) {
        $("#SNDStatusIcon").css("color","#6bf76b");
    } else {
        $("#SNDStatusIcon").css("color","#f74e4e");
    }
});

/**
 * OSC general parser
 */
window.api.receive("fromOSC", (data) => {
    //The big old function that parses all data that ever makes it through from the desk
    let addressArray = data.address.split("/")
    //check split address to make sure it's a fader update
    if (data.address == "/info") {
        $("#SNDStatusDetails").html("Sound connected to " + data.args[2] + " " + data.args[3] + " (" + data.args[1] + " - " + data.args[0] + ")");
        $("#SNDStatusIcon").html(data.args[2] + " &#x25cf;");
    } else if (data.address == "/status") {
        //i'm still alive!
    } else if (addressArray[1] === "ch" && addressArray[3] === "mix" && addressArray[4] === "fader") {
        $(".fader").each(function(key, fader) {
            if( String(this.getAttribute("data-channel")).padStart(2, '0') === addressArray[2]) {
                fader.value = data.args[0];
            }
        });
    } else if (addressArray[1] === "ch" && addressArray[3] === "mix" && addressArray[4] === "on") {
        $(".channel-toggle").each(function (key, button) {
            if(String(this.getAttribute("data-channel")).padStart(2, '0') === addressArray[2]) {
                toggleMute(this, data.args[0]);
            }
        });
    } else if (data.address === "/lr/mix/fader") {
        $(".fader[data-channel='master']").val(data.args[0]);
    } else if (data.address === "/lr/mix/on") {
        let master = $(".channel-toggle[data-channel='master']")
        if (data.args[0] === 1){
            master.addClass("unmute");
            master.removeClass("mute");
        } else {
            master.addClass("mute");
            master.removeClass("unmute");
        }
    } else if (data.address == "/meters/1") {
        //Fader metering value
        let meterData = data.parsed;
        $(".fader").each(function(key, fader) {
            if(meterData[this.getAttribute("data-channel")] !== undefined) {
                let value = Math.round(meterData[this.getAttribute("data-channel")]*100);
                if (!isNaN(value)) $(this).attr("data-meter",value);
            }
        });
        let masterMeter = (meterData['mainPostL']+meterData['mainPostR'])/2; //Take an average as its stereo
        masterMeter = Math.round(masterMeter*100)
        if (!isNaN(masterMeter)) $(".fader[data-channel='master']").attr("data-meter",masterMeter);
    }
});

var timeout = { //Black the screen after a timeout
    lastMove: (new Date()).getTime(),
    timeoutTime: 300000, //5 minutes = Default
    timedOut: false
};
var tab;
var modalTimeouts = {};
var locked = false;
$(document).ready(function() {
    $(document).on("mousemove", function () {
        if (timeout['timedOut'] || $("#page").is(":hidden")) {
            timeout['timedOut'] = false;
            $("#page").show();
        }
        timeout["lastMove"] = (new Date()).getTime();
    });


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
            $("#sndFaders").append('<div class="channel">\n' +
                '            <label>' + value.name + '</label><br/>\n' +
                '            <div class="faderWrapper"><input class="fader" type="range" max="1" step="0.01" data-meter="0" data-channel="' + value.channel + '" ' + (value.enabled ? '':'disabled') + ' value="0"></div>\n' +
                '            <button class="channel-toggle" data-channel="' + value.channel + '" data-status="1"  ' + (value.enabled ? '':'disabled') + ' >Mute</button>\n' +
                '          </div>');
        });
        $("#sndFaders").append('<div class="channel">\n' +
            '            <label>Master</label><br/>\n' +
            '            <div class="faderWrapper"><input class="fader" type="range" max="1" step="0.01" data-meter="0" data-channel="master" disabled value="0"></div>\n' +
            '            <button class="channel-toggle" data-channel="master" data-status="1" disabled>Mute</button>\n' +
            '          </div>');
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
        //check if elements are enabled
        if (result['MAINConfig']['LXEnabled'] == "Hide"){
            $('#lxTab').hide();
        }
        if (result['MAINConfig']['SNDEnabled'] == "Hide"){
            $('#sndTab').hide();
            $('#SNDStatusIcon').hide();
        }
        if (result['MAINConfig']['AdminEnabled'] == "Hide"){
            $('#adminTab').hide();
        }
        //get universe
        universe = result['LXConfig']['e131FirstUniverse'];
        //get div section
        $('#LXInfo').html(result['MAINConfig']['LXInfo']);
        $('#SNDInfo').html(result['MAINConfig']['SNDInfo']);
        //check for lock
        locked = (result['MAINConfig']['deviceLock'] === "LOCKED");
        if (locked) {
            $("#lockIcon").show();
            $("#deviceLockButton").html('Unlock');
        } else {
            $("#lockIcon").hide();
            $("#deviceLockButton").html('Lock');
        }
        timeout['timeoutTime'] = result['MAINConfig']['timeoutTime']*60*1000;
    });
    $("#allOff").click(function() {
        window.api.send("fadeAll");
        sndFadeAll();
        modalShow("allOffModal");
    });
    //Channel Fader handling
    //handle fader movement
    $(document).on('input', '.fader', function() {
        sendOSC("/ch/" + String(this.getAttribute("data-channel")).padStart(2, '0') + "/mix/fader", {type:"f", value:this.value});
    });
    //handle button toggle
    $(document).on("click", ".channel-toggle", function () {
        let  status = this.getAttribute("data-status")
        sendOSC("/ch/" + String(this.getAttribute("data-channel")).padStart(2, '0') + "/mix/on", {type: "i", value:status});
        toggleMute(this, status)
    });
    changeTab(1);
    $(document).on("click", "#menu td[data-tab]", function () {
        changeTab($(this).data("tab"));
    });
    //keypad handling
    $('#keypad-open').click(function () {
        if (locked) {
            modalShow("lockedWarning");
            return false;
        }
       changeTab(2);
    });
    $('#check-open').click(function (){
        if (locked) {
            modalShow("lockedWarning");
            return false;
        }
       changeTab(3);
    });
    window.api.asyncSend("getIP", {}).then((result) => {
        let url = "http://" + result + ":8080"
        new QRCode(document.getElementById("adminQRCode"), {
            text: url,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#d6dfde"
        });
        $("#adminURL").html(url);
    });
    //Modals
    $(document).on("click", "span.close", function () {
        $(this).parents(".modal").hide();
    });

    //Keypad
    let keyOutput = $('#keypad-output');
    let keyFader  = $('#intensityFader');
    $('.keypad-key').click(function () {
        keyOutput.val(keyOutput.val() + String(this.getAttribute('data-key')));
        verifyLX(keyOutput, keyFader);
    });

    $(document).on('input', keyFader, function() {
        let sections = keyOutput.val().split(" ");
        if (sections.length === 1){
            let channels = {}
            channels[sections[0]] = keyFader.val();
            sendACN(universe, channels, 0);
        } else if(sections.length === 3){
            sendACN(universe, createThruObject(sections, keyFader.val()), 0);
        }
    });

    $('.keypad-clear').click(function () {
        keyFader.val(0);
        let sections = keyOutput.val().split(" ");
        if (sections[1] === "thru" && sections[2] === "") {
            keyOutput.val(sections[0]);
        } else if (sections[1] === "thru"){
            keyOutput.val(sections[0] + " thru ");
        } else {
            keyOutput.val("");
        }
        verifyLX(keyOutput, keyFader);
    });

    $('#check-prev').click(function() {
        currentChannel--;
        if (currentChannel < 1) {
            currentChannel = 512;
        }
        updateChanCheck()
    });
    $('#check-next').click(function() {
        currentChannel++;
        if (currentChannel > 512) {
            currentChannel = 1;
        }
        updateChanCheck()
    });
    $('#check-all').click(function() {
        setAllLX(180);
        $('#check-text').text("All");
        currentChannel=0;
    });
    $('#check-off').click(function() {
        setAllLX(0);
        $('#check-text').text("Off");
        currentChannel=0;
    });
});
setInterval(function() {
    if (!timeout['timedOut'] && (timeout['lastMove']+timeout['timeoutTime']) <= (new Date()).getTime()) {
        $("#page").fadeOut(5000);
        timeout['timedOut'] = true;
    }
}, 1000);

async function sndFadeAll(){
    let faders = $(".fader");
    let changedZero = true;
    if (false) {
        while(changedZero){
            changedZero = false;
            faders.each( function (){
                if (this.value > 0){
                    changedZero = true;
                    this.value -= 0.01;
                    sendOSC("/ch/" + String(this.getAttribute("data-channel")).padStart(2, '0') + "/mix/fader", {type:"f", value:this.value});
                }
            });
            await new Promise(r => setTimeout(r, 30));
        }
    } else {
        faders.each( function (){
            sendOSC("/ch/" + String(this.getAttribute("data-channel")).padStart(2, '0') + "/mix/fader", {type:"f", value:0});
        });
    }
}

function toggleMute(element, status){
    if (status == 1) {
        element.setAttribute("data-status", 0);
        element.classList.add("unmute");
        element.classList.remove("mute");
    } else {
        element.setAttribute("data-status", 1);
        element.classList.add("mute");
        element.classList.remove("unmute");
    }
}

/**
 * Checks if text in given element is valid
 * @param element - element to get command from
 * @returns {boolean} - true if command is valid, false otherwise
 */
function verifyLX(element, fader){
    element.removeClass("error");
    let command = element.val();
    let sections = command.split(" ");
    //correct sections: ["chan1", " thru ", "chan2"] or ["chan1"]
    if ((sections.length > 3) || (sections.length === 2) || (sections[0] === "") || (sections[2] === "") || (parseInt(sections[0]) > 512) || (parseInt(sections[2]) > 512 ) || (parseInt(sections[2]) < parseInt(sections[0]))){
        //invalid command
        element.addClass("error");
        fader.prop("disabled", true);
        return false;
    } else {
        //is valid
        if(! locked){
            fader.prop("disabled", false);
        }
    }
    return true;
}

function createThruObject(channelArray, level){
    let channels = {};
    for (let i=parseInt(channelArray[0]); i <= parseInt(channelArray[2]); i++){
        channels[i.toString()] = level;
    }
    return channels
}

function setAllLX(value){
    channels={"1":value,"2":value,"3":value,"4":value,"5":value,"6":value,"7":value,"8":value,"9":value,"10":value,"11":value,"12":value,"13":value,"14":value,"15":value,"16":value,"17":value,"18":value,"19":value,"20":value,"21":value,"22":value,"23":value,"24":value,"25":value,"26":value,"27":value,"28":value,"29":value,"30":value,"31":value,"32":value,"33":value,"34":value,"35":value,"36":value,"37":value,"38":value,"39":value,"40":value,"41":value,"42":value,"43":value,"44":value,"45":value,"46":value,"47":value,"48":value,"49":value,"50":value,"51":value,"52":value,"53":value,"54":value,"55":value,"56":value,"57":value,"58":value,"59":value,"60":value,"61":value,"62":value,"63":value,"64":value,"65":value,"66":value,"67":value,"68":value,"69":value,"70":value,"71":value,"72":value,"73":value,"74":value,"75":value,"76":value,"77":value,"78":value,"79":value,"80":value,"81":value,"82":value,"83":value,"84":value,"85":value,"86":value,"87":value,"88":value,"89":value,"90":value,"91":value,"92":value,"93":value,"94":value,"95":value,"96":value,"97":value,"98":value,"99":value,"100":value,"101":value,"102":value,"103":value,"104":value,"105":value,"106":value,"107":value,"108":value,"109":value,"110":value,"111":value,"112":value,"113":value,"114":value,"115":value,"116":value,"117":value,"118":value,"119":value,"120":value,"121":value,"122":value,"123":value,"124":value,"125":value,"126":value,"127":value,"128":value,"129":value,"130":value,"131":value,"132":value,"133":value,"134":value,"135":value,"136":value,"137":value,"138":value,"139":value,"140":value,"141":value,"142":value,"143":value,"144":value,"145":value,"146":value,"147":value,"148":value,"149":value,"150":value,"151":value,"152":value,"153":value,"154":value,"155":value,"156":value,"157":value,"158":value,"159":value,"160":value,"161":value,"162":value,"163":value,"164":value,"165":value,"166":value,"167":value,"168":value,"169":value,"170":value,"171":value,"172":value,"173":value,"174":value,"175":value,"176":value,"177":value,"178":value,"179":value,"180":value,"181":value,"182":value,"183":value,"184":value,"185":value,"186":value,"187":value,"188":value,"189":value,"190":value,"191":value,"192":value,"193":value,"194":value,"195":value,"196":value,"197":value,"198":value,"199":value,"200":value,"201":value,"202":value,"203":value,"204":value,"205":value,"206":value,"207":value,"208":value,"209":value,"210":value,"211":value,"212":value,"213":value,"214":value,"215":value,"216":value,"217":value,"218":value,"219":value,"220":value,"221":value,"222":value,"223":value,"224":value,"225":value,"226":value,"227":value,"228":value,"229":value,"230":value,"231":value,"232":value,"233":value,"234":value,"235":value,"236":value,"237":value,"238":value,"239":value,"240":value,"241":value,"242":value,"243":value,"244":value,"245":value,"246":value,"247":value,"248":value,"249":value,"250":value,"251":value,"252":value,"253":value,"254":value,"255":value,"256":value,"257":value,"258":value,"259":value,"260":value,"261":value,"262":value,"263":value,"264":value,"265":value,"266":value,"267":value,"268":value,"269":value,"270":value,"271":value,"272":value,"273":value,"274":value,"275":value,"276":value,"277":value,"278":value,"279":value,"280":value,"281":value,"282":value,"283":value,"284":value,"285":value,"286":value,"287":value,"288":value,"289":value,"290":value,"291":value,"292":value,"293":value,"294":value,"295":value,"296":value,"297":value,"298":value,"299":value,"300":value,"301":value,"302":value,"303":value,"304":value,"305":value,"306":value,"307":value,"308":value,"309":value,"310":value,"311":value,"312":value,"313":value,"314":value,"315":value,"316":value,"317":value,"318":value,"319":value,"320":value,"321":value,"322":value,"323":value,"324":value,"325":value,"326":value,"327":value,"328":value,"329":value,"330":value,"331":value,"332":value,"333":value,"334":value,"335":value,"336":value,"337":value,"338":value,"339":value,"340":value,"341":value,"342":value,"343":value,"344":value,"345":value,"346":value,"347":value,"348":value,"349":value,"350":value,"351":value,"352":value,"353":value,"354":value,"355":value,"356":value,"357":value,"358":value,"359":value,"360":value,"361":value,"362":value,"363":value,"364":value,"365":value,"366":value,"367":value,"368":value,"369":value,"370":value,"371":value,"372":value,"373":value,"374":value,"375":value,"376":value,"377":value,"378":value,"379":value,"380":value,"381":value,"382":value,"383":value,"384":value,"385":value,"386":value,"387":value,"388":value,"389":value,"390":value,"391":value,"392":value,"393":value,"394":value,"395":value,"396":value,"397":value,"398":value,"399":value,"400":value,"401":value,"402":value,"403":value,"404":value,"405":value,"406":value,"407":value,"408":value,"409":value,"410":value,"411":value,"412":value,"413":value,"414":value,"415":value,"416":value,"417":value,"418":value,"419":value,"420":value,"421":value,"422":value,"423":value,"424":value,"425":value,"426":value,"427":value,"428":value,"429":value,"430":value,"431":value,"432":value,"433":value,"434":value,"435":value,"436":value,"437":value,"438":value,"439":value,"440":value,"441":value,"442":value,"443":value,"444":value,"445":value,"446":value,"447":value,"448":value,"449":value,"450":value,"451":value,"452":value,"453":value,"454":value,"455":value,"456":value,"457":value,"458":value,"459":value,"460":value,"461":value,"462":value,"463":value,"464":value,"465":value,"466":value,"467":value,"468":value,"469":value,"470":value,"471":value,"472":value,"473":value,"474":value,"475":value,"476":value,"477":value,"478":value,"479":value,"480":value,"481":value,"482":value,"483":value,"484":value,"485":value,"486":value,"487":value,"488":value,"489":value,"490":value,"491":value,"492":value,"493":value,"494":value,"495":value,"496":value,"497":value,"498":value,"499":value,"500":value,"501":value,"502":value,"503":value,"504":value,"505":value,"506":value,"507":value,"508":value,"509":value,"510":value,"511":value,"512":value}
    sendACN(universe, channels, 0);
}

function updateChanCheck(){
    setAllLX(0);
    $('#check-text').text(currentChannel);
    let channel = {};
    channel[currentChannel] = 180;
    sendACN(universe, channel, 0);
}