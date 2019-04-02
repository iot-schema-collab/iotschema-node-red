"use strict";
const fs = require('fs');
const utils = require('./utils');
const rimraf = require('rimraf');
const handlebars = require('handlebars');
const exec = require('child-process-promise').exec;
const args = require('yargs').argv;

let thingsDescriptionContent = fs.readFileSync("resources/" + args.file.split("/")[1], 'utf-8');

let thingsDescriptionStructure = JSON.parse(thingsDescriptionContent);

const packageTemplate = "package.json";
const jsTemplate = "node.js";
const htmlTemplate_prop = "node_prop.html";
const htmlTemplate_action = "node_action.html";

let property_templates = [htmlTemplate_prop, packageTemplate, jsTemplate];
let action_templates = [htmlTemplate_action, packageTemplate, jsTemplate];

handlebars.registerHelper("is_equal", function (prop1, prop2, options) {
    if (prop2 === prop1) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

handlebars.registerHelper("is_not_equal", function (prop1, prop2, options) {
    if (prop2 !== prop1) {
        return options.fn(this);
    }
});

let dm = utils.createDataModel(thingsDescriptionStructure);

//Generating nodes for properties
for (let i in dm.properties) {
    let node_name = dm.properties[i].node_name;
    let node_name_extension = dm.properties[i].node_name_extension;
    let generated_node = "GeneratedNodes/" + node_name;

    //Creating package for the node
    if (!(fs.existsSync(generated_node))) {
        fs.mkdirSync(generated_node, '0777');
    }


    for (let tmplt in property_templates) {
        const tpl = handlebars.compile(fs.readFileSync("templates/" + property_templates[tmplt] + ".hbs").toString('utf-8'));
        let fileName = property_templates[tmplt];
        if (property_templates[tmplt].split('.')[0] === 'node' || property_templates[tmplt].split('.')[0] === 'node_prop') {
            fileName = node_name_extension + "." + property_templates[tmplt].split('.')[1];
        }
        if (!(fs.existsSync("GeneratedNodes/" + node_name + "/package.json"))) {

            fs.writeFileSync(generated_node + "/" + fileName, tpl(dm.properties[i]));
        } else if (tmplt == 1) {
            let packageVirgin = JSON.parse(fs.readFileSync("GeneratedNodes/" + node_name + "/package.json", 'utf-8')); //read in the package.json file
            packageVirgin["node-red"].nodes[node_name_extension] = node_name_extension + ".js"; //extend it by a new key-value pair
            fs.writeFileSync(generated_node + "/" + fileName, JSON.stringify(packageVirgin, null, 1)); //overwrite existing package.json
        } else {
            fs.writeFileSync(generated_node + "/" + fileName, tpl(dm.properties[i]));
        }
    }
}

//Generating nodes for actions
for (let i in dm.actions) {
    let node_name = dm.actions[i].node_name;
    let node_name_extension = dm.actions[i].node_name_extension;
    let generated_node = "GeneratedNodes/" + node_name;
    //Creating package for the node
    if (!(fs.existsSync(generated_node))) {
        fs.mkdirSync(generated_node, '0777');
    }


    for (let tmplt in action_templates) {
        const tpl = handlebars.compile(fs.readFileSync("templates/" + action_templates[tmplt] + ".hbs").toString('utf-8'));
        let fileName = action_templates[tmplt];
        if (action_templates[tmplt].split('.')[0] === 'node' || action_templates[tmplt].split('.')[0] === 'node_action') {
            fileName = node_name_extension + "." + action_templates[tmplt].split('.')[1];
        }
        if (!(fs.existsSync("GeneratedNodes/" + node_name + "/package.json"))) {

            fs.writeFileSync(generated_node + "/" + fileName, tpl(dm.actions[i]));
        } else if (tmplt == 1) {
            let packageVirgin = JSON.parse(fs.readFileSync("GeneratedNodes/" + node_name + "/package.json", 'utf-8')); //read in the package.json file
            packageVirgin["node-red"].nodes[node_name_extension] = node_name_extension + ".js"; //extend it by a new key-value pair
            fs.writeFileSync(generated_node + "/" + fileName, JSON.stringify(packageVirgin, null, 1)); //overwrite existing package.json
        } else {
            fs.writeFileSync(generated_node + "/" + fileName, tpl(dm.actions[i]));
        }

    }
}