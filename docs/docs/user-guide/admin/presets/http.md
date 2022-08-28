---
sidebar_position: 4
title: HTTP
---

HTTP presets are for sending HTTP requests (you'll sometimes see these called "curl" requests online). They are often used to send commands to projectors and other AV hardware. They can also be used to send webhooks, using services such as IFTTT.

![HTTP editing](@site/static/img/tutorial/admin/admin-preset-http.png)

There are four elements to a HTTP preset:

- URL: The URL or IP address to send the request to - for GET requests you can also put URL parameters in here
- Method: The HTTP method to use (GET, POST, PUT, DELETE supported)
- Data: The body of the request - this can be blank
- Headers: Any headers to send with the request - this can be blank

The default timeout for requests is 60 seconds, this cannot currently be changed. 

It is not possible to capture/view responses to the HTTP requests. 