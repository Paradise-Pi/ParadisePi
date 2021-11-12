// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain,Menu,dialog} = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const formidable = require('formidable');
const oscHandler = require("osc");
const e131 = require('e131');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'database.sqlite'),
  },
  useNullAsDefault: true,
});
const staticServer = require('node-static');
const staticServerFile = new(staticServer.Server)(__dirname + "/admin", { cache: false, serverInfo: "ParadisePi",indexFile: "index.html" });
const server = require('http').createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      fs.rename(files.filetoupload.path, 'user-uploaded-database.sqlite', function (err) {
        if (err) throw err;
        else {
          knex.destroy().then(() => {
            fs.rename('user-uploaded-database.sqlite', 'database.sqlite', (err) => {
              if (err) throw err
              res.write('System restored from backup. Please now check the device has initiated correctly');
              res.end();
              reboot(true);
            });
          });
        }
      });
    });
  } else {
    staticServerFile.serve(req, res);
  }
});
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const ip = require('ip');
const meterFunctions = require('./meterFunctions.js');

if (process.platform === 'darwin') {
  const menu = Menu.buildFromTemplate([{
    label: app.getName(),
    submenu: [
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }]);
}



//Main Window
let mainWindow;
var LXConfig = {};
var SNDConfig = {};
var MAINConfig = {}; //Config variables

async function createWindow (fileToLoad) {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 480,
    minWidth: 800,
    minHeight: 480,
    fullscreen: (os.platform() == "linux"),
    title: "Paradise",
    icon: path.join(__dirname, 'assets/icon/icon.png'),
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js')
    }
  });
  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(menu)
  } else {
    Menu.setApplicationMenu(null)
  }
  // and load the index.html of the app.
  mainWindow.loadFile(fileToLoad);
  //Debug
  //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  var versions = JSON.stringify(process.versions);
  app.setAboutPanelOptions({
    applicationName: "Paradise",
    applicationVersion: app.getVersion(),
    version: app.getVersion(),
    credits: versions,
    copyright: "©2021 James Bithell & John Cherry"
  });
  fs.copyFile('database.sqlite', 'admin/database.sqlite', (err) => { //Make the database backup on boot
    if (!err) {
      console.log('Database was backed up');
    }
    initDatabases().then(() => {
      if (process.argv.includes("--e131sampler")) {
        setupE131Sampler();
        createWindow('e131sampler.html');
      } else {
        setupOSC();
        setupE131();
        createWindow('index.html');
        server.listen(8080);
      }
    });
  });
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow('index.html')
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Database Handling
//define db
async function initDatabases() {
  if (!await knex.schema.hasTable('lxPreset')) {
    await knex.schema.createTable('lxPreset', table => {
      table.increments('id').primary();
      table.string('name');
      table.boolean('enabled');
      table.string('universe');
      table.json('setArguments');
      table.integer("fadeTime").defaultTo(null);
    });
    await knex('lxPreset').insert({name: "LX1", enabled: true, universe: 1, setArguments: JSON.stringify({"1":150,"512":25})});
  }
  if (!await knex.schema.hasTable('sndPreset')){
    await knex.schema.createTable('sndPreset', table => {
        table.increments('id').primary();
        table.string('name');
        table.boolean('enabled');
        table.json('data');
    });
    await knex('sndPreset').insert({name:"Unmute Main Mix", enabled: true, data: JSON.stringify({"/main/st/mix/on": {type:"i", value:1}, "/main/st/mix/fader": {type:"f", value:0.5}})});
    await knex('sndPreset').insert({name:"Mute Main Mix", enabled: true, data: JSON.stringify({"/main/st/mix/on": {type:"i", value:0}, "/main/st/mix/fader": {type:"f", value:0.0}})});
  }
  if (!await knex.schema.hasTable('sndFaders')){
    await knex.schema.createTable('sndFaders', table => {
      table.increments('id').primary();
      table.string('name');
      table.integer('channel');
      table.boolean('enabled');
    });
    await knex('sndFaders').insert({name:"CH 01", channel:1, enabled:true})
  }

  if (!await knex.schema.hasTable('lxConfig')){
    await knex.schema.createTable('lxConfig', table => {
      table.string('key').primary();
      table.string('value');
      table.string('name');
      table.string('description');
      table.boolean('canEdit').defaultTo(true);
    });
    await knex('lxConfig').insert({key:"e131FirstUniverse", value:1, name:'First Universe', description:''})
    await knex('lxConfig').insert({key:"e131Universes", value:2,name:'Number of Universes',description:''})
    await knex('lxConfig').insert({key:"e131SourceName", value:"Paradise Pi",name:'sACN Source Name',description:''})
    await knex('lxConfig').insert({key:"e131Priority", value:25,name:'sACN Priority',description:'Higher values take precedence'})
    await knex('lxConfig').insert({key:"e131Frequency", value:5,name:'Refresh Rate',description:'',canEdit:false})
    await knex('lxConfig').insert({key:"fadeTime", value:5,name:'Preset Fade Time',description:'Delay time to fade presets in (seconds). 0 = Instant',canEdit:true})
    await knex('lxConfig').insert({key:"e131Sampler_time", value:15,name:'Sampler Mode run time',description:'How long should sampler mode sample for (in seconds)',canEdit:true})
    await knex('lxConfig').insert({key:"e131Sampler_effectMode", value:0,name:'Sampler Mode effect mode enable',description:'Set to 1 to store values that are varying when in sample mode, they are normally discarded otherwise',canEdit:true})
  }
  if (!await knex.schema.hasTable('sndConfig')) {
    await knex.schema.createTable('sndConfig', table => {
      table.string('key').primary();
      table.string('value');
      table.string('name');
      table.string('description');
      table.string('options').nullable();
      table.boolean('canEdit').defaultTo(true);
    })
    await knex('sndConfig').insert({key:"targetIP", value:"192.168.1.1",name:'OSC Target IP',description:''});
    await knex('sndConfig').insert({key:"mixer", value:"xair", name:'Console Type', description:'Which console?', options:'["xair","x32"]'});
  }
  if (!await knex.schema.hasTable('config')) {
    await knex.schema.createTable('config', table => {
      table.string('key').primary();
      table.string('value');
      table.string('name');
      table.string('description');
      table.string('options').nullable();
      table.boolean('canEdit').defaultTo(true);
    });
    await knex('config').insert({key:"deviceLock", value:"UNLOCKED", name:"Device Lock", description:"Lock the device", canEdit:false});
    await knex('config').insert({key:"timeoutTime", value:5, name:"Device Timeout", description:"How soon should the device be blanked after last interaction (minutes)"});
    await knex('config').insert({key:"LXInfo", value:"", name:"LX Additional Info", description:"Additional Information for the Lighting page"});
    await knex('config').insert({key:"SNDInfo", value:"", name:"SND Additional Info", description:"Additional Information for the Sound page"});
    await knex('config').insert({key:"LXEnabled", value:"true", name:'Lighting Page', description:'Show Lighting Page', options:'["Show","Hide"]'});
    await knex('config').insert({key:"SNDEnabled", value:"true", name:'Sound Page', description:'Show Sound Page', options:'["Show","Hide"]'});
    await knex('config').insert({key:"AdminEnabled", value:"true", name:'Admin Page', description:'Show Admin Page', options:'["Show","Hide"]'});
  }

  await knex.select().table('sndConfig').then((data) => {
    data.forEach(function(entry) {
      SNDConfig[entry['key']] = entry['value'];
    });
  });
  await knex.select().table('lxConfig').then((data) => {
    data.forEach(function(entry) {
      LXConfig[entry['key']] = entry['value'];
    });
  });
  await knex.select().table('config').then((data) => {
    data.forEach(function(entry) {
      MAINConfig[entry['key']] = entry['value'];
    });
  });
}

