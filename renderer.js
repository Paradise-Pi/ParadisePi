// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

window.api.receive("fromMain", (data) => {
    console.log(`Received ${data} from main process`);
});
window.api.send("sendACN", {"universe":1,"channelsValues": {30:255,12:255}});

