#!/bin/bash
source /home/ec2-user
set -e
cd /sma
npm install
npm run build
