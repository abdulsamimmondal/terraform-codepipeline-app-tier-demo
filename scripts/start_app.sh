#!/bin/bash

# Set NVM_DIR explicitly to /home/ec2-user/.nvm and source nvm.sh
export NVM_DIR="/home/ec2-user/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 

cd ~/app-tier
pm2 start index.js
pm2 save



