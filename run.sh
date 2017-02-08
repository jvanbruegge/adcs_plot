#!/bin/bash

eval $(dbus-launch --sh-syntax)

killall adcsDaemon
/root/adcs_daemon/build/adcsDaemon &

sleep 1

( while [ 1 -lt 2 ]; do
    busctl --user call moveii.adcs /moveii/adcs moveii.adcs getBeaconData \
    | /root/adcs_daemon/build/adcstool
done ) \
| node index.js
