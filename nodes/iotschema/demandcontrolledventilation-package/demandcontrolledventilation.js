"use strict";

let configInt = require('./ConfigAttrIntegrator.js');

module.exports = function(RED) {
    function demandcontrolledventilation(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        let source;
        let output;
        let fs = require('fs');
        let path = require('path');
        let shapePath = path.join(__dirname,"demandcontrolledventilation.jsonld");

        

        fs.readFile(shapePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            source = JSON.parse(data);
            let configJ = {};
            configJ["configParams"] = {};
            configJ["configParams"]["name"] = config.name;
            configJ["configParams"]["InteractionPatternType"] = config.iptype;
            configJ["configParams"]["capability"] = config.capability;
            configJ["configParams"]["FeatureOfInterestType"] = config.foitype;
            configJ["configParams"]["FeatureOfInterest"] = config.foi;
                        configJ["configParams"]["operation"] = config.operation;
            output = configInt.addConfigAttributes(source, configJ);
            let graph = [];
            graph = configInt.removeDuplicates(output["@graph"]);
            delete output["@graph"];
            output["@graph"] = [];
            output["@graph"] = graph;
            node.send([{payload:output},null]);
        }
        else {
            console.log(err);
        }
    });

    node.on('input', function(msg) {
        node.send([null,{payload:msg}]);
    });
}

    RED.nodes.registerType("demandcontrolledventilation", demandcontrolledventilation);
};
