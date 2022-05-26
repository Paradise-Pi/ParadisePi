---
sidebar_position: 1
title: Introduction
---

## Developing

For the OSC library windows build tools are needed. See the instructions here: https://github.com/nodejs/node-gyp#on-windows

### Debugging 

```bash
npm install && npm start
```
To restart the app (hot reloading doesn't work for the main process itself, only the rendered output) type `rs` into the command line opened by the start command

You can access the rendered output of the app in a browser as well (if helpful) by visiting [http://localhost:9001/main_window/#/main/help](http://localhost:9001/main_window/#/main/help). This doesn't work in production. 

### Building

```bash
npm run make
```

## Releases

Releases are automatically generated whenever a tag is pushed to the main branch. You can them check them over and publish them.
