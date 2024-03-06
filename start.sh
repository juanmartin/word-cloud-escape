#!/bin/bash

cd backend
pm2 start server.js --name word-cloud-escape
DISPLAY=:0 firefox --kiosk http://localhost:3000
