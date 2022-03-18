//JQuery function to add an element and return the created object
jQuery.fn.addChild = function(html = "<div class='oscDiv'>")
{
    var target  = $(this[0])
    var child = $(html);
    child.appendTo(target);
    return child;
};

//sets which mixer type to get info for
let mixer = "x32";

//store current list of folders
let folders = [];

//Store universe data
let firstUniverse = 1;
let lastUniverse = 2;

//"mixer":{"name":["address", startVal, endVal, Step, hasSecondOption]}
const sndFirstOption = {
    "xair":{
        "Channel":["/ch/",1,16,1, true],
        "Mute Group":["/config/mute/", 1,6,1, false],
        "Master": ["/lr", false, false, false, true]
    },
    "x32":{
        "Channel":["/ch/",1,16,1, true],
        "Mute Group":["/config/mute/", 1,6,1, false],
        "Master": ["/main/st", false, false, false, true]
    }
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
function lxPresetCard(presetArea, value, firstUniverse, lastUniverse, folderList){
    let card = presetArea.addChild("<div class='card'>");
    //Card Title
    card.addChild('<div class="card-header">' + (value.id == null ? '<strong>New Preset</strong>' : '<strong>Preset</strong> ' + value.id) + '</div>\n');
    //card Body + form
    var form = card.addChild("<div class='card-body'>").addChild('<form class="preset-form" data-table="LXPreset">');
    //Name
    form.addChild('<div class="form-group"><label>Preset Name</label>\n<input class="form-control" name="name" type="text" value="' + value.name + '">\n</div>');
    //Folder
    var folderDiv = form.addChild('<div class="form-group">');
    folderDiv.addChild('<label>Preset Folder</label>');
    var folderSelect = folderDiv.addChild('<select class="form-control" name="folderId">');
    folderSelect.addChild('<option selected value="null">None</option>');
    if(folderList){
        folderList.forEach(folderItem => {
            folderSelect.addChild('<option ' +  (value.folderId == folderItem.id ? 'selected' :'' ) + ' value="' + folderItem.id + '">' + folderItem.name + '</option>');
        });
    }
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

//generates the folder card for a given value object
function lxPresetFolderCard(presetArea, value, folderList) {
    let card = presetArea.addChild("<div class='card'>");
    //Card Title
    card.addChild('<div class="card-header">' + (value.id == null ? '<strong>New Folder</strong>' : '<strong>Folder</strong> ' + value.id) + '</div>\n');
    //card Body + form
    var form = card.addChild("<div class='card-body'>").addChild('<form class="preset-form" data-table="lxPresetFolders">');
    //Name
    form.addChild('<div class="form-group"><label>Folder Name</label>\n<input class="form-control" name="name" type="text" value="' + value.name + '">\n</div>');
    //Parent
    var folderDiv = form.addChild('<div class="form-group">');
    folderDiv.addChild('<label>Parent Folder</label>');
    var folderSelect = folderDiv.addChild('<select class="form-control" name="parentFolderId">');
    folderSelect.addChild('<option selected value="null">None</option>');
    if(folderList){
        folderList.forEach(folderItem => {
            //stop folders being added to themselves, and their direct parent
            // NB it's still possible to have inaccessible folders, but that's your problem sorry
            if( value.id !== folderItem.id  && value.id !== folderItem.parentFolderId) {
                folderSelect.addChild('<option ' +  (value.parentFolderId == folderItem.id ? 'selected' :'' ) + ' value="' + folderItem.id + '">' + folderItem.name + '</option>');
            }
        });
    }
    //Folder id
    if(value.id != null){ 
        form.addChild('<input type="hidden" name="id" value="'+ value.id + '">\n')
    }
    //Buttons
    form.addChild('<div style="display: inline">\n<button class="btn btn-sm btn-success" type="submit">Save</button>\n'+(value.id != null ? '<button class="btn btn-sm btn-danger" data-id="'+ value.id + '" type="button" onclick="removePreset(this)">Remove</button>\n' : '')+'</div>\n');}

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
    //Existing Data
    let existing = form.addChild('<div class="form-group">');
    existing.addChild('<label>OSC Data</label>');
    let data = JSON.parse(value.data);
    for (const [key, value] of Object.entries(data)) {
        let div = existing.addChild('<div class="form-group">');
        div.addChild("<input class='form-control' style='width: 48%; display: inline; margin-right: 10px' type='text' readonly name='preset[]' value='\"" + key + '":' + JSON.stringify(value) +"'>");
        div.addChild('<button type="button" class="btn btn-danger" style="width: 75px; display: inline; margin-top: -5px;" onclick="$(this).parent()[0].remove()">Delete</button>');
    }

    //New Data
    let oscGroup = form.addChild('<div class="form-group">');
    oscGroup.addChild('<button type="button" class="btn btn-primary" style="display: block;" onclick="addAddress(this)">New OSC call</button><br>');

    //Preset id
    if(value.id != null){ form.addChild('<input type="hidden" name="id" value="'+ value.id + '">\n')}
    //Buttons
    form.addChild('<div style="display: inline">\n<button class="btn btn-sm btn-success" type="submit">Save</button>\n'+(value.id != null ? '<button class="btn btn-sm btn-danger" data-id="'+ value.id + '" type="button" onclick="removePreset(this)">Remove</button>\n' : '')+'</div>\n');
}

function addAddress(element){
    let parent = $(element).parent()[0];
    let child = $("<div class='oscDiv'>");

    oscAddressInputs(child.appendTo(parent));
}

/**
 * creates input elements in the given jquery element
 * @param oscGroup - element
 */
function oscAddressInputs(oscGroup){
    oscGroup.addChild('<button type="button" class="btn btn-danger oscInput oscRemove" onclick="$(this).parent()[0].remove()">Delete</button>');
    let presetAddress = oscGroup.addChild('<input class="form-control oscInput" name="preset[]" type="text" readonly value="">');

    //first item
    let select = oscGroup.addChild('<select class="form-control presetOption">');
    select.addChild('<option disabled selected>Select An Option</option>');
    $.each(sndFirstOption[mixer], function (key, value){
        select.addChild('<option value="'+ value[0]+'">' + key + '</option>');
    })

    let div = oscGroup.addChild("<div class='presetDiv'>") //next info
    let secondDiv = oscGroup.addChild("<div class='presetDiv'>");
    select.change(function (){
        let options = sndFirstOption[mixer][select.find('option:selected')[0].innerText];//get all info
        //empty next div for any changes
        div.html("");
        let firstNumber;
        //If the option has a number element (ch, mute grp (not main mix))
        if (options[1]){
            //update content of presetAddress
            presetAddress[0].value = '"' + options[0] + String(options[1]).padStart(2, '0') + '":{}';
            //create number input based on sndFirstOption array
            firstNumber = div.addChild('<input class="form-control presetNumber" type="number" value="' + options[1] + '" min="' + options[1] + '" max="' + options[2] + '" step="' + options[3] + '">');

            //update content of presetAddress if numbers changed
            firstNumber.change(function () {
                presetAddress[0].value = '"' + options[0] + String(firstNumber[0].value).padStart(2, '0') + '":{}';
            });
        } else {
            presetAddress[0].value = '"' + options[0] + '":{}';
        }


        if(options[4]){ //if has second options for that channel/bus etc, show that form
            let secondSelect = div.addChild('<select class="form-control presetOption">'); //create another selection
            secondSelect.addChild('<option disabled selected>Select An Option</option>');
            $.each(sndSecondOption, function (k, i){
                secondSelect.addChild('<option value="'+ i[0]+'">' + k + '</option>');
            });

            secondSelect.change(function () {
                secondDiv.html("");//clear second div on changes
                let secondOptions = sndSecondOption[secondSelect.find('option:selected')[0].innerText];
                if (options[1]) {
                    presetAddress[0].value = '"' + options[0] + String(firstNumber[0].value).padStart(2, '0') + secondOptions[0] + '":{}';
                } else {
                    presetAddress[0].value = '"' + options[0] + secondOptions[0] + '":{}';
                }

                //create number input based on sndSecondOption array
                let secondNumber = secondDiv.addChild('<input class="form-control presetNumber" type="number" value="' + secondOptions[1] + '" min="' + secondOptions[1] + '" max="' + secondOptions[2] + '" step="' + secondOptions[3] + '">');
                secondNumber.change(function () {
                    if (options[1]) {
                        presetAddress[0].value = '"' + options[0] + String(firstNumber[0].value).padStart(2, '0') + secondOptions[0] + '":{"type":' + (secondOptions[3] % 1 === 0 ? '"i"' : '"f"') + ', "value":' + secondNumber[0].value + '}';
                    } else {
                        presetAddress[0].value = '"' + options[0] + secondOptions[0] + '":{"type":' + (secondOptions[3] % 1 === 0 ? '"i"' : '"f"') + ', "value":' + secondNumber[0].value + '}';
                    }
                });
            });
        } else { //otherwise just show a "true/false" num box
            secondDiv.html("");//clear second div on changes
            let secondNumber = div.addChild('<input class="form-control presetNumber" type="number" min="0" max="1">');
            secondNumber.change(function () {
                if (options[1]) {
                    presetAddress[0].value = '"' + options[0] + String(firstNumber[0].value).padStart(2, '0') + '":{"type":"i" "value":' + secondNumber[0].value + '}';
                } else {
                    presetAddress[0].value = '"' + options[0] + '":{"type":"i" "value":' + secondNumber[0].value + '}';
                }
            });
        }
    })
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

//Folders Section
socket.on('folder', (data) => {
    if("lxPresetFolders" in data) {
        let faderArea = $("#LXPresetFolderList");
        faderArea.html("");
        $.each(data["lxPresetFolders"], function (key, value){
            lxPresetFolderCard(faderArea, value, data["lxPresetFolders"]);
        });
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
        folders = data["LXPreset"].folders;
        let presetarea = $("#LXPresetList");
        presetarea.html("");
        $.each(data["LXPreset"].presets, function (key, value){
            //add a card for each preset
            lxPresetCard(presetarea, value, firstUniverse, lastUniverse, folders);
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
        let section = $("form.settings-form[data-table=" + type + "]");
        section.html("");
        $.each(data[type],function (key,value) {
            let KeyValue = value.value.replace(/"/g, '&quot;');
            if ((type === "SNDConfig" || type === "config") && value.options != null){
                if (value.key === "mixer") {
                    mixer = value.value;
                }
                let options = JSON.parse(value.options);
                let htmlOptions = "";
                $.each(options, function (index, item) {
                    htmlOptions += "<option value='"+ item + "' "+ (value.value === item ? 'selected' : '') +">" + item + "</option>";
                });
                section.append('<div class="form-group"><label>' + value.name + '</label><select class="form-control" name="' + value.key + '" type="text"' + (value.canEdit !== 1 ? 'disabled' : '') +'>' + htmlOptions +'</select><span class="help-block">' + value.description + '</span></div>');
            } else {
                section.append('<div class="form-group"><label>' + value.name + '</label><input class="form-control" name="' + value.key + '" type="text" value="' + KeyValue + '" ' + (value.canEdit != 1 ? 'disabled' : '') + '><span class="help-block">' + value.description + '</span></div>');
            }
        });
        section.append('<button class="btn btn-sm btn-success" type="submit">Save</button>');
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
$(document).on('submit', 'form.preset-form[data-table]', function () {
    var data = $(this).serializeArray();
    var setEnabled = false;
    let table = this.getAttribute("data-table");
    let presetData = "{";
    data.forEach(function (row,index,array) {
        if (row['name'] == "enabled") {
            array[index]['value'] = (row['value'] == "on");
            setEnabled = true;
        }
        if (table === "SNDPreset") {
            if (row['name'] === "preset[]"){
                if (array[index]['value'] !== ""){
                    presetData += array[index]['value'] + ", ";
                }
            }
        }
    });
    if (table !== "lxPresetFolders") {
        if (!setEnabled) {
            data.push({name:"enabled", value: false});
        }
    }

    if (table === "SNDPreset") {
        let finalData = presetData.slice(0,-2);
        finalData = (finalData !== "" ? finalData + "}" : "");
        data.push({name:"data", value:finalData});
        data = data.filter(function (el) {return el.name !== "preset[]"})
    }
    socket.emit('updatePreset', $(this).data("table"), data);
    return false;
});

//add new preset
$('#lxNew').on('click', function(){
    //an empty object for creating new presets
    const emptyValues = {id:null, name:"", universe:1, enabled:true, setArguments:"" };
    lxPresetCard($("#LXPresetList"), emptyValues, firstUniverse, lastUniverse);
});
$('#sndNew').on('click', function(){
    //an empty object for creating new presets
    const emptyValues = {id:null, name:"", enabled:true, data:"" };
    sndPresetCard($("#SNDPresetList"), emptyValues);
});

//add new folder
$('#lxFolderNew').on('click', function(){
    //an empty object for creating new presets
    const emptyValues = {id:null, name:"", parentFolderId:null};
    lxPresetFolderCard($("#LXPresetFolderList"), emptyValues, folders);
});

//add new fader
$('#fdrNew').on('click', function(){
    //empty object
    const emptyValues = {id:null, name:"", channel:1,enabled:true}
    sndFaderCard($("#SNDFaderList"), emptyValues);
});

//remove preset
function removePreset (button) {
    socket.emit('removePreset', button.form.getAttribute('data-table'), {id:button.getAttribute('data-id')});
}

//sample an e131 universe
$('#lxSampleMode').on('click', function(){
    if (confirm("Do you wish to enter sampling mode")) {
        socket.emit('e131sampler');
    }
    $('#lxSampleModeModal').modal('hide');
});

//factory reset
$('#factoryreset').on('click', function(){
    if (confirm("Do you wish to factory reset the device?")) {
        socket.emit('factoryReset');
    }
});
