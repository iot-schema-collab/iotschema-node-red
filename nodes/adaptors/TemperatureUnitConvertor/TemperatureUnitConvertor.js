"use strict";

let request = require('request');

module.exports = function (RED) {
    function convert(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        let msg = {};
    
    	node.on('input', function(msg) {
                
		let value = Number(msg.payload.value);
		if(config.inputType === "celsius" && config.outputType === "kelvin"){
			  
			node.send({"value":value + 273.15});
                }
		else if(config.inputType === "kelvin" && config.outputType === "celsius"){
			node.send({"value":value - 273.15});
		}  
		else if(config.inputType === "celsius" && config.outputType === "fahrenheit"){
			node.send({"value":value*1.8 +32});
		}  
		else if(config.inputType === "fahrenheit" && config.outputType === "celsius"){
			node.send({"value":(value-32)/1.8});
		}  
		else if(config.inputType === "fahrenheit" && config.outputType === "kelvin"){
			node.send({payload:{"value":(value-32)/1.8 + 273.15}});
		} 
		else if(config.inputType === "kelvin" && config.outputType === "fahrenheit"){
			node.send({payload:{"value":(value-273.15)*1.8 + 32}});
		}  
	});
    }
    RED.nodes.registerType("TemperatureUnitConvertor", convert, {});
};
