## Changelog

Please describe the changes

## Checklist

- [ ] I have added documentation for new/changed functionality in this PR
- [ ] All active GitHub checks for tests, formatting, and security are passing
- [ ] The correct base branch is being used, if not `main`

## Test Checklist 

### Basics

- [ ] Boots with a pre-existing database from the previous release, uploaded using the interface
- [ ] Boots without a database, successfully creating its own 
- [ ] Reboots when reboot clicked
- [ ] Quits when quit clicked

### Presets/Faders/Folders

- [ ] Presets/Faders/Folders can be added
- [ ] Presets/Faders/Folders can be removed
- [ ] Presets/Faders/Folders can be renamed, and this is reflected on the control panel
- [ ] Presets/Folders can be disabled, and they are hidden from the control panel
- [ ] Presets/Faders/Folders can be enabled, and they are shown in the control panel
- [ ] Preset/Folders colors can be changed, and this is shown in the control panel
- [ ] Preset/Faders/Folders sort order is maintained

### Preset Types

#### sACN

- [ ] sACN can be enabled/disabled
- [ ] sACN data is output successfully

#### OSC

- [ ] OSC can be enabled/disabled
- [ ] OSC data is output successfully
- [ ] X32 Faders are functional

#### HTTP

- [ ] HTTP requests are made successfully

#### Macros

- [ ] Macros are triggered successfully
- [ ] Macros can trigger other macros
- [ ] Scheduled macros trigger at required times 

