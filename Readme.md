# ParadisePi

![Logo](assets/icon/icon.jpg)

A facility control panel for sACN & OSC, in Electron.

Made up of an electron app, with a websocket server serving an admin interface

## Limitations

- Only one network interface can exist on the RaspberryPi. WiFi must be disabled
- Sampling mode is limited to universes 1-64
- 16bit addresses are supported by sampling mode, but not intended for edit via the admin user interface

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