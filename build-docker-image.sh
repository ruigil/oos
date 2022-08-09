#!/bin/bash 
echo "Building OOS docker image..."

cd client
npm install
npm run dist
cd ../server
npm install
npm run dist
cd ..

docker build -t oceanos/oos:latest .

echo "Done."