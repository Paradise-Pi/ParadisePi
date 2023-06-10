---
sidebar_position: 5
title: Macro
---

Macros are special presets that can be used to trigger more than one preset at once. Each macro preset can recall one or more other presets, of any type - including other macro presets.

These can be used to trigger presets in multiple folders (such as lighting and sound) - such as turning everything off. They can also be used to show one preset in multiple folders. 

Macro presets can also be used to open certain pages, including the custom [Keypad](../../control/keypad) and [Channel Check](../../control/chan-check) pages for sACN. This function of opening pages does not work if the macro is triggered via a HTTP call. 

Macro presets can also be used to change the configuration of the system - such as locking/unlocking the control panel. This is useful for locking/unlocking the control panel over HTTP. Unlocking the control panel with a macro can only be performed over HTTP, as the control panel will be locked when the macro would be triggered.

![Macro editing](@site/static/img/tutorial/admin/admin-preset-macro.png)

Macros themselves can be triggered by other macros, allowing you to create complex sequences of presets. They can also be triggered by time events, allowing you to schedule macros to run at certain times (for example to turn off a system at night time).