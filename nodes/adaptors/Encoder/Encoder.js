"use strict";

let request = require('request');

module.exports = function (RED) {
    function encode(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        let msg = {};
    
    	node.on('input', function(msg) {
         
		
                node.send({payload:JSON.parse(msg.payload)});	
	});
    }
    RED.nodes.registerType("Encoder", encode, {});
};
