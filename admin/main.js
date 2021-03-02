//JQuery function to add an element and return the created object
jQuery.fn.addChild = function(html)
{
    var target  = $(this[0])
    var child = $(html);
    child.appendTo(target);
    return child;
};

const sndFirstOption = {
    //"name":["address", startVal, endVal, Step]
    "Channel":["/ch/",1,16,1],
    "Mute Group":["/config/mute/", 1,6,1]
}

const sndSecondOption = {
    //"name":["address", startVal, EndVal, Step]
    "Mute": ["/mix/on", 0,1,1],
    "Level":["/mix/fader", 0.0, 1.0, 0.01],
    "Pan":["/mix/pan", 0.0, 1.0, 0.01],
    "Gain":["/headamp/gain", 0.0, 1.0, 0.01],
    "+48V":["/headamp/phantom", 0,1,1]
}

//generates the lighting card for a given value object
function lxPresetCard(presetArea, value, firstUniverse, lastUniverse){
    let card = presetArea.addChild("<div class='card'>");
    //Card Title
    card.addChild('<div class="card-header">' + (value.id == null ? '<strong>New Preset</strong>' : '<strong>Preset</strong> ' + value.id) + '</div>\n');
    //card Body + form
    var form = card.addChild("<div class='card-body'>").addChild('<form class="preset-form" data-table="LXPreset">');
    //Name
    form.addChild('<div class="form-group"><label>Preset Name</label>\n<input class="form-control" name="name" type="text" value="' + value.name + '">\n</div>');
    //Enabled
    form.addChild('<div class="form-group"><label>Preset Enabled</label>\n<input class="form-control" name="enabled" type="checkbox" ' + (value.enabled ? 'checked' : '') + '>\n</div>\n');
    //Universe
    form.addChild('<div class="form-group"><label>Preset Universe</label>\n<input class="form-control" name="universe" type="number" min="'+ firstUniverse +'" max="'+ lastUniverse +'" value="' + value.universe + '">\n</div>\n');
    //Channels todo: convert to table
    form.addChild('<div class="form-group"><label>Preset Channels</label>\n<textarea class="form-control" name="setArguments" type="text" rows="10" cols="30">' + value.setArguments + '</textarea>\n</div>\n');
    //Preset id
    if(value.id != null){ form.addChild('<input type="hidden" name="id" value="'+ value.id + '">\n')}
    //Buttons
    form.addChild('<div style="display: inline">\n<button class="btn btn-sm btn-success" type="submit">Save</button>\n'+(value.id != null ? '<button class="btn btn-sm btn-danger" data-id="'+ value.id + '" type="button" onclick="removePreset(this)">Remove</button>\n' : '')+'</div>\n');
}
//generates the sound card for a given value object
function sndPresetCard(presetArea, value){
    let card = presetArea.addChild("<div class='card'>");
    //Card Title
    card.addChild('<div class="card-header">' + (value.id == null ? '<strong>New Preset</strong>' : '<strong>Preset</strong> ' + value.id) + '</div>\n');
    //card Body + form
    var form = card.addChild("<div class='card-body'>").addChild('<form class="preset-form" data-table="SNDPreset">');
    //Name
    form.addChild('<div class="form-group"><label>Preset Name</label>\n<input class="form-control" name="name" type="text" value="' + value.name + '">\n</div>');
    //Enabled
    form.addChild('<div class="form-group"><label>Preset Enabled</label>\n<input class="form-control" name="enabled" type="checkbox" ' + (value.enabled ? 'checked' : '') + '>\n</div>\n');
    //Data todo: convert to input Boxes
    form.addChild('<div class="form-group"><label>Preset Channels</label>\n<textarea class="form-control" name="setArguments" type="text" rows="10" cols="30">' + value.data + '</textarea>\n</div>\n');
    //Preset id
    if(value.id != null){ form.addChild('<input type="hidden" name="id" value="'+ value.id + '">\n')}
    //Buttons
    form.addChild('<div style="display: inline">\n<button class="btn btn-sm btn-success" type="submit">Save</button>\n'+(value.id != null ? '<button class="btn btn-sm btn-danger" data-id="'+ value.id + '" type="button" onclick="removePreset(this)">Remove</button>\n' : '')+'</div>\n');
}

function sndFaderCard(faderArea, value){
    let card = faderArea.addChild("<div class='card'>");
    //Card Title
    card.addChild('<div class="card-header">' + (value.id == null ? '<strong>New Fader</strong>' : '<strong>Fader</strong> ' + value.id) + '</div>\n');
    //Card Body + form
    var form = card.addChild("<div class='card-body'>").addChild('<form class="preset-form" data-table="SNDFaders">');
    //Name
    form.addChild('<div class="form-group"><label>Fader Name</label>\n<input class="form-control" name="name" type="text" value="' + value.name + '">\n</div>');
    //Channel
    form.addChild('<div class="form-group"><label>Fader Channel</label>\n<input class="form-control" name="channel" type="number" min="1" value="' + value.channel + '">\n</div>');
    //Enabled
    form.addChild('<div class="form-group"><label>Controllable</label>\n<input class="form-control" name="enabled" type="checkbox" ' + (value.enabled ? 'checked' : '') + '>\n</div>\n');
    //Fader id
    if(value.id != null){ form.addChild('<input type="hidden" name="id" value="'+ value.id + '">\n')}
    //Buttons
    form.addChild('<div style="display: inline">\n<button class="btn btn-sm btn-success" type="submit">Save</button>\n'+(value.id != null ? '<button class="btn btn-sm btn-danger" data-id="'+ value.id + '" type="button" onclick="removePreset(this)">Remove</button>\n' : '')+'</div>\n');
}

