#!/bin/bash 
echo "Building OOS docker image..."

cd client
npm install
npm run dist
cd ../server
npm install
npm run dist
cd ..

docker build -t oos .

echo "Done."