---
sidebar_position: 3
title: Raspberry Pi
---

## Initial installation

To begin deploying on a Raspberry Pi, setup a fresh install of Raspberry Pi OS and install node.js. Guides are available online, we found [this one](https://www.makersupplies.sg/blogs/tutorials/how-to-install-node-js-and-npm-on-the-raspberry-pi) useful.

Then clone the Paradise repository

```bash
git clone https://github.com/paradise-pi/paradisepi
```

Once cloned, install the dependencies 

```bash
cd paradisepi
npm i
```

Then compile the dependencies on the new machine

```
npm run start
```

Then create a local build

```bash
npm run make
```

Ensure the local build can be run

```bash
sudo chmod a+x /home/pi/paradisepi/out/paradisepi-linux-arm64/paradisepi
```

Then create a startup file for the pi 

```bash
sudo nano /home/pi/.config/autostart/paradise.desktop
```

Put the following in the file:

```bash
[Desktop Entry]
Type=Application
Comment=paradise
Exec=/home/pi/paradisepi/out/paradisepi-linux-arm64/paradisepi
```

Open raspi-config (`sudo raspi-config`) and **disable** screen blanking as Paradise includes its own screensaver

### Disable the cursor (if you're using a touchscreen)

```bash
sudo nano /etc/lightdm/lightdm.conf
```

Scroll down to the section labelled `[Seat*]` and remove the `#` from the start of the line saying `xserver-command`

Add ` -nocursor` to the end of the line. It should now be `xserver-command = X -nocursor`

### Disable the automatic update notification

This will popup every 24hrs to let you know that apt packages can be updated.

To disbale it, right click on the menu bar in Rapsberry Pi OS and select the `preferences` button for updater. This will allow you to set the check frequency to 1000 hours (41 days) and you can then click "remove" to hide it from the taskbar as well

## Updating

Ensure you have taken a backup of the:

1. Database
1. Screensaver logo

These will both be deleted during the update

Next, ensure Paradise isn't running - in the administration menu click "exit to Linux" 

```bash
cd paradisepi
git pull
npm i
npm run make
sudo reboot
```