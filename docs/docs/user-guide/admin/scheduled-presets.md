---
sidebar_position: 30
title: Scheduled Presets
---

The Scheduled Presets page allows you to define times of the day when presets are triggered automatically. 

To start, use the plus button to add a new schedule. Next, select the days of the week you'd like the schedule to run on, and the time to run during those days. Finally, select the preset you'd like to run at that time, and click save.

To trigger a preset at multiple times during the day, simply add multiple schedules for that preset.

![scheduled presets page](@site/static/img/tutorial/admin/admin-scheduled-presets.png)

The cog icon on the right side of each preset allows you to edit the advanced settings for that preset.

![scheduled presets cog page](@site/static/img/tutorial/admin/admin-scheduled-presets-cog.png)

The advanced settings allow you to set the following:

 - Notes: A description of why the schedule exists as a reminder in the administrator menu - this can help you differentiate between large numbers of schedules.
 - Enabled: whether the schedule is enabled or not. If disabled, the schedule will not run.
 - Run when locked: if the control panel is locked, the schedule will still run if this is enabled.
 - Timeout: how many minutes to keep trying to trigger the preset for. If the preset is not triggered within this time, the schedule will be skipped for that day. This is particularly relevant if ParadisePi is powered off at the time the schedule is due to run, and later powered on - if the timeout plus the scheduled time is earlier than the time ParadisePi boots, then it will be skipped.