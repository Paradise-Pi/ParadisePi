---
sidebar_position: 2
title: Configuration
---

Paradise Pi is modular by design, allowing you to use any combination of the available features.

## General
---
![General Settings](@site/static/img/tutorial/admin/admin-config-general.png)

### Locking the system
Paradise contains a locking function, which disables any control panels stopping presets from being recalled. 
So that you don't lock yourself out, you can only lock the control panel when accessing the config page from an external browser.

### Allow access from Control Panel to Admin
See [Remote Control](../control/remote#setup-menu-is-disabled-on-the-device) for more information about disabling access.

### Help page
You can provide information about what paradise pi is and what you can control, by using the help page text. This will appear above the link buttons on the help page in the control panel.

## Screensaver
---
Paradise Pi has a built in screensaver, which is activated after a set period of time.  
By default, this screensaver is a blank screen. However, you can add an image to the screensaver (such as a logo), which will be dislayed as the screensaver.

The idle time for the screensaver can be set in this menu, and it defaults to 500 seconds.

## Database & Logs
---
Paradise Pi uses a SQLite databse to store configuration. This can be backed up by downloading a database backup from the database and logs page.  
You can also recall a backup from here, by uploading the file to the device. 

:::danger
Paradise Pi will _not_ check the database before applying it, so uploading an invalid file will mean you lose all data from Paradise Pi.
:::

## sACN
---
sACN (E1.31) is a protocol for sending lighting data over a network. Most lighting consoles will support sACN, and there are a number of network nodes available that can convert sACN to DMX.
It is an optional feature of Paradise Pi and can be enabled in the configuration menu.

More information about sACN can be found [here](https://en.wikipedia.org/wiki/E1.31).

Paradise Pi acts as a sACN transmitter, and so you can control how many universes of lighting data it transmits, along with the sACN priority, name and frequency.  
It _should_ transmit on the first network interface that is available but it is **highly** recommended that you only have one network interface enabled on the device running Paradise Pi.

The Sampler Time field is used to control how long [Sampling mode](presets/sacn#sampling-mode) runs for.


## OSC
---
OSC (Open Sound Control) is often used to control sound consoles.  
It is an optional feature of Paradise Pi and can be enabled in the configuration menu.

Every console that supports OSC implements the protocol in a different way, so Paradise Pi only supports a number of consoles at this time:
- Behringer X Series
- Behringer X AIR Series
- Midas M Series
- Midas MR Series

Please [open an issue on GitHub](https://github.com/Paradise-Pi/ParadisePi/issues/new?assignees=&labels=enhancement&template=console-request.yml&title=%5BOSC%5D+%3Ctitle%3E) if you think there is another console that should be supported.

You will need to provide the IP address of the console, and then select a supported console from the dropdown in these settings.
