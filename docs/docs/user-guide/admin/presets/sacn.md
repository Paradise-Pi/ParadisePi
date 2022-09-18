---
sidebar_position: 2
title: sACN (e1.31)
---

sACN (e1.31) presets are usually used for lighting control. sACN is based on universes (as it is based on DMX), so each preset needs to be assigned a universe. sACN presets cannot control multiple universes at once, so to control multiple universes you need to create multiple presets (you can hide these) and then use the macro preset to trigger them all at once.

![sACN editing](@site/static/img/tutorial/admin/admin-preset-sacn.png)

The 512 channels (parameters) in a universe are displayed in banks for ease of viewing, you can move between banks using the plus and minus buttons. If a channel is blank then when the preset is recalled the value of that channel will not be changed from its current value (which will have been set by another preset, or be 0 if it has not been set by any presets). Channel values can be between 0 and 255.

## Shortcuts

Shortcuts allow you to manipulate the entire universe in bulk. This is useful if you are editing a preset captured, or you want to set all the values you've left blank to a certain value (or want to blank all 0 channels). This is especially useful for editing presets captured from a lighting console using sampling mode.

![Shortcuts in sACN editing](@site/static/img/tutorial/admin/admin-preset-sacn-shortcut.png)


## Sampling Mode

To speed up the creation of lighting presets, Paradise provides a sampling mode. Using a lighting console that outputs sACN, you can setup output from that console and then Paradise will scan them (for the time [set in config](../config#sacn)) to record the levels across up to 20 sACN universes, and save each universe as a sampled preset which you can then edit as any other preset. 16bit addresses are supported by sampling mode, but not intended for edit via the admin user interface - these are common in moving lights.

## Priority 

It is important to consider the sACN priority set on Paradise - normally this will be lower than another console that outputs sACN, such that Paradise can't override that console's output. If you are not seeing output on your network, set the priority to a higher value. Priorities go from 1 to 200, where 200 is the most important.