ipcMain.handle('simpleQueryDB', async (event, data) => {
  if ("keyName" in data && data.keyName !== null) {
    var result = await knex.select().table(data.tableName).where(data.keyName, data.value);
  } else {
    var result = await knex.select().table(data.tableName);
  }
  return result;
});

//General Setup
function factoryReset() { //Drop the database
  knex.destroy().then(() => {
    fs.unlink('database.sqlite', (err) => {
      if (err) throw err
      reboot(true);
    });
  });
}
function reboot(reboot,force,flagsAdd,flagsRemove) {
  if (typeof flagsAdd === "undefined") {
    flagsAdd = [];
  }
  if (typeof flagsRemove === "undefined") {
    flagsRemove = [];
  }
  knex.destroy().then(() => {
    if (reboot) {
      var flags = process.argv.slice(1);
      flagsRemove.forEach(function (flagRemove) {
        flags = flags.filter(item => item !== flagRemove);
      });
      flags = flags.concat(flagsAdd);
      app.relaunch({ args: flags });
    }
    if (force || typeof force === "undefined") { //Default to forcing it
      app.exit(0);
    } else {
      app.quit();
    }
  });
}
ipcMain.on("reboot", (event, arguments) =>{
  reboot(true);
});
ipcMain.on("exit", (event, arguments) =>{
  reboot(false);
});
ipcMain.handle('toggleLock', async (event, data) => {
  await toggleLock();
});
ipcMain.on("devTools", (event, arguments) =>{
  mainWindow.webContents.openDevTools();
});
ipcMain.handle('getVersions', async (event, data) => {
  return process.versions;
});
ipcMain.handle('getConfig', async (event, data) => {
  return {"LXConfig":LXConfig,"SNDConfig":SNDConfig,"MAINConfig":MAINConfig};
});
ipcMain.handle('getIP', async (event, data) => {
  return ip.address();
});



