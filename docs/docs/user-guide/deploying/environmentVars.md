---
sidebar_position: 2
title: Environment Variables
---

If deploying from a docker container, or on a remote device, you might want to configure certain aspects of Paradise with an environment variable.

You can use the following environment variables to configure Paradise:

| Field | Description |
|----:|:-----------|
| `FULLSCREEN` | Set to "true" to enable fullscreen mode. Note that this overrides the setting in the database |
| `WEB_SERVER_PORT` | Desired port for the webserver mode |
| `DEV_MODE` | Run in development mode, disable the logging to file functions. Set to "true" to enable |