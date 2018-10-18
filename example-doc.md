# Temperature Control Example

This example shows how to use iot.schema.org Nodes in order to make an exisitng Thing's data conform with the semantics of iot.schema.org. Further on, the iot.schema.org Nodes are used to wire an IoT application. 

![iotschema-node-red: iotschema interactions implemented as Node-RED Nodes.](images/Temperature Control Recipe.png)

## Thing Nodes

Exisitng Thing's input or output data is represented by a Thing Node (depicted in light green color). For example, Temp Device Node provides data from an existing temperature sensor. Thermostat Node takes the target temperature as input and sets a thermostat.

## iot.schema.org Nodes

iot.schema.org specifications are represented by iot.schema.org Nodes (depicted in petrol blue). For example, the `temperature` Node represents [Temperature](http://iotschema.org/Temperature) Interaction Pattern in iot.schema.org. The Node enables you to configure an exisitng Thing's data with iot.schema.org semantics, e.g., to provide a data range, unit of measurement, feature of interest etc. Similarly, the `targettemperature` Node represents [TargetTemperature](http://iotschema.org/TargetTemperature) Interaction Pattern and enables the configuration of a thermostat.

Conformance with the iot.schema.org semantics enbales exisitng Thing's data to be discovered. Further on, IoT applications (Node-RED Flows) can also be discovered based on the iot.schema.org mark-ups, e.g., give me all Flows that contain `temperature` Node. Overall this approach enables efficient and semantically consistent way of creating IoT applications.

## Adaptor Nodes

An iot.schema.org Node offer users to configure an Interation Pattern in accordance to application's requirements. For example, in an IoT application we need temperature data to be delivered as a float, in degree Celsius. If a Thing provides temperature data differently, then adaptor Nodes can be used (depicted in orange). 