//Toggle lock value and reboot.
async function toggleLock() {
  if (MAINConfig.deviceLock === "LOCKED") {
    await knex('config').where({key: "deviceLock"}).update({value: "UNLOCKED"});
  } else {
    await knex('config').where({key: "deviceLock"}).update({value: "LOCKED"});
  }
  reboot(true);
}

//OSC Setup
var udpPort;
var lastOSCMessage = 0;
var udpStatus = false;
//mixer specifics
let oscPort = {"xair":10024, "x32":10023};
let masterAddress = {"xair":"/lr", "x32":"/main/st"};
function checkStatusOSC() {
  currentMillis = +new Date();
  if (currentMillis-lastOSCMessage > 3000) {
    //Now disconnected from the Mixer
    udpStatus = false;
    try {
      mainWindow.webContents.send("OSCStatus", false);
    } catch(err) {
      //Ignore, it's normally because electron has quit but you're still tidying up
    }
    udpPort.send({address: "/status", args: []}); //Keep trying anyway, no harm
 } else if (currentMillis-lastOSCMessage > 500 && udpStatus) {
    //Send a status request to hope you get something back - before you decide you're offline
    udpPort.send({address: "/status", args: []});
 } else if (currentMillis-lastOSCMessage < 500 && !udpStatus) {
    //Reconnected
    udpStatus = true;
    udpPort.send({address:"/info", args:[]});
    try {
      mainWindow.webContents.send("OSCStatus", true);
    } catch(err) {
      //Ignore, it's normally because electron has quit but you're still tidying up
    }
    subscribeOSC(false);
    //When a connection is first opened, want to get the statuses of stuff we're interested in
    setTimeout(function () { //Timeout is to give the window the chance to have launched, so it doesn't miss the data!
      knex.select().table('sndFaders').then((data) => {
        data.forEach(function(entry) {
          udpPort.send({address:"/ch/"+ String(entry.channel).padStart(2, '0') + "/mix/fader", args:[]});
          udpPort.send({address:"/ch/"+ String(entry.channel).padStart(2, '0') + "/mix/on", args:[]});
        });
        udpPort.send({address:masterAddress[SNDConfig.mixer] + "/mix/fader", args:[]});
        udpPort.send({address:masterAddress[SNDConfig.mixer] + "/mix/on", args:[]});
      });
    },3000);
  } else if (udpStatus) {
    //Still connected, just tell the frontend anyway because it's occasionally dozy (mostly on boot tbh)
    try {
      mainWindow.webContents.send("OSCStatus", true);
    } catch(err) {
      //Ignore, it's normally because electron has quit but you're still tidying up
    }
  }
}
function subscribeOSC(renew) {
  udpPort.send({address:"/xremote"});
  udpPort.send({address:"/meters",args:[{ type: "s", value: "/meters/1"}]});
  /*knex.select().table('sndFaders').then((data) => {
    data.forEach(function(entry) {
      udpPort.send({address:(renew ? '/renew' : '/subscribe'), args:["/ch/"+ String(entry.channel).padStart(2, '0') + "/mix/fader"]});
      udpPort.send({address:(renew ? '/renew' : '/subscribe'), args:["/ch/"+ String(entry.channel).padStart(2, '0') + "/mix/on"]});
    });
    udpPort.send({address:(renew ? '/renew' : '/subscribe'), args:["/main/st/mix/fader"]});
    udpPort.send({address:(renew ? '/renew' : '/subscribe'), args:["/main/st/mix/on"]});
  });*/
}
function setupOSC() {
  udpPort = new oscHandler.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121,
    remotePort: oscPort[SNDConfig.mixer],
    remoteAddress: SNDConfig.targetIP,
  });
  udpPort.on("ready", function () {
    console.log("UDP Socket open and listening");
  });
  udpPort.on("message", function (oscMessage) {
    lastOSCMessage = +new Date();
    checkStatusOSC();

    if (oscMessage.address == "/meters/1") {
      oscMessage.parsed = meterFunctions.meter1PacketParser(oscMessage.args[0]);
    }
    try {
      mainWindow.webContents.send("fromOSC", oscMessage);
    } catch(err) {
      //Ignore, it's normally because electron has quit but you're still tidying up
    }
  });
  udpPort.on("error", function (err) {
    console.log(err);
  });
  udpPort.open();

  //Status Checker function
  setInterval(function () {
    checkStatusOSC();
  }, 1000);

  subscribeOSC(false);
  setInterval(function () {
    subscribeOSC(true);
  }, 9000);
}
//events
ipcMain.on("sendOSC", (event, arguments) =>{
  if (MAINConfig.deviceLock === "UNLOCKED"){
    udpPort.send({address: arguments.command, args: arguments.commandArgs});
  }
});


