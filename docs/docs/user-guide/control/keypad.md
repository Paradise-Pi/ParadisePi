---
sidebar_position: 10
title: Keypad Control
---

The Keypad is a special page that allows you to control your lights using a keypad.  
You must create a [Macro Preset](../admin/presets/macro) to access the Keypad page.

![Keypad editing](@site/static/img/tutorial/control-panel/keypad.png).

The keypad will check for a valid control string, and then show a fader to set the level for those addresses. A valid control string is:

- A single address, e.g. `1`
- A range of addresses, e.g. `1 thru 200`

It will override the value of the selected channels with the value of the fader.
