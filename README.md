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

4. Install Node-RED Nodes to run the Temperature Control example (Running Example 1):
```
npm install iotschema-node-red/nodes/examples/*
npm install node-red-contrib-coap
```

5. Install Node-RED Node to generate a W3C Web of Things (WoT) Thing Description:
```
npm install iotschema-node-red/nodes/TDGenerator
```

6. Install Node-RED Node for W3C Web of Things (WoT) Thing Directory to store Thing Description:
```
npm install iotschema-node-red/nodes/TDConfigureNode
```
See Running Example 2 to learn more about how to use "TDGenerator" and "TDconfigureNode" Nodes to generate and store a Thing Description.

## Running Example 1

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
```
Open <http://localhost:1880>
Menu > Import > Clipboard
```

4. Deploy the flow, and see the result in system console.

For details about the running example, see the [documentation](https://github.com/iot-schema-collab/iotschema-node-red/blob/master/example-doc.md).

## Running Example 2

This flow (Thing Description Generation) generates a W3C WoT Thing Description for the Temperature device by using iot.schema.org TemperatureSensing Capability and TDGenerator node.  Then it stores the generated TD in Thing Directory using Thing Directory config node in Node-RED.

1. Start Node-RED:
```
node-red
```

2. Copy the content of TemperatureTDGeneration.json from:
```
cd iotschema-node-red/lib/examples/
```
to your clipboard

3. Open Node-RED in Browser and import the flow: 
```
Open <http://localhost:1880>
Menu > Import > Clipboard
```

4. Deploy the flow. "TDGenerator" node generates semantically enriched Thing Description for Temperature device using iotschema TemperatureSensing capability. 

5. Open the Thing Directory configuration node (as shown in the Figure:https://github.com/iot-schema-collab/iotschema-node-red/blob/master/images/TemperatureTDGeneration.PNG)

6. Start Thing Directory (by clicking "Start" button), store Thing Description by selecting (Store TD/ Recipe option)

7. Click on "Store/Retrieve" button to store the Thing Description in Thing Directory.
  
