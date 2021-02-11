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
const options = {

};
const io = require('socket.io')(server, options);

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Test',
        click () {
          //mainWindow.send("newFile", {})
          console.log("CLicked");
        }
      },
      {
        label: 'Reboot',
        click () {
          reboot();
        }
      },
      { type: 'separator' },
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About',
        role: 'about'
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })
}

const menu = Menu.buildFromTemplate(template)


//Main Window
let mainWindow;
var LXConfig = {};
var SNDConfig = {};
var MAINConfig = {}; //Config variables

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 400,
    minWidth: 650,
    title: "Paradise",
    icon: path.join(__dirname, 'assets/icon/icon.png'),
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js')
    }
  });
  Menu.setApplicationMenu(menu)
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
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
    server.listen(80);
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
      table.integer('id');
      table.string('name');
      table.boolean('enabled');
      table.string('universe');
      table.json('setArguments');
    });
    await knex('lxPreset').insert({ id:1, name: "LX1", enabled: true, universe: 1, setArguments: JSON.stringify({"1":150,"512":25})});
  }
  if (!await knex.schema.hasTable('sndPreset')){
    await knex.schema.createTable('sndPreset', table => {
        table.integer('id');
        table.string('name');
        table.boolean('enabled');
        table.json('data');
    });
    await knex('sndPreset').insert({id:1, name: "Sound1", enabled: true, data: JSON.stringify({"/ch/01/mix/fader": {type:"f", value:0.5},"/ch/01/mix/on": {type:"i", value:1}})});
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
    await knex('config').insert({key:"deviceName", value:"James\'s PC",name:'Device Name',description:'Device\'s friendly name'});
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
/*
ipcMain.on("queryDB", (event, args) => {
  await knex.select().table(args.tableName).where(args.keyName, args.value).then((rows) => {
    if (typeof args.callback === "function") {
      args.callback(rows);
    }
  });
});*/
ipcMain.handle('simpleQueryDB', async (event, data) => {
  if ("keyName" in data && data.keyName !== null) {
    var result = await knex.select().table(data.tableName).where(data.keyName, data.value);
  } else {
    var result = await knex.select().table(data.tableName);
  }
  return result;
});

ipcMain.handle('countQueryDB', async (event, data) => {
  let counts = await knex.select().table(data.tableName).count();
  return counts[0]['count(*)'];
})


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
ipcMain.handle('getVersions', async (event, data) => {
  return process.versions;
});
ipcMain.handle('getConfig', async (event, data) => {
  return {"LXConfig":LXConfig,"SNDConfig":SNDConfig,"MAINConfig":MAINConfig};
});

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
  udpPort.send({address: arguments.command, args: arguments.commandArgs});
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
  var universe = args.universe;
  var channelsValues = args.channelsValues; //Format = {53:244,14:34,56:255}
  for (var channel=0; channel<e131Clients[universe]['addressData'].length; channel++) {
    if (channelsValues[(channel+1)] !== undefined) {
      e131Clients[universe]['addressData'][channel] = channelsValues[(channel+1)];
    } else {
      //TODO fork library and make an additive or solo option?
      e131Clients[universe]['addressData'][channel] = 0;
    }
  }
});


// Socket.io admin site
io.on('connection', socket => {
  knex.select().table('sndConfig').then((data) => {
    socket.emit('config', { "SNDConfig": data } );
  });
  knex.select().table('lxConfig').then((data) => {
    socket.emit('config', { "LXConfig": data } );
  });
  knex.select().table('config').then((data) => {
    socket.emit('config', { "config": data } );
  });
  socket.emit('about', {
    "npmVersions": process.versions,
    "version": app.getVersion()
  });
  socket.on('updateConfig', async(table,data) => {
    if (["config","LXCofig","SNDConfig"].includes(table)) {
      for (const [key, value] of Object.entries(data)) {
        await knex(table).where({ key: value.name }).update({ value: value.value })
      }
      reboot();
    }
  });
  socket.on("disconnect", (reason) => {
    console.log("Disconnected: " + reason)
  });
});