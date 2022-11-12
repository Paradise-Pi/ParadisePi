---
sidebar_position: 2
title: Remote Control
---

Paradise creates a web server that allows you to access the control panel and administration menu on any device on the same network that has an internet browser. The most common example of this is to use an iPad to remote control the system. This is optional - you can also use the control panel directly from the device it is running on if you would prefer to. 

## Accessing the Control Panel from another device

In order to connect, you need to determine the IP Address of the computer running Paradise. There are two ways to find this out, depending on how Paradise is configured.

To begin, navigate to the Help tab in the Control Panel.

![Navigate to help](@site/static/img/tutorial/control-panel/remote-control/image-002.jpg)  

Next, click the button labelled **Setup and Administration Menu**

![Click Setup and Administration Menu](@site/static/img/tutorial/control-panel/remote-control/image-003.jpg)  

### Determining the IP address if setup menu is disabled on the device

If the Setup and Administration Menu has been disabled by your administrator, you will see the following message. If you do not see this message, continue to [the section below](#setup-menu-is-enabled-on-the-device)

![The setup and administration area has been disabled by your administrator](@site/static/img/tutorial/control-panel/remote-control/image-004.jpg)  

Click on the black box (see circle above) **five** times. The box will change to show a QR Code and a URL.

![QR Code & URL](@site/static/img/tutorial/control-panel/remote-control/image-005.jpg)

On your device, ensure you are on the same network as the computer running Paradise. Then, navigate to the URL shown (or scan the QR Code).

On your device, you will see the following page:

![Landing page](@site/static/img/tutorial/localhost.jpeg) 

Click "Control Panel" to access the Control Panel remotely.

### Determining the IP address if setup menu is enabled on the device

If the Setup and Administration Menu has been enabled by your administrator, you will see the following message. 

![QR Code & URL](@site/static/img/tutorial/control-panel/remote-control/image-007.jpg)

Click Proceed to continue. You will now see the following in the Administration Menu. Click on the "Server. Click for QR Code" button.

![Click Server](@site/static/img/tutorial/control-panel/remote-control/image-008.jpeg)

On your device, ensure you are on the same network as the computer running Paradise. Then, navigate to the URL shown (or scan the QR Code).

On your device, you will see the following page:

![Landing page](@site/static/img/tutorial/localhost.jpeg) 

Click "Control Panel" to access the Control Panel remotely.

## Setting a password for Remote Access

In order to prevent access to the Control Panel from unauthorised devices, you can set a password for remote access. This is done in the [Administration Menu](/docs/user-guide/admin/config)

![Remote Access Password Entry page](@site/static/img/tutorial/remote-access-password.jpg) 

There is no authentication on screensaver and database uploads, or database and log downloads. Anyone on the same network can access these features without a password.

HTTPs is not supported by Paradise Pi, so it is not possible to encrypt these connections and prevent man-in-the-middle attacks.

## Internet 

We do not recommend exposing your Control Panel to the internet. This is a security risk, as anyone with the URL can access the Control Panel and control the Lighting and Sound. 

There are no built-in security mechanisms in Paradise, and it's not possible to secure it with a password. If you would like to expose Paradise to the internet, we recommend using a VPN to secure the connection.