//LX Setup
var e131Clients = [];
function setupE131() {
  //sACN = E131
  e131Clients = [];
  for (var i = parseInt(LXConfig.e131FirstUniverse); i <= parseInt(LXConfig.e131FirstUniverse)+parseInt(LXConfig.e131Universes)-1; i++) {
    e131Clients[i] = {"client": new e131.Client(i)};
    e131Clients[i]['packet'] = e131Clients[i]["client"].createPacket(512);
    e131Clients[i]['addressData'] = e131Clients[i]['packet'].getSlotsData();
    e131Clients[i]['packet'].setSourceName(LXConfig.e131SourceName);
    e131Clients[i]['packet'].setUniverse(i);
    e131Clients[i]['packet'].setPriority(LXConfig.e131Priority);
  }
  if (LXConfig.e131Universes > 0) {
    for (var universe = parseInt(LXConfig.e131FirstUniverse); universe <= parseInt(LXConfig.e131FirstUniverse)+parseInt(LXConfig.e131Universes)-1; universe++) {
      sendE131(universe);
    }
  }
}
function sendE131(universe) {
  e131Clients[universe]['client'].send(e131Clients[universe]['packet'], function () {
    setTimeout(function () {
      sendE131(universe)
    }, (1000/LXConfig.e131Frequency));
  });
}
ipcMain.on("sendACN", async (event, args) => {
  if (MAINConfig.deviceLock === "UNLOCKED") {
    var universe = args.universe;
    var channelsValues = args.channelsValues; //Format = {53:244,14:34,56:255}
    var fadeTime = (args.fadeTime !== undefined && args.fadeTime !== null ? args.fadeTime : LXConfig.fadeTime);
    let changedZero = true;
    if (false) { //fadeTime != 0
      while (changedZero) {
        //TODO resolve bug meaning this doesn't work when multiple presets are called at the same time
        changedZero = false;
        for (var channel = 0; channel < e131Clients[universe]['addressData'].length; channel++) {
          if (channelsValues[(channel + 1)] !== undefined && e131Clients[universe]['addressData'][channel] !== channelsValues[(channel + 1)]) {
            changedZero = true;
            if (e131Clients[universe]['addressData'][channel] > channelsValues[(channel + 1)] && e131Clients[universe]['addressData'][channel] !== 0) {
                e131Clients[universe]['addressData'][channel]--;
            } else if (e131Clients[universe]['addressData'][channel] !== 255) {
              e131Clients[universe]['addressData'][channel]++;
            }
          }
        }
        await new Promise(r => setTimeout(r, (fadeTime * 1000)/255));
      }
    } else {
      for (var channel = 0; channel < e131Clients[universe]['addressData'].length; channel++) {
        if (channelsValues[(channel + 1)] !== undefined) {
          e131Clients[universe]['addressData'][channel] = channelsValues[(channel + 1)]
        }
      }
    }
  }
});
ipcMain.on("fadeAll", async (event, args) =>  {
  if (MAINConfig.deviceLock === "UNLOCKED") {
    let changedZero = true;
    if (false) { //LXConfig.fadeTime != 0
      while(changedZero) {
        changedZero = false;
        for (var channel = 0; channel < 512; channel++) {
          for (var universe = parseInt(LXConfig.e131FirstUniverse); universe <= parseInt(LXConfig.e131FirstUniverse)+parseInt(LXConfig.e131Universes)-1; universe++){
            if (e131Clients[universe]['addressData'][channel] > 0){
              changedZero = true;
              e131Clients[universe]['addressData'][channel]--;
            }
          }
        }
        await new Promise(r => setTimeout(r, (LXConfig.fadeTime * 1000)/255));
      }
    } else {
      for (var channel = 0; channel < 512; channel++) {
        for (var universe = parseInt(LXConfig.e131FirstUniverse); universe <= parseInt(LXConfig.e131FirstUniverse)+parseInt(LXConfig.e131Universes)-1; universe++){
          e131Clients[universe]['addressData'][channel] = 0;
        }
      }
    }
  }
})
function setupE131Sampler() {
  if (LXConfig["e131Sampler_effectMode"] != 1) {
    var effectMode = false;
  } else {
    var effectMode = true;
  }
  var universes = [];
  for (let i = 1; i <= 20; i++) { //Limit to 20 universes
    universes.push(i);
  }
  var universeData = {};
  var server = new e131.Server(universes);
  server.on('listening', function() {
    setTimeout(() => mainWindow.webContents.send("log", 'Listening on port ' + this.port + '- universes ' + this.universes),1000); //Set timeout needed as often the window isn't quite ready in time
  });
  setTimeout(() => mainWindow.webContents.send("log", effectMode ? 'Storing first value of a varying value (EFFECT MODE ON)':'Ignoring varying values (EFFECT MODE OFF)'),1000);//Set timeout needed as often the window isn't quite ready in time
  server.on('packet', function (packet) {
    var sourceName = packet.getSourceName().replace(/\0/g, '');
    var universe = packet.getUniverse();
    var slotsData = packet.getSlotsData();
    var priority = packet.getPriority();
    if (priority != 0) { //For some reason, known only to the developers of this library/sACN (I'm not even sure)........you get some bizarre packets that are just priorities and nothing else from time to time. The only feature of these I can find is that they have no priority, so if you find one without priority just ignore it and hope for the best.
      if (universeData[sourceName] === undefined) {
        universeData[sourceName] = {};
        setTimeout(() => mainWindow.webContents.send("log", "Found new device " + sourceName),1000);//Set timeout needed as often the window isn't quite ready in time
      }
      if (universeData[sourceName][universe] === undefined) {
        universeData[sourceName][universe] = {};
        setTimeout(() => mainWindow.webContents.send("log", "Found universe " + universe + " for device " + sourceName),1000);//Set timeout needed as often the window isn't quite ready in time
      }
      for (let i = 0; i < slotsData.length; i++) {
        if (universeData[sourceName][universe][i+1] === undefined) {
          universeData[sourceName][universe][i+1] = slotsData[i];
        } else if (!effectMode && universeData[sourceName][universe][i+1] === false) {
          //This has already been marked as jittery - so ignore it
        } else if (!effectMode && universeData[sourceName][universe][i+1] !== slotsData[i]) {
          //So we've found data that doesn't match what we had down for it before, so it might be that an effect is running. The best way to deal with this is to mark it as false, which means it won't be saved (on purpose)
          universeData[sourceName][universe][i+1] = false;
          setTimeout(() => mainWindow.webContents.send("log", "Discarding data for channel " + i + " due to value change (universe " + universe + " from device " + sourceName + ") - is an effect running?"),1000);//Set timeout needed as often the window isn't quite ready in time
        }
      }
    }
  });
  if (LXConfig["e131Sampler_time"] === undefined || LXConfig["e131Sampler_time"] > 300 || LXConfig["e131Sampler_time"] < 5) {
    var timeoutTimerDuration = 15000; //15 seconds is the default
  } else {
    var timeoutTimerDuration = LXConfig["e131Sampler_time"]*1000;
  }
  setTimeout((async () => {
    server.close();
    for (const [deviceName, device] of Object.entries(universeData)) {
      for (const [universeID, universeData] of Object.entries(device)) {
        for(var key in universeData){
          if(universeData.hasOwnProperty(key) && universeData[key] === false){
            delete universeData[key]; //Remove false values
          }
        }
        await knex('lxPreset').insert({name: "Universe " + universeID + " sampled from " + deviceName, enabled: true, universe: universeID, setArguments: JSON.stringify(universeData)});
      }
    }
    reboot(true,true, [],["--e131sampler"]);
  }),timeoutTimerDuration);
  var timeoutStarted = +new Date();

  setInterval(function () {
    var currentTime = +new Date();
    mainWindow.webContents.send("progress", (currentTime-timeoutStarted),timeoutTimerDuration);
  },500);
}



// Socket.io admin site
io.on('connection', socket => {
  //send information from tables
  knex.select().table('sndConfig').then((data) => {
    socket.emit('config', { "SNDConfig": data } );
  });
  knex.select().table('lxConfig').then((data) => {
    socket.emit('config', { "LXConfig": data } );
  });
  knex.select().table('config').then((data) => {
    socket.emit('config', { "config": data } );
  });
  knex.select().table('lxPreset').then((data) => {
    socket.emit('preset', {"LXPreset": data} );
  });
  knex.select().table('sndPreset').then((data) => {
    socket.emit('preset', {"SNDPreset":data});
  });
  knex.select().table('sndFaders').then((data) => {
    socket.emit('fader', {"SNDFader":data});
  });

  socket.emit('about', {
    "npmVersions": process.versions,
    "version": app.getVersion()
  });
  //update config when received from site
  socket.on('updateConfig', async(table,data) => {
    if (["config","LXConfig","SNDConfig"].includes(table)) {
      for (const [key, value] of Object.entries(data)) {
        await knex(table).where({ key: value.name }).update({ value: value.value })
      }
      //reboot to update settings on controller
      reboot(true);
    }
  });
  //update preset when received from admin site
  socket.on('updatePreset', async(table, data) => {
    if (["LXPreset", "SNDPreset", "SNDFaders"].includes(table)){
      //rearrange received data for database formatting
      datas = {}
      for (const [key, value] of Object.entries(data)) {
        datas[value.name] = value.value;
      }
      if (datas.id == null){
        //new preset
        await knex(table).insert(datas);
      } else {
        //update preset
        await knex.table(table).where({id:(datas.id)}).update(datas);
      }
      //reboot to update settings on controller
      reboot(true);
    }
  });
  //remove preset
  socket.on('removePreset', async (table, data) => {
    if (["LXPreset", "SNDPreset"].includes(table)){

      //remove
      await knex(table).where({ id : data.id }).del();

      //reboot to update settings on controller
      reboot(true);
    }
  });
  //Lock mechanism
  socket.on('lock', async () => {
    await toggleLock();
  })
  //Sampling system for e131
  socket.on('e131sampler', async () => {
    reboot(true,true,["--e131sampler"],[]);
  });
  //Factory Reset
  socket.on('factoryReset', function () {
    factoryReset();
  })


  socket.on("disconnect", (reason) => {
    console.log("Disconnected: " + reason)
  });
});