---
sidebar_position: 2
title: Configuration
---

Paradise is modular by design, allowing you to use any combination of the available features - turning off ones you are not using.

## General
---
![General Settings](@site/static/img/tutorial/admin/admin-config-general.png)

### Locking the system
Paradise contains a locking function, which disables any control panels stopping presets from being recalled. This is useful if you want to lock paradise during a performance in a theatre space where a different lighting console is being used for example.

So that you don't lock yourself out, you can only lock the control panel when accessing the config page from an external browser.

### Allow access from Control Panel to Admin

See [Remote Control](../control/remote#setup-menu-is-disabled-on-the-device) for more information about disabling access.

### Help page

You can provide information about what Paradise is and what you can control, by using the help page text. This will appear above the link buttons on the help page in the control panel.

## Screensaver

Paradise has a built in screensaver, which is activated after a set period of time.  

By default, this screensaver is the words "Tap to unlock". However, you can add an image to the screensaver (such as a logo), which will be displayed instead.

The idle time for the screensaver can be set in this menu, and it defaults to 5 seconds.

## Database & Logs

Paradise uses a database to store configuration, presets, faders & folders. This can be backed up by downloading a database backup from the database and logs page - this is **required** when updating, as otherwise all configuration will be lost.

You can also recall a backup from here, by uploading the file to the device. 

:::danger
Paradise will _not_ check the database is valid before applying it, so uploading an invalid file will mean you lose all data from Paradise. Be sure to take a backup before recalling a backup.
:::

## sACN

[sACN (E1.31)](https://en.wikipedia.org/wiki/E1.31) is a protocol for sending lighting data over a network. Most lighting consoles will support sACN, and there are a number of network nodes available that can convert sACN to DMX.

It is an optional feature of Paradise and can be enabled in the configuration menu.

Paradise acts as a sACN transmitter, and so you can control how many universes of lighting data it transmits, along with the sACN priority, name and frequency.  
It _should_ transmit on the first network interface that is available but it is **highly** recommended that you only have one network interface enabled on the device running Paradise. We suggest you disable WiFi on your device if it supports ethernet and WiFi.

The Sampler Time field is used to control how long [Sampling mode](presets/sacn#sampling-mode) runs for.

## OSC

OSC (Open Sound Control) is often used to control sound consoles or other software.

It is an optional feature of Paradise and can be enabled in the configuration menu.

Every console that supports OSC implements the protocol in a different way, so Paradise only supports a number of consoles at this time:
- Behringer X Series (such as the X32)
- Behringer X AIR Series
- Midas M Series (such as the M32)
- Midas MR Series

Please [open an issue on GitHub](https://github.com/Paradise-Pi/ParadisePi/issues/new?assignees=&labels=enhancement&template=console-request.yml&title=%5BOSC%5D+%3Ctitle%3E) if you think there is another console that should be supported.

You will need to provide the IP address of the console on your local network, and then select the type of console from the dropdown in these settings.