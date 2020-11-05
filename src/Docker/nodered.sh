#!/bin/bash
node-red &
sleep 5
pkill node-red
echo Created .node-red folder.