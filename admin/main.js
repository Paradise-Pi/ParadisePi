const socket = io(':80');
//Mechanics of the connection
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
$(document).on('submit','form.settings-form[data-table]',function(){
    socket.emit('updateConfig', $(this).data("table"), $( this ).serializeArray());
    return false;
});
socket.on('about', (data) => {
    $("#settings-version-box").html("");
    $("#settings-version-box").append('<div class="form-group"><label>Paradise Version</label><input class="form-control" type="text" value="' + data.version + '" disabled></div>');
    $.each(data["npmVersions"], function (key,value) {
        console.log(value);
        $("#settings-version-box").append('<div class="form-group row"><label class="col-md-3 col-form-label">' + key + '</label><div class="col-md-9"><input class="form-control" disabled value="' + value + '"></div>');
    });
});