//websocket
const socket = io(':8080');
//Mechanics of the connection
//updates interface when connection lost/found
socket.on('connect', () => {
    if (!socket.disconnected) {
        $("#status-textStatus").html("Connected to device");
        $("#status-menuStatus").addClass("c-sidebar-nav-link-success");
        $("#status-menuStatus").html("Connected");
        $("#status-menuStatus").removeClass("c-sidebar-nav-link-danger");
    }
});
socket.on('disconnect', (reason) => {
    if (socket.disconnected) {
        $("#status-textStatus").html("Disconnected: " + reason);
        $("#status-menuStatus").removeClass("c-sidebar-nav-link-success");
        $("#status-menuStatus").html("Disconnected");
        $("#status-menuStatus").addClass("c-sidebar-nav-link-danger");
    }
});

//Faders Section
socket.on('fader', (data) => {
    if ("SNDFader" in data) {
        let faderArea = $("#SNDFaderList");
        faderArea.html("");
        $.each(data["SNDFader"], function (key, value){
            sndFaderCard(faderArea, value);
        });
    }
});

//Presets section
socket.on('preset', (data) => {
    if ("LXPreset" in data) {
        let presetarea = $("#LXPresetList");
        presetarea.html("");
        $.each(data["LXPreset"], function (key, value){
            //add a card for each preset
            lxPresetCard(presetarea, value, firstUniverse, lastUniverse);
        });
    } else if ("SNDPreset" in data) {
        let presetarea = $("#SNDPresetList");
        presetarea.html("");
        $.each(data["SNDPreset"], function (key, value){
            //add a card for each preset
            sndPresetCard(presetarea, value);
        });
    }
});

let firstUniverse = 1;
let lastUniverse = 2;
//Settings Section
socket.on('config', (data) => {
    var type = false;
    if ("config" in data) {
        type = "config";
    } else if ("SNDConfig" in data) {
        type = "SNDConfig";
    } else if ("LXConfig" in data) {
        type = "LXConfig";
        //set first and last values
        firstUniverse = parseInt(data['LXConfig'][0]['value']);
        lastUniverse = firstUniverse + parseInt(data['LXConfig'][1]['value']) - 1;
    }
    if (type) {
        $("form.settings-form[data-table=" + type + "]").html("");
        $.each(data[type],function (key,value) {
            $("form.settings-form[data-table=" + type + "]").append('<div class="form-group"><label>' + value.name + '</label><input class="form-control" name="' + value.key + '" type="text" value="' + value.value + '" ' + (value.canEdit != 1 ? 'disabled' : '') + '><span class="help-block">' + value.description + '</span></div>');
        });
        $("form.settings-form[data-table=" + type + "]").append('<button class="btn btn-sm btn-success" type="submit">Save</button>');
    }
});

//About section
socket.on('about', (data) => {
    $("#settings-version-box").html("");
    $("#settings-version-box").append('<div class="form-group row"><label class="col-md-3 col-form-label">Paradise Version</label><div class="col-md-9"><input class="form-control" type="text" value="' + data.version + '" disabled></div></div><hr>');
    $.each(data["npmVersions"], function (key,value) {
        $("#settings-version-box").append('<div class="form-group row"><label class="col-md-3 col-form-label">' + key + '</label><div class="col-md-9"><input class="form-control" disabled value="' + value + '"></div></div>');
    });
});

//update config
$(document).on('submit','form.settings-form[data-table]',function(){
    socket.emit('updateConfig', $(this).data("table"), $( this ).serializeArray());
    return false;
});

//update preset
$(document).on('submit', 'form.preset-form[data-table]', function() {
    var data = $(this).serializeArray();
    var setEnabled = false;
    data.forEach(function (row,index,array) {
        if (row['name'] == "enabled") {
            array[index]['value'] = (row['value'] == "on");
            setEnabled = true;
        }
    });
    if (!setEnabled) {
        data.push({name:"enabled", value: false});
    }
   socket.emit('updatePreset', $(this).data("table"), data);
   return false;
});

//add new preset
$('#lxNew').click(function (){
    //an empty object for creating new presets
    const emptyValues = {id:null, name:"", universe:1, enabled:true, setArguments:"" };
    lxPresetCard($("#LXPresetList"), emptyValues, firstUniverse, lastUniverse);
});
$('#sndNew').click( function (){
    //an empty object for creating new presets
    const emptyValues = {id:null, name:"", enabled:true, data:"" };
    sndPresetCard($("#SNDPresetList"), emptyValues);
});

//add new fader
$('#fdrNew').click( function (){
    //empty object
    const emptyValues = {id:null, name:"", channel:1,enabled:true}
    sndFaderCard($("#SNDFaderList"), emptyValues);
});

//remove preset
function removePreset (button) {
    console.log(button);
    console.log(button.form);
    socket.emit('removePreset', button.form.getAttribute('data-table'), {id:button.getAttribute('data-id')});
}