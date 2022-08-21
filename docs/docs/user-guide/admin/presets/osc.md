---
sidebar_position: 3
title: OSC
---

OSC presets allow you to send OSC messages a device on your network. Every OSC-supported device handled OSC in a slightly different way, including what commands are supported by that device. Therefore there are a limited number of devices supported at this time - see [osc setup](../config#osc) for more information.

An OSC preset can contain multiple OSC calls, so can control many parameters at once.
An OSC call is made up of up to 2 parts in Paradise Pi, some of which may have values associated with them. An editing interface is provided for known OSC calls, and you can create your own OSC calls by using the JSON editor.

![OSC editing](@site/static/img/tutorial/admin/admin-preset-osc.png)

## Known OSC commands

---

### Part 1 commands

| Command         | Has Value | Which Console?     | Part 2 Group              | Purpose                     |
| --------------- | --------- | ------------------ | ------------------------- | --------------------------- |
| Channel         | Yes       | All Current        | [Channel](#channel-group) | Control individual channels |
| Mute Group      | Yes       | All Current        | [Basic](#basic-group)     | Control Mute Groups         |
| Master          | No        | All Current        | [Basic](#basic-group)     | Control Master Fader        |
| Console Actions | No        | X Series, M Series | [Action](#action-group)   | Recall various states       |
| Snapshots       | No        | X AIR, MR          | [Snap](#snap-group)       | Recall Snapshots            |

### Part 2 commands

Part 2 commands are split into groups, and will be shown based on the value of the Part 2 Group field in the above table.

#### Basic group

| Command | Has Value | Value Range          |
| ------- | --------- | -------------------- |
| Mute    | Yes       | 0 (Mute), 1 (Unmute) |
| Level   | Yes       | 0.0-1.0 (0.01 step)  |

#### Channel group

| Command | Has Value | Value Range          |
| ------- | --------- | -------------------- |
| Mute    | Yes       | 0 (Mute), 1 (Unmute) |
| Level   | Yes       | 0.0-1.0 (0.01 step)  |
| Pan     | Yes       | 0.0-1.0 (0.01 step)  |
| Gain    | Yes       | 0.0-1.0 (0.01 step)  |
| +48v    | Yes       | 0 (Off), 1 (On)      |

#### Snap group

| Command | Has Value | Value Range |
| ------- | --------- | ----------- |
| Load    | Yes       | 0-64        |

#### Action Group

| Command      | Has Value | Value Range |
| ------------ | --------- | ----------- |
| Load Cue     | Yes       | 0-99        |
| Load Scene   | Yes       | 0-99        |
| Load Snippet | Yes       | 0-99        |
