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
const htmlTemplate = "node.html";

let templates = [htmlTemplate, packageTemplate, jsTemplate];

let properties = thingsDescriptionStructure["properties"];
let actions = thingsDescriptionStructure["actions"];

handlebars.registerHelper("is_equal", function (prop1, prop2, options) {
    if (prop2 === prop1) {
        return options.fn(this);
    }
    else {
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
for (let i in dm.properties){
    let node_name = dm.properties[i].node_name;
    let generated_node = "GeneratedNodes/" + node_name;

    //Creating package for the node
    if (fs.existsSync(generated_node)) {
        rimraf.sync(generated_node);
    }
    fs.mkdirSync(generated_node, '0777');

    for (let tmplt in templates) {
        const tpl = handlebars.compile(fs.readFileSync("templates/" + templates[tmplt] + ".hbs").toString('utf-8'));
        let fileName = templates[tmplt];
        if (templates[tmplt].split('.')[0] === 'node') {
            fileName = node_name + "." + templates[tmplt].split('.')[1];
        }
        fs.writeFileSync(generated_node + "/" + fileName, tpl(dm.properties[i]));
    }
}

//Generating nodes for actions
for (let i in dm.actions){
    let node_name = dm.actions[i].node_name;
    let generated_node = "GeneratedNodes/" + node_name;
    //Creating package for the node
    if (fs.existsSync(generated_node)) {
        rimraf.sync(generated_node);
    }
    fs.mkdirSync(generated_node, '0777');

    for (let tmplt in templates) {
        const tpl = handlebars.compile(fs.readFileSync("templates/" + templates[tmplt] + ".hbs").toString('utf-8'));
        let fileName = templates[tmplt];
        if (templates[tmplt].split('.')[0] === 'node') {
            fileName = node_name + "." + templates[tmplt].split('.')[1];
        }
        fs.writeFileSync(generated_node + "/" + fileName, tpl(dm.actions[i]));
    }
}
