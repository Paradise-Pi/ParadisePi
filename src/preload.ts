const {
  contextBridge,
  ipcRenderer,
} = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
      send: (channel:any, data:any) => {
        ipcRenderer.send(channel, data);
      },
      receive: (channel:any, func:any) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      },
      asyncSend: async (channel:any, data:any) => {
        return await ipcRenderer.invoke(channel, data);
      },
    },
);
