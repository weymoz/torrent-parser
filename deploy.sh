tar czf parser.tar.gz \
  server \
  logger \
  vendor\
  package.json \
  package-lock.json \
  ecosystem.config.js \
  config.js \

scp parser.tar.gz hetz:~
rm -rf parser.tar.gz

ssh hetz << 'ENDSSH'
PATH="/home/alul/.nvm/versions/node/v10.16.0/bin:$PATH"
pm2 stop parser-server
rm -rf parser

mkdir parser
tar xf parser.tar.gz -C parser
rm parser.tar.gz

cd parser
npm install

mkdir \
archives contactsheets downloads links screenshots torrents videos

echo $MODE "mode"
pm2 start ecosystem.config.js --env production
ENDSSH



 
