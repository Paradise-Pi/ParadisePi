---
sidebar_position: 90
title: Status Checks
---

Status Checks allow you to remotely monitor your Paradise installation and the devices it connects to. Paradise exposes the following API paths that you can use to monitor the status of your installation:

-   `/monitoring/database` - Returns the status of the basic Paradise installation. Returns `OK` if Paradise is running and its database is not corrupted. Returns `ERROR` if the database is corrupted.
-   `/monitoring/osc` - Returns the status of the OSC connection. Returns `OK` if the OSC connection is established, `NOT ENABLED` if OSC is not enabled, and `OFFLINE` if the OSC connection is not established.
-   `/monitoring/variable/VARIABLEID` - Returns the value of a variable with the ID `VARIABLEID`. Setup the variable in the [Variables](./variables) page.

`OK` is always returned with a 200 status code. `ERROR` is returned with a 500 status code.

We recommend setting up a monitor in your monitoring system to check these paths periodically. We recommend [UptimeRobot](https://uptimerobot.com/) for this purpose, using the [Keyword Monitor](https://uptimerobot.com/keyword-monitoring/) feature to check for the `OK` keyword.
