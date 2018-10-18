# iotschema-node-red
iot.schema.org interactions implemented as Node-RED Nodes.

![iotschema-node-red: iot.schema.org interactions implemented as Node-RED Nodes.](https://github.com/iot-schema-collab/iotschema-node-red/blob/master/images/Temperature%20Control%20Recipe.PNG)

## Quick Start
1. Install Node-RED:
```
sudo npm install -g --unsafe-perm node-red
```

2. Install iot.schema.org Node-RED Nodes:
```
cd $NODE_RED_HOME
```

3. Install adaptor Node-RED Nodes:
```
npm install iotschema-node-red/nodes/adaptors/*
```

4. Install Node-RED Nodes to run the Temperature Control example:
```
npm install iotschema-node-red/nodes/examples/*
npm install node-red-contrib-coap
```

## Running Example

This flow (Recipe) controls ambient air temperature, by using iot.schema.org TemperatureSensing and Thermostat Capabilities.

1. Start Node-RED:
```
node-red
```

2. Copy the content of TemperatureControl.json from:
```
cd iotschema-node-red/lib/examples/
```
to your clipboard

3. Open Node-RED in Browser and import the flow: 
Open <http://localhost:1880>
Menu > Import > Clipboard

4. Deploy the flow, and see the result in system console.

For details about the running example, see the [documentation](https://github.com/iot-schema-collab/iotschema-node-red/blob/master/example-doc.md).

