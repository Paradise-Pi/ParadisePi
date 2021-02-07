// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain} = require('electron')
const path = require('path')
const e131 = require('e131');
const osc = require("osc");
const { LXConfig, SNDConfig } = require('./config.js');

let mainWindow;

async function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

var e131Clients = [];
for (var i = 1; i <= LXConfig.e131Universes; i++) {
  e131Clients[i] = {"client": new e131.Client(i)};
  e131Clients[i]['packet'] = e131Clients[i]["client"].createPacket(512);
  e131Clients[i]['addressData'] = e131Clients[i]['packet'].getSlotsData();
  e131Clients[i]['packet'].setSourceName(LXConfig.e131SourceName);
  e131Clients[i]['packet'].setUniverse(i);
  e131Clients[i]['packet'].setPriority(LXConfig.e131Priority);
}

/*
var e131Listener = new e131.Server([1,2]);
e131Listener.on('listening', function() {
  console.log('server listening on port %d, universes %j', this.port, this.universes);
});
e131Listener.on('packet', function (packet) {
  var sourceName = packet.getSourceName();
  var sequenceNumber = packet.getSequenceNumber();
  var universe = packet.getUniverse();
  var slotsData = packet.getSlotsData();

  console.log('source="%s", seq=%d, universe=%d, slots=%d',
      sourceName, sequenceNumber, universe, slotsData.length);
  console.log('slots data = %s', slotsData.toString('hex'));
});*/

ipcMain.on("sendACN", (event, args) => {
  var universe = args.universe;
  var channelsValues = args.channelsValues; //Format = {53:244,14:34,56:255}
  for (var channel=0; channel<e131Clients[universe]['addressData'].length; channel++) {
    if (channelsValues[(channel+1)] !== undefined) {
      e131Clients[universe]['addressData'][channel] = channelsValues[(channel+1)];
    } else {
      e131Clients[universe]['addressData'][channel] = null;
      console.log(e131Clients[universe]['addressData'][channel]);
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



var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57121,
  //remoteAddress: SNDConfig.targetIP,
});

udpPort.on("ready", function () {
  console.log("Listening out");
  //udpPort.send("/info","");
});
udpPort.on("message", function (oscMessage) {
  console.log(oscMessage);
});
udpPort.on("error", function (err) {
  console.log(err);
});
udpPort.open();