#!/bin/bash 

echo "Waiting for x server"

while [ ! -e /tmp/.X11-unix/X${DISPLAY#*:} ]; do sleep 0.5; done

echo "Starting electron"

./paradisepi-linux-arm64/paradisepi