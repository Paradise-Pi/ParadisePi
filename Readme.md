# ParadisePi

A facility control panel for sACN & OSC, in Electron.

## Limitations

- Only one network interface can exist on the RaspberryPi. WiFi must be disabled.

## Developing

For the OSC library windows build tools are needed: `npm install --global windows-build-tools`

### Debugging 

```bash
npm install && npm start
```

### Building

```bash
npm run package-mac
npm run package-win
npm run package-linux
```