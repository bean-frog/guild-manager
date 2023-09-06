@echo off

start "bot " cmd /k "title TOM v2 Log && node index.js"
start "github manager" cmd /k "title Github Manager Log && cd ghmanager && node index.js"
