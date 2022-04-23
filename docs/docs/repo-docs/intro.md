---
sidebar_position: 1
title: Introduction
---


## Limitations

- Only one network interface can exist on the RaspberryPi. WiFi must be disabled
- Sampling mode is limited to universes 1-20, due to memory constraints
- 16bit addresses are supported by sampling mode, but not intended for edit via the admin user interface

## Installation

Pre-built packages are provided for Windows, MacOS (Intel) and Linux at the [Latest Release](https://github.com/Jbithell/ParadisePi/releases/latest)


## Developing

For the OSC library windows build tools are needed. See the instructions here: https://github.com/nodejs/node-gyp#on-windows

### Debugging 

```bash
npm install && npm start
```

### Building

```bash
npm run make
```

## Releases

Releases are automatically generated whenever a tag is pushed to the main branch. Once checked, they can then be published in the github dashboard.
