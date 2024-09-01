---
sidebar_position: 9
title: Devices
---

Devices are used for making HTTP requests in presets, allowing you to store the IP address/host of the device in one place. It also allows you to monitor the status of a device.

![Device List](@site/static/img/tutorial/admin/admin-devices.png)

You can add a device by clicking the `Add Device` button. You can then set the:

-   Device name, for your reference
-   IP address - for devices on your local network
-   or, you can set a hostname - for devices on the internet
-   Notes, for your reference
-   A path to check for [status checks](./status-checks) - this could be a path that returns information about the device for example that can be used to check its functioning
-   A string to check matches on the status check - this is a string that should be present in the response from the status check path
