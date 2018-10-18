function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = function(RED) {

"use strict";
let coap = require('coap');

function Thermostat(config) {
    RED.nodes.createNode(this, config);
    let node = this;
    node.status({});

    // Validating provided method for service request
    if(!config.method) {
        node.status({
            fill:"orange",
            shape:"ring",
            text:"Not deployed due to undefined method"
        })
    }
    else{

        node.on('input', function(msg) {
            let source = "";
            let output;
            // Validating request method
            if(!config.method) {
                node.status({
                    fill:"orange",
                    shape:"ring",
                    text:"Not deployed due to undefined method"
                });
            }

            let requestInfo = {hostname: "localhost", pathname : "thermostat", method : config.method};
            let req = coap.request(requestInfo);
            if(config.method === "POST" || config.method === "PUT"){
                req.write(msg.payload.value);
            }
            req.on('error', function(err) {
                node.log('Error occurred while sending request '+ err.toString());
                node.status({
                    fill:"orange",
                    shape:"red",
                    text:"Error occurred " + err.toString()
                });
            });
            req.on('response', function(res) {
                try {
                    source = res.read().toString();
                    node.send(source);
                }catch(err){
                    node.log(err.toString());
                    node.status({
                        fill:"red",
                        shape:"ring",
                        text: err.toString()
                    });
                }
                res.on('end', function() {
                });
            });
        req.end();
     });

    
    }
}

RED.nodes.registerType("Thermostat", Thermostat);
}
