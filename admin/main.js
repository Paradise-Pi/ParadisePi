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
            presetarea.append('<div class="card">\n' +
                '    <div class="card-header"><strong>Preset</strong> ' + value.id + '</div>\n' +
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
                '            <input type="hidden" name="id" value="'+ value.id + '">\n' +
                '            <button class="btn btn-sm btn-success" type="submit">Save</button>\n' +
                '        </form>\n' +
                '    </div>\n' +
                '</div>');
        });
    } else if ("SNDPreset" in data) {
        let presetarea = $("#SNDPresetList");
        presetarea.html("");
        $.each(data["SNDPreset"], function (key, value){
            presetarea.append('<div class="card">\n' +
                '    <div class="card-header"><strong>Preset</strong> ' + value.id + '</div>\n' +
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
                '            <input type="hidden" name="id" value="'+ value.id + '">\n' +
                '            <button class="btn btn-sm btn-success" type="submit">Save</button>\n' +
                '        </form>\n' +
                '    </div>\n' +
                '</div>');
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
    } else if ("LXPreset" in data){
        type = "LXPreset"
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