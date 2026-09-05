#!/bin/bash
cd /Users/jayesh/Documents/RoomRoot
nohup node_modules/.bin/vite --port 3000 --host < /dev/null > .freebuff/preview-9b3f9df5-b46b-4e60-8d38-436e23baaa16.log 2>&1 &
echo $! > .freebuff/server.pid
