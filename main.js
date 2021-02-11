// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain} = require('electron');
const path = require('path');
const {LXConfig,SNDConfig} = require('./config.js');
const oscHandler = require("osc");
const e131 = require('e131');
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'database.sqlite'),
  },
  useNullAsDefault: true,
});

//Main Window
let mainWindow;

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 400,
    minWidth: 600,
    title: "Paradise",
    icon: path.join(__dirname, 'assets/icon/icon.png'),
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createDatabases()
  createWindow()
  
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
async function createDatabases() {
  const haslxPreset = await knex.schema.hasTable('lxPreset');
  if (!haslxPreset) {
    knex.schema.createTable('sndPreset', table => {
        table.integer('id');
        table.string('name');
        table.boolean('enabled');
        table.string('address');
        table.json('setArguments');
        table.json('unSetArguments');
    });
    knex('lxPreset').insert({ id:1, name: "LX1", enabled: false, universe: 1, setValues: {}, unSetValues: {}});
    knex('lxPreset').insert({ id:2, name: "LX2", enabled: false, universe: 1, setValues: {}, unSetValues: {}});
    knex('lxPreset').insert({ id:3, name: "LX3", enabled: false, universe: 1, setValues: {}, unSetValues: {}});
    knex('lxPreset').insert({ id:4, name: "LX4", enabled: false, universe: 1, setValues: {}, unSetValues: {}});
  }

  const hassndPreset = await knex.schema.hasTable('sndPreset');
  if (!hassndPreset){
    knex.schema.createTable('sndPreset', table => {
        table.integer('id');
        table.string('name');
        table.boolean('enabled');
        table.string('address');
        table.json('setArguments');
        table.json('unSetArguments');
    });
    knex('sndPreset').insert({id:1, name: "Sound1", enabled: false, address: "/info", setArguments:{}, unSetArguments: {}});
    knex('sndPreset').insert({id:2, name: "Sound2", enabled: false, address: "/info", setArguments:{}, unSetArguments: {}});
    knex('sndPreset').insert({id:3, name: "Sound3", enabled: false, address: "/info", setArguments:{}, unSetArguments: {}});
    knex('sndPreset').insert({id:4, name: "Sound4", enabled: false, address: "/info", setArguments:{}, unSetArguments: {}});
  }

  const haslxConfig = await knex.schema.hasTable('lxConfig');
  if (!haslxConfig){
    knex.schema.createTable('lxConfig', table => {
      table.string('key');
      table.string('value');
    });
    knex('lxConfig').insert({key:"e131Universes", value:1})
    knex('lxConfig').insert({key:"e131SourceName", value:"Paradise Pi"})
    knex('lxConfig').insert({key:"e131Priority", value:25})
    knex('lxConfig').insert({key:"e131Frequency", value:5})
  }

  const hassndConfig = await knex.schema.hasTable('sndConfig');
  if (!hassndConfig) {
    knex.schema.createTable('sndConfig', table => {
      table.string('key');
      table.string('value');
    })
    knex('sndConfig').insert({key:"targetIP", value:"192.168.1.1"});
    knex('sndConfig').insert({key:"targetPort", value:"10023"});
  }
}

ipcMain.on("queryDB", (event, args) => {
  let validTables = ['lxPreset', 'sndPreset', 'lxConfig', 'sndConfig'];
  let tableIdentifiers = {'lxPreset':'id', 'sndPreset':'id', 'lxConfig':'id', 'sndConfig':'id'}
  if (validTables.includes(args.tableName)) {
    knex.select().table(args.tableName).where(tableIdentifiers[args.tableName], args.value)
        .then((rows) => {
          event.sender.send("dbRequestReply", {element: args.element, data:rows[0]});
        })
  }
})

//OSC
//define oscHandler stuff
var udpPort = new oscHandler.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57121,
  //remoteAddress: SNDConfig.targetIP,
});

udpPort.on("ready", function () {
  console.log("Listening out");
  udpPort.send({address:"/info", args:[]}, SNDConfig.targetIP, 10023);
  ipcMain.emit("fromMain", {data:"hello"});
});
udpPort.on("message", function (oscMessage) {
  mainWindow.send("fromOSC", {data:oscMessage})
  console.log(oscMessage);
});
udpPort.on("error", function (err) {
  console.log(err);
});
udpPort.open();

//events
ipcMain.on("sendOSC", (event, arguments) =>{
  udpPort.send({address: arguments.command, args: arguments.commandArgs}, SNDConfig.targetIP, SNDConfig.targetPort)
});

//sACN
var e131Clients = [];
for (var i = 1; i <= LXConfig.e131Universes; i++) {
  e131Clients[i] = {"client": new e131.Client(i)};
  e131Clients[i]['packet'] = e131Clients[i]["client"].createPacket(512);
  e131Clients[i]['addressData'] = e131Clients[i]['packet'].getSlotsData();
  e131Clients[i]['packet'].setSourceName(LXConfig.e131SourceName);
  e131Clients[i]['packet'].setUniverse(i);
  e131Clients[i]['packet'].setPriority(LXConfig.e131Priority);
}

ipcMain.on("sendACN", (event, args) => {
  var universe = args.universe;
  var channelsValues = args.channelsValues; //Format = {53:244,14:34,56:255}
  for (var channel=0; channel<e131Clients[universe]['addressData'].length; channel++) {
    if (channelsValues[(channel+1)] !== undefined) {
      e131Clients[universe]['addressData'][channel] = channelsValues[(channel+1)];
    } else { //this bit allows only one preset at a time
      //todo make an additive or solo option?
      e131Clients[universe]['addressData'][channel] = null;
      //console.log(e131Clients[universe]['addressData'][channel]);
    }
  }
});

function sendE131(universe) {
  e131Clients[universe]['client'].send(e131Clients[universe]['packet'], function () {
    setTimeout(function () {
      sendE131(universe)
    }, (1000/LXConfig.e131Frequency));
  });
}
if (LXConfig.e131Universes > 0) {
  for (var universe = 1; universe <= LXConfig.e131Universes; universe++) {
    sendE131(universe);
  }
}