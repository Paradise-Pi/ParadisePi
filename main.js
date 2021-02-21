// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain,Menu,dialog} = require('electron');
const path = require('path');
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
  staticServerFile.serve(req, res);
});
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const ip = require('ip');

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

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 480,
    minWidth: 800,
    minHeight: 480,
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
  mainWindow.loadFile('index.html')
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
  initDatabases().then(() => {
    setupOSC();
    setupE131();
    createWindow();
    server.listen(8080);
  });
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
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
    await knex('sndPreset').insert({name: "Sound1", enabled: true, data: JSON.stringify({"/ch/01/mix/fader": {type:"f", value:0.5},"/ch/01/mix/on": {type:"i", value:1}})});
  }
  if (!await knex.schema.hasTable('sndFaders')){
    await knex.schema.createTable('sndFaders', table => {
      table.increments('id').primary();
      table.string('name');
      table.integer('channel');
    });
    await knex('sndFaders').insert({name:"CH 01", channel:1})
  }

  if (!await knex.schema.hasTable('lxConfig')){
    await knex.schema.createTable('lxConfig', table => {
      table.string('key').primary();
      table.string('value');
      table.string('name');
      table.string('description');
      table.boolean('canEdit').defaultTo(true);
    });
    await knex('lxConfig').insert({key:"e131Universes", value:2,name:'Number of Universes',description:''})
    await knex('lxConfig').insert({key:"e131SourceName", value:"Paradise Pi",name:'sACN Source Name',description:''})
    await knex('lxConfig').insert({key:"e131Priority", value:25,name:'sACN Priority',description:'Higher values take precedence'})
    await knex('lxConfig').insert({key:"e131Frequency", value:5,name:'Refresh Rate',description:'',canEdit:false})
    await knex('lxConfig').insert({key:"fadeTime", value:10,name:'LX Fade Time',description:'Delay time to fade all levels in ms (0 is not instant)',canEdit:true})
  }
  if (!await knex.schema.hasTable('sndConfig')) {
    await knex.schema.createTable('sndConfig', table => {
      table.string('key').primary();
      table.string('value');
      table.string('name');
      table.string('description');
      table.boolean('canEdit').defaultTo(true);
    })
    await knex('sndConfig').insert({key:"targetIP", value:"192.168.1.143",name:'OSC Target IP',description:''});
    await knex('sndConfig').insert({key:"targetPort", value:"10023",name:'OSC Target Port',description:''});
  }
  if (!await knex.schema.hasTable('config')) {
    await knex.schema.createTable('config', table => {
      table.string('key').primary();
      table.string('value');
      table.string('name');
      table.string('description');
      table.boolean('canEdit').defaultTo(true);
    });
    await knex('config').insert({key:"deviceLock", value:"UNLOCKED", name:"Device Lock", description:"Lock the device", canEdit:false});
    await knex('config').insert({key:"timeoutTime", value:5, name:"Device Timeout", description:"How soon should the device be blanked after last interaction (minutes)"});

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
function reboot() {
  knex.destroy().then(() => {
    //TODO hang up any listeners for OSC etc.
    app.relaunch();
    app.exit();
  });
}
ipcMain.on("reboot", (event, arguments) =>{
  reboot();
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
  reboot();
}

//OSC Setup
var udpPort;
function setupOSC() {
  udpPort = new oscHandler.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121,
    remotePort: SNDConfig.targetPort,
    remoteAddress: SNDConfig.targetIP,
    //broadcast: true,
    multicastMembership: []
  });
  udpPort.on("ready", function () {
    console.log("UDP Socket open and listening");
    udpPort.send({address:"/info", args:[]});
  });
  udpPort.on("message", function (oscMessage) {
    console.log(oscMessage);
    mainWindow.send("fromOSC", {data:oscMessage});
  });
  udpPort.on("error", function (err) {
    console.log(err);
  });
  udpPort.open();
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
  for (var i = 1; i <= LXConfig.e131Universes; i++) {
    e131Clients[i] = {"client": new e131.Client(i)};
    e131Clients[i]['packet'] = e131Clients[i]["client"].createPacket(512);
    e131Clients[i]['addressData'] = e131Clients[i]['packet'].getSlotsData();
    e131Clients[i]['packet'].setSourceName(LXConfig.e131SourceName);
    e131Clients[i]['packet'].setUniverse(i);
    e131Clients[i]['packet'].setPriority(LXConfig.e131Priority);
  }
  if (LXConfig.e131Universes > 0) {
    for (var universe = 1; universe <= LXConfig.e131Universes; universe++) {
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
ipcMain.on("sendACN", (event, args) => {
  if (MAINConfig.deviceLock === "UNLOCKED") {
    var universe = args.universe;
    var channelsValues = args.channelsValues; //Format = {53:244,14:34,56:255}
    for (var channel = 0; channel < e131Clients[universe]['addressData'].length; channel++) {
      if (channelsValues[(channel + 1)] !== undefined) {
        e131Clients[universe]['addressData'][channel] = channelsValues[(channel + 1)];
      } else {
        //TODO fork library and make an additive or solo option?
        e131Clients[universe]['addressData'][channel] = 0;
      }
    }
  }
});
ipcMain.on("fadeAll", async (event, args) =>  {
  if (MAINConfig.deviceLock === "UNLOCKED") {
    let universes = LXConfig.e131Universes;
    let changedZero = true;
    while(changedZero) {
      changedZero = false;
      for (var channel = 0; channel < 512; channel++) {
        for (let universe = 1; universe <= universes; universe++){
          if (e131Clients[universe]['addressData'][channel] > 0){
            console.log(channel)
            changedZero = true;
            e131Clients[universe]['addressData'][channel]--;
          }
        }
      }
      await new Promise(r => setTimeout(r, LXConfig.fadeTime));
    }
  }
})

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
      reboot();
    }
  });
  //update preset when received from site
  socket.on('updatePreset', async(table, data) => {
    if (["LXPreset", "SNDPreset", "SNDFaders"].includes(table)){
      //rearrange received data for database formatting
      datas = {}
      for (const [key, value] of Object.entries(data)) {
        datas[value.name] = value.value;
      }
      if (datas.id == null){
        //new preset
        if (table === "LXPreset") {
          await knex(table).insert({
            name: datas.name,
            enabled: datas.enabled,
            universe: datas.universe,
            setArguments: datas.setArguments
          });
        } else if (table === "SNDPreset") {
          await knex(table).insert({
            name: datas.name,
            enabled: datas.enabled,
            data: datas.data
          });
        } else if (table === "SNDFaders") {
          await  knex(table).insert({
            name:datas.name,
            channel:datas.channel
          })
        }
      } else {
        //update preset
        await knex.table(table).where({id:(datas.id)}).update(datas);
      }
      //reboot to update settings on controller
      reboot();
    }
  });
  //remove preset
  socket.on('removePreset', async (table, data) => {
    if (["LXPreset", "SNDPreset"].includes(table)){
      console.log(data);

      //remove
      await knex(table).where({ id : data.id }).del();

      //reboot to update settings on controller
      reboot();
    }
  });
  //Lock mechanism
  socket.on('lock', async () => {
    await toggleLock();
  })

  socket.on("disconnect", (reason) => {
    console.log("Disconnected: " + reason)
  });
});