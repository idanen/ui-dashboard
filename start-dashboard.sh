#!/bin/bash
pm2 kill
cd /opt/ui-dashboard
pm2 start ./server/StartServer.js
