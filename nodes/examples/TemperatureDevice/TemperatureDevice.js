function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = function(RED) {

"use strict";
let coap = require('coap');

function TemperatureDevice(config) {
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
         // Validating interval
         if(!config.interval) {
            node.status({
                fill:"orange",
                shape:"ring",
                text:"Not deployed due to undefined interval"
            });
         }
         else if(!isNumeric(config.interval)) {
            node.status({
            fill:"orange",
            shape:"ring",
            text:"Not deployed due to invalid interval"
            });
         }
         else {
             this.interval_id = null;
             let getLevel = function(){
                let source1 = "";
                let output1;
                let requestInfo = {hostname: "localhost", pathname : "temperature", method : config.method};
                let req1 = coap.request(requestInfo);
                req1.on('error', function(err) {
                    node.log('Error occurred while sending request '+ err.toString());
                    node.status({
                        fill:"orange",
                        shape:"red",
                        text:"Error occurred " + err.toString()
                    });
                });
                req1.on('response', function(res) {
                    try {
                        source1 = res.read().toString();
		
                        node.send({payload:source1});
                    }catch(err){
                        node.log(err.toString());
                        node.status({
                            fill:"red",
                            shape:"ring",
                            text: err.toString()
                        });
                    }
                    res.on('end', function() {});
                });
                req1.end();
             };

             this.interval_id = setInterval(function() { getLevel(); }, config.interval * 1000);
             getLevel();

             this.on("close", function() {
                if (this.interval_id != null) {
                    clearInterval(this.interval_id);
                }
             });
         }
            
    }
}

RED.nodes.registerType("TemperatureDevice", TemperatureDevice);
}
