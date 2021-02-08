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

## Licenced


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