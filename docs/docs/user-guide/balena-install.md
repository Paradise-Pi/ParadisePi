---
sidebar_position: 2
title: Balena Installation
---

Paradise can be installed directly from [balenaHub](https://hub.balena.io/apps/2141424/ParadisePi), this allows you to manage your fleet and make the most of remote management of the devices.

You'll need to have a Raspberry Pi or other compatible device, and some familiarity with [balenaCloud](https://dashboard.balena-cloud.com/). There is a one click install button on the [balenaHub]((https://hub.balena.io/apps/2141424/ParadisePi)) page which allows you to deploy and manage your fleet.

## Touch Screen Support
Paradise can be configured to work with the [Raspberry Pi 7" Touch Display](https://www.raspberrypi.com/products/raspberry-pi-touch-display/). 

To get the screen to display after installation you will need to change some configuration settings, you can do this either on a fleet level or a device level depending on your preferences.

There are some values that you can set in the standard configuration menu and others you'll need to set as custom configuration.

### Standard Configuration Values

| Name | Config Name | Value |
|------|-------| -------|
|  Define DT overlays	|  RESIN_HOST_CONFIG_dtoverlay | "vc4-kms-v3","disable-wifi","disable-bt"   |
|  Define DT parameters for the default overlay | RESIN_HOST_CONFIG_dtparam | "i2c_arm=off","spi=off","audio=off"    |

### Custom Configuration Values

| Name | Value | Description |
|------|-------|-------------|
|   BALENA_HOST_CONFIG_lcd_rotate   |    2   |   Rotates the screen 180 degrees and also rotates the touchscreen inputs to match.       |

:::info
There is a configuration setting called "Define the rotation or flip of the display" (BALENA_HOST_CONFIG_display_rotate), this setting will only rotate the display but not the touchscreen input. 
:::