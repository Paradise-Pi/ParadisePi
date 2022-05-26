# ParadisePi

[![Test Build](https://github.com/Paradise-Pi/ParadisePi/actions/workflows/electron-test-build.yml/badge.svg)](https://github.com/Paradise-Pi/ParadisePi/actions/workflows/electron-test-build.yml)
![GitHub repo size](https://img.shields.io/github/repo-size/Jbithell/ParadisePi)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/Jbithell/ParadisePi)

![Logo](icon/icon.jpg)

A facility control panel for sACN & OSC, in Electron.

Made up of an electron app, with a websocket server serving an admin interface

## Stack

 - [Electron](https://github.com/electron/electron) (with [Electron Forge](https://www.electronforge.io/) and [Webpack](https://webpack.js.org/))
 - Framework: [React](https://github.com/facebook/react)
 - Styling: [Mantine](https://github.com/mantinedev/mantine)
 - Logging: [Winston](https://github.com/winstonjs/winston)
 - ORM: [Typeorm](https://github.com/typeorm/typeorm) 
 - Database: [Sqlite3](https://sqlite.org)
 - Admin Theme - [CoreUI](https://github.com/coreui)

## Installation

Pre-built packages are provided for Windows, MacOS (Intel) and Linux at the [Latest Release](https://github.com/Jbithell/ParadisePi/releases/latest)

## Docs 

Please see [the website](https://paradisepi.pages.dev/docs/repo-docs/) (*or*, the Markdown files in each code directory) for complete documentation of how to develop it.

These markdown files (along with the `_category_.yml` files) are used to generate the website docs.

## Architecture 

```mermaid
flowchart TB
    subgraph ElectronProcess ["Electron Main Process (node.js)"]
    db[(Database)]-->repo([Database Repository])-->rt[Router]
    rt-->repo-->db
    models([Database Models])-->repo
    rt-->osc{{OSC Output}} & e131{{"sACN (E1.31) Output"}} & http{{"HTTP Output"}}
    samp{{sACN Sampler}}-->repo
    end
    subgraph Clients ["Clients"]
      subgraph ElectronWindow ["Electron Window"]
      react1(React)-.->rd1 & apiCall1
      rd1(Redux) & apiCall1(Api Call Function)-->wrap1{API Wrapper}
      end
   
      subgraph BrowserWindow ["Browser Window (e.g. over Wifi)"]
      react2(React)-.->rd2 & apiCall2
      rd2(Redux) & apiCall2(Api Call Function)-->wrap2{API Wrapper}
      end
    end
    
      wrap2-->socket>Socket.io]-->rt
      socket-- Callback -->wrap2
      repo-->socket-- Push -->rd2

      wrap1-->ipc>IPC Channel]-->rt
      ipc-- Callback -->wrap1
      repo-->ipc-- Push -->rd1
      
    ElectronProcess --> ElectronWindow
    ElectronProcess --> ws>Webserver] --> BrowserWindow
```

## Licence

```
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or 
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```