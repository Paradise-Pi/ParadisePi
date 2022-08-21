---
sidebar_position: 2
title: sACN (e1.31)
---

sACN presets are for Lighing control. sACN is based on universes, so each preset needs to be assigned a universe using the edit popup.

![sACN editing](@site/static/img/tutorial/admin/admin-preset-sacn.png)

The 512 channels of a univers are displayed in banks of 8. If a channel does not have a value, when the preset is recalled, the value of that channel will _not_ be changed.

If there is invalid data in the preset, the JSON editor will be displayed instead.

## Sampling Mode

---

To speed up the creation of lighting presets, Paradise Pi provides a sampling mode. Using another Lighting console, you can create states and then broadcast them using the sACN protocol. Paradise Pi will scan for the time [set in config](../config#sacn) to record levels across 20 sACN universes, and save each universe as a sampled preset which you can then edit as any other preset.

### Limitations

- Sampling mode is limited to universes 1-20, due to memory constraints.
- 16bit addresses are supported by sampling mode, but not intended for edit via the admin user interface.
