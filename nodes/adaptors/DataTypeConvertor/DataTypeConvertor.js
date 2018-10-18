"use strict";

let request = require('request');

module.exports = function (RED) {
    function convert(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        let msg = {};
    
    	node.on('input', function(msg) {
                
		let value = Number(msg.payload.value);
		if(config.outputType === "float"){
			let res = msg.payload.value.split(".");     
	        	if(res.length == 1 || res[1].length < 3) { 
        			value = value.toFixed(2);
    			}
			
			node.send({payload:{"value":value.toString()}});
                }
		else if(config.outputType === "int"){
			value = Math.round(value);
			
			node.send({payload:{"value":value.toString()}});
		}  
		else{
			
			node.send({payload:{"value":value.toString()}});
                }
	});
    }
    RED.nodes.registerType("DataTypeConvertor", convert, {});
};
