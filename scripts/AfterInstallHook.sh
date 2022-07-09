#!/bin/bash
source /home/ec2-user/.bash_profile
set -e
cd /sma
npm install
npm run build
