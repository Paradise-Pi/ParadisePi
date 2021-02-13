//generates the lighting card for a given value object
function lxPresetCard(value){
    return  '<div class="card">\n' +
    '    <div class="card-header">' + (value.id == null ? '<strong>New Preset</strong>' : '<strong>Preset</strong> ' + value.id) + '</div>\n' +
    '    <div class="card-body">\n' +
    '        <form class="preset-form" data-table="LXPreset">\n' +
    '            <div class="form-group"><label>Preset Name</label>\n' +
    '                <input class="form-control" name="name" type="text" value="' + value.name + '">\n' +
    '            </div>\n' +
    '            <div class="form-group"><label>Preset Enabled</label>\n' +
    '                <input class="form-control" name="enabled" type="checkbox" checked="' + value.enabled + '">\n' +
    '            </div>\n' +
    '            <div class="form-group"><label>Preset Universe</label>\n' +
    '                <input class="form-control" name="universe" type="number" value="' + value.universe + '">\n' +
    '            </div>\n' +
    '            <div class="form-group"><label>Preset Channels</label>\n' +
    '                <textarea class="form-control" name="setArguments" type="text" rows="10" cols="30">' + value.setArguments + '</textarea>\n' +
    '            </div>\n' +
        (value.id != null ? '<input type="hidden" name="id" value="'+ value.id + '">\n' : '') +
    '            <div style="display: inline">\n' +
    '               <button class="btn btn-sm btn-success" type="submit">Save</button>\n' +
                    (value.id != null ? '<button class="btn btn-sm btn-danger" data-id="'+ value.id + '" type="button" onclick="removePreset(this)">Remove</button>\n' : '') +
    '            </div>\n'+
    '        </form>\n' +
    '    </div>\n' +
    '</div>';
}
//generates the sound card for a given value object
function sndPresetCard(value){
    return '<div class="card">\n' +
    '    <div class="card-header">' + (value.id == null ? '<strong>New Preset</strong>' : '<strong>Preset</strong> ' + value.id) + '</div>\n' +
    '    <div class="card-body">\n' +
    '        <form class="preset-form" data-table="SNDPreset">\n' +
    '            <div class="form-group"><label>Preset Name</label>\n' +
    '                <input class="form-control" name="name" type="text" value="' + value.name + '">\n' +
    '            </div>\n' +
    '            <div class="form-group"><label>Preset Enabled</label>\n' +
    '                <input class="form-control" name="enabled" type="checkbox" checked="' + value.enabled + '">\n' +
    '            </div>\n' +
    '            <div class="form-group"><label>Preset Data</label>\n' +
    '                <textarea class="form-control" name="data" type="text" rows="10" cols="30">' + value.data + '</textarea>\n' +
    '            </div>\n' +
        (value.id != null ? '<input type="hidden" name="id" value="'+ value.id + '">\n' : '') +
    '            <button class="btn btn-sm btn-success" type="submit">Save</button>\n' +
    '        </form>\n' +
    '    </div>\n' +
    '</div>';
}

//websocket
const socket = io(':80');
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

//Presets section
socket.on('preset', (data) => {
    if ("LXPreset" in data) {
        let presetarea = $("#LXPresetList");
        presetarea.html("");
        $.each(data["LXPreset"], function (key, value){
            //add a card for each preset
            presetarea.append(lxPresetCard(value));
        });
    } else if ("SNDPreset" in data) {
        let presetarea = $("#SNDPresetList");
        presetarea.html("");
        $.each(data["SNDPreset"], function (key, value){
            //add a card for each preset
            presetarea.append(sndPresetCard(value));
        });
    }
});

//Settings Section
socket.on('config', (data) => {
    var type = false;
    if ("config" in data) {
        type = "config";
    } else if ("SNDConfig" in data) {
        type = "SNDConfig";
    } else if ("LXConfig" in data) {
        type = "LXConfig";
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
$(document).on('submit', 'form.preset-form[data-table]', function(){
   socket.emit('updatePreset', $(this).data("table"), $(this).serializeArray());
   return false;
});

//add new preset
$('#lxNew').click(function (){
    //an empty object for creating new presets
    const emptyValues = {id:null, name:"", universe:1, enabled:true, setArguments:"" };
    $("#LXPresetList").append(lxPresetCard(emptyValues));
})
$('#sndNew').click( function (){
    //an empty object for creating new presets
    const emptyValues = {id:null, name:"", enabled:true, data:"" };
    $("#SNDPresetList").append(sndPresetCard(emptyValues));
})

//remove preset
function removePreset (button) {
    socket.emit('removePreset', button.form.getAttribute('data-table'), {id:button.getAttribute('data-id')});
}