---
sidebar_position: 4
title: HTTP
---

HTTP presets are for sending HTTP requests (you'll sometimes see these called "curl" requests online). They are often used to send commands to projectors and other AV hardware. They can also be used to send webhooks, using services such as IFTTT.

![HTTP editing](@site/static/img/tutorial/admin/admin-preset-http.png)

There are four elements to a HTTP preset:

- URL: The URL or IP address to send the request to
- Method: The HTTP method to use (GET, POST, PUT, DELETE supported)
- Data: The body of the request
- Headers: Any headers to send with the request