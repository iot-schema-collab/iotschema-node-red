"use strict";
let coap = require('coap');
let request = require('request');

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

let serviceCallHttp = function (node, flowRequestOpts) {

    request(flowRequestOpts, function (error, response, body) {
        node.status({});

        if(response !== undefined){
            let status = response.statusCode.toString();

            if (error || status === '500' || status === '404' || status === '401' || status === '403') {
                node.log('Response error');
                node.status({
                    fill:"orange",
                    shape:"ring",
                    text:"Response error"
                });

            } else {
                node.send({payload:response.body});
            }
        }
        else {
            node.log('Response error');
            node.status({
                fill:"orange",
                shape:"ring",
                text:"Response error"
            });

        }
    });
};

let serviceCallCOAP = function(node, requestInfo, payload){
    let source1 = "";

    let req1 = coap.request(requestInfo);
    if(payload !== undefined){
        req1.write(JSON.stringify(payload));
    }
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

module.exports = function(RED) {

    function Tank101OverflowStatus(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        node.status({});

        //Validating provided method for service request
        if(!config.method) {
            node.status({
                fill:"orange",
                shape:"ring",
                text:"Not deployed due to undefined method"
            })
        }
        else if(config.method === "GET" && !config.interval) {
            node.status({
                fill:"orange",
                shape:"ring",
                text:"Not deployed due to undefined interval"
            });
        }
        else if(config.method === "GET" && !isNumeric(config.interval)) {
            node.status({
                fill:"orange",
                shape:"ring",
                text:"Not deployed due to invalid interval"
            });
        }
        else  if (config.method === "GET"){
            this.interval_id = null;

                var auth = "Basic " + Buffer.from(config.username + ':' + config.password).toString('base64');
                let requestOpts = {
                    method: config.method,
                    url: "https://129.150.200.242/iot/api/v2/apps/AA5D2D11-C12B-46C7-897F-62A3060F527C/devices/687E0F51-D32D-4D26-B0E5-250395B6A1A2/deviceModels/urn%3Acom%3Asiemens%3Awot%3Afesto/attributes/Tank101OverflowStatus",
                    encoding: null,
		    json: true,
                    headers:{
                        "Authorization" : auth
                    }
                };
                this.interval_id = setInterval(function() { serviceCallHttp(node, requestOpts); }, config.interval * 1000);
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                serviceCallHttp(node, requestOpts);

                 this.on("close", function() {
                    if (this.interval_id != null) {
                        clearInterval(this.interval_id);
                        }
                    });
                }


                            
                        }

                        RED.nodes.registerType("Tank101OverflowStatus", Tank101OverflowStatus);
                    };
