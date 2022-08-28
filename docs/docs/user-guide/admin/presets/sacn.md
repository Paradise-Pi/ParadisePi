---
sidebar_position: 2
title: sACN (e1.31)
---

sACN (e1.31) presets are usually used for lighting control. sACN is based on universes (as it is based on DMX), so each preset needs to be assigned a universe. sACN presets cannot control multiple universes at once, so to control multiple universes you need to create multiple presets (you can hide these) and then use the macro preset to trigger them all at once.

![sACN editing](@site/static/img/tutorial/admin/admin-preset-sacn.png)

The 512 parameters in a universe are displayed in banks of 8. If a channel does not have a value, when the preset is recalled, the value of that channel will no be changed from its current value (which will have been set by another preset, or be the default value of 0).

## Sampling Mode

To speed up the creation of lighting presets, Paradise provides a sampling mode. Using a lighting console that outputs sACN, you can setup output from that console and then Paradise will scan them (for the time [set in config](../config#sacn)) to record the levels across up to 20 sACN universes, and save each universe as a sampled preset which you can then edit as any other preset. 16bit addresses are supported by sampling mode, but not intended for edit via the admin user interface - these are common in moving lights.

## Priority 

It is important to consider the sACN priority set on Paradise - normally this will be lower than another console that outputs sACN, such that Paradise can't override that console's output. If you are not seeing output on your network, set the priority to a higher value.