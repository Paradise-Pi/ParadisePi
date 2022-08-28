---
sidebar_position: 1
title: Introduction
---

Presets are the core functionality of Paradise. They allow you to send static information to devices, depending on the preset type. There are four types of preset currently supported:

- [sACN/e1.31 (Normally used for lighting control))](sacn)
- [OSC (Often used for sound control)](osc)
- [HTTP](http)
- [Macro](macro)

## Editing presets

All Presets have the following configuration options:

- Name - this is shown to the user on the control panel
- [Folder](../folders) - where the preset will be shown on the control panel
- Button Colour - defaults to dark grey
- Fade time - this only applies to sACN presets. The default is 0 seconds.
- Visibility - whether to show the preset on the control panel, or whether to keep it hidden. It's useful to keep it hidden if you want to use it as part of a macro.

The remaining configuration options depend on the preset type. To edit the preset options, click the edit icon for that preset.

## Creating presets

Use the `+` button to create a new preset. You will be prompted to select a preset type, and then a preset will be created with the default options for that type. Before saving, you will need to select a folder for the preset.

It is not possible to change what type a preset is once you have created it.