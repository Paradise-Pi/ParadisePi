# ParadisePi

[![Test Build](https://github.com/Jbithell/ParadisePi/actions/workflows/electron-test-build.yml/badge.svg?branch=master)](https://github.com/Jbithell/ParadisePi/actions/workflows/electron-test-build.yml)
![GitHub repo size](https://img.shields.io/github/repo-size/Jbithell/ParadisePi)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/Jbithell/ParadisePi)

![Logo](assets/icon/icon.jpg)

A facility control panel for sACN & OSC, in Electron.

Made up of an electron app, with a websocket server serving an admin interface

## Limitations

- Only one network interface can exist on the RaspberryPi. WiFi must be disabled
- Sampling mode is limited to universes 1-20, due to memory constraints
- 16bit addresses are supported by sampling mode, but not intended for edit via the admin user interface

## Installation

Pre-built packages are provided for Windows, MacOS (Intel) and Linux at the [Latest Release](https://github.com/Jbithell/ParadisePi/releases/latest)

## Demo

https://user-images.githubusercontent.com/8408967/111515042-403cfb00-874a-11eb-8fe7-9bb616f7d0c6.mp4

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

## Credits

- Admin Theme - [CoreUI](https://github.com/coreui)

## Licence


    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
