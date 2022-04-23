import { app, BrowserWindow } from 'electron';
import "reflect-metadata";
import createMainWindow from './createMainWindow';
import dataSource from './database/dataSource';
import fs from 'fs';
import { AdminServer } from './admin-server';
import { LxConfigRepository } from './database/repositories/config';
import E131 from './output/e131';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  // Populate the about info
  const versions = JSON.stringify(process.versions);
  app.setAboutPanelOptions({
    applicationName: 'Paradise',
    applicationVersion: app.getVersion(),
    version: app.getVersion(),
    credits: versions,
    copyright: '©2021-22 James Bithell & John Cherry',
  });
  // Backup the database on boot
  fs.copyFile('database.sqlite', 'admin/database.sqlite', (err) => {
    if (!err) {
      console.log('Database was backed up');
    }
    dataSource.initialize().then(() => {
      if (process.argv.includes('--e131sampler')) {
        //setupE131Sampler();
        //createWindow('e131sampler.html');
      } else {
        //setupOSC();
        if (LxConfigRepository.getItem("e131Enabled")) {
          globalThis.e131 = new E131(); // Have a single version of the class because it locks the network output
        }
        createMainWindow();
        const adminServer = new AdminServer();
      }
      
    }).catch((err) => {
      // TODO handle with a popup to user
      console.error("Error during Data Source initialization", err)
    })
  });
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});