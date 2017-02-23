#!/bin/bash

( while [ 1 -lt 2 ]; do
    busctl call moveii.adcs /moveii/adcs moveii.adcs getBeaconData \
    | adcstool -l --panels main
    sleep 0.1
done ) \
| node server/index.js
