# ParadisePi

![GitHub repo size](https://img.shields.io/github/repo-size/Paradise-Pi/ParadisePi)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/Paradise-Pi/ParadisePi)

[![Logo](icon/icon.jpg)](https://paradise-pi.github.io/ParadisePi/)

A facility control panel for sACN & OSC, written in Node.JS.

Read about it [on the website](https://paradise-pi.github.io/ParadisePi/)

## Stack

-   Framework: [React](https://github.com/facebook/react) with [Redux](https://github.com/reduxjs/redux)
-   Styling: [Mantine](https://github.com/mantinedev/mantine)
-   Logging: [Winston](https://github.com/winstonjs/winston)
-   ORM: [Typeorm](https://github.com/typeorm/typeorm)
-   Database: [Sqlite3](https://sqlite.org) with [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) driver
-   Website - [Docusaurus 2](https://github.com/facebook/docusaurus)

## Installing

Currently, the recommended installation method is via Balena where an [app](https://hub.balena.io/apps/2141424/ParadisePi) is maintained. This app is updated with the latest version of ParadisePi by Github Actions.

[![balena deploy button](https://www.balena.io/deploy.svg)](https://hub.balena.io/apps/2141424/ParadisePi)

[Alternatively you can deploy manually and provider your own updates](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/Paradise-Pi/ParadisePi)

## Environment variables

| **Variable**              | **Description**                     | **Default**                     |
| ------------------------- | ----------------------------------- | ------------------------------- |
| `PARADISE_LOG_LEVEL_FILE` | Log level for the log file          | `warn`                          |
| `PARADISE_DATABASE_PATH`  | Path of where to store the database | _Directory of paradise install_ |
| `PARADISE_IMAGE_PATH`     | Path of where to store the database | _Directory of paradise install_ |
| `PARADISE_LOG_PATH`       | Path of where to store the database | _Directory of paradise install_ |

---

## Developing

### Docs

The Paradise website is hosted on Cloudflare Pages, and is built using Docusaurus. The source is in the `/docs` directory.

### Running locally

For the OSC library windows build tools are needed. See the instructions here: https://github.com/nodejs/node-gyp#on-windows

#### Backend

```bash
cd server
npm install
npm develop
```

#### Frontend

```bash
cd client
npm install
npm dev
```

### Balena

Setup a developer environment on your local machine by following [the instructions](https://blog.balena.io/no-hardware-virtualize-balenaos-devices-on-macos/) and then run `balena push <device-name> --nolive` to push the code to the device. [Full docs](https://docs.balena.io/learn/develop/local-mode/)

#### Build Stages

To build for Balena, the build script creates a larger image that is used to build for the correct architecture. This built file is then copied to a slimmer image the larger image is removed. This is done to reduce the size of the final image.

#### Running out of Storage

Building images on a local device tends to cause it to run out of storage quickly. To get around this, login to the device in local mode by running `balena ssh XXXXX.local` and then running `balena system prune -a -f` on the SSH terminal. This will remove all images and containers from the device, freeing up space.

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
