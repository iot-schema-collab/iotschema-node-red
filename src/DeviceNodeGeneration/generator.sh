npm install
rm -rf ~/.node-red/package-lock.json
rm -rf GeneratedNodes/*

for file in resources/*; do
    node  DeviceNodeGen.js --file=$file
    sleep 2
done
mkdir -p ~/.node-red/DeviceNodes
for d in GeneratedNodes ; do
    cp -R $d ~/.node-red/DeviceNodes/
done
npm install --prefix ~/.node-red ~/.node-red/DeviceNodes/GeneratedNodes/*
