/*

if (LXConfig['e131Sampler_effectMode'] != 1) {
  var effectMode = false;
} else {
  var effectMode = true;
}
const universes = [];
for (let i = 1; i <= 20; i++) { // Limit to 20 universes
  universes.push(i);
}
const universeData = {};
const server = new e131.Server(universes);
server.on('listening', function() {
  setTimeout(() => mainWindow.webContents.send('log', 'Listening on port ' + this.port + '- universes ' + this.universes), 1000); // Set timeout needed as often the window isn't quite ready in time
});
setTimeout(() => mainWindow.webContents.send('log', effectMode ? 'Storing first value of a varying value (EFFECT MODE ON)':'Ignoring varying values (EFFECT MODE OFF)'), 1000);// Set timeout needed as often the window isn't quite ready in time
server.on('packet', function(packet) {
  const sourceName = packet.getSourceName().replace(/\0/g, '');
  const universe = packet.getUniverse();
  const slotsData = packet.getSlotsData();
  const priority = packet.getPriority();
  if (priority != 0) { // For some reason, known only to the developers of this library/sACN (I'm not even sure)........you get some bizarre packets that are just priorities and nothing else from time to time. The only feature of these I can find is that they have no priority, so if you find one without priority just ignore it and hope for the best.
    if (universeData[sourceName] === undefined) {
      universeData[sourceName] = {};
      setTimeout(() => mainWindow.webContents.send('log', 'Found new device ' + sourceName), 1000);// Set timeout needed as often the window isn't quite ready in time
    }
    if (universeData[sourceName][universe] === undefined) {
      universeData[sourceName][universe] = {};
      setTimeout(() => mainWindow.webContents.send('log', 'Found universe ' + universe + ' for device ' + sourceName), 1000);// Set timeout needed as often the window isn't quite ready in time
    }
    for (let i = 0; i < slotsData.length; i++) {
      if (universeData[sourceName][universe][i+1] === undefined) {
        universeData[sourceName][universe][i+1] = slotsData[i];
      } else if (!effectMode && universeData[sourceName][universe][i+1] === false) {
        // This has already been marked as jittery - so ignore it
      } else if (!effectMode && universeData[sourceName][universe][i+1] !== slotsData[i]) {
        // So we've found data that doesn't match what we had down for it before, so it might be that an effect is running. The best way to deal with this is to mark it as false, which means it won't be saved (on purpose)
        universeData[sourceName][universe][i+1] = false;
        setTimeout(() => mainWindow.webContents.send('log', 'Discarding data for channel ' + i + ' due to value change (universe ' + universe + ' from device ' + sourceName + ') - is an effect running?'), 1000);// Set timeout needed as often the window isn't quite ready in time
      }
    }
  }
});
if (LXConfig['e131Sampler_time'] === undefined || LXConfig['e131Sampler_time'] > 300 || LXConfig['e131Sampler_time'] < 5) {
  var timeoutTimerDuration = 15000; // 15 seconds is the default
} else {
  var timeoutTimerDuration = LXConfig['e131Sampler_time']*1000;
}
setTimeout((async () => {
  server.close();
  for (const [deviceName, device] of Object.entries(universeData)) {
    for (const [universeID, universeData] of Object.entries(device)) {
      for (const key in universeData) {
        if (universeData.hasOwnProperty(key) && universeData[key] === false) {
          delete universeData[key]; // Remove false values
        }
      }
      await knex('lxPreset').insert({name: 'Universe ' + universeID + ' sampled from ' + deviceName, enabled: true, universe: universeID, setArguments: JSON.stringify(universeData)});
    }
  }
  reboot(true, true, [], ['--e131sampler']);
}), timeoutTimerDuration);
const timeoutStarted = +new Date();

setInterval(function() {
  const currentTime = +new Date();
  mainWindow.webContents.send('progress', (currentTime-timeoutStarted), timeoutTimerDuration);
}, 500);
*/
