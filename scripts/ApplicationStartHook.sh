source /home/ec2-user/.bash_profile
export NVM_DIR="/home/ec2-user/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd /sma
pm2 delete all
PORT=80 pm2 start build/src/index.js 
