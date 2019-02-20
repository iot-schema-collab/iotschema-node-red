const exec = require('child-process-promise').exec;
const cmd = require('node-cmd');
const http = require('http');
const formidable = require('formidable');
const fs = require('fs-extra');
const path = require('path');
const artefactPath = path.join(__dirname, "artefacts/thingweb-repository-0.7.jar");
var request = require('request');
const { base64encode, base64decode } = require('nodejs-base64');

module.exports = function (RED) {
    "use strict";
    function TDConfigureNode(n) {
        RED.nodes.createNode(this, n);
    }

    RED.nodes.registerType("TDConfigureNode", TDConfigureNode, {
    });

    RED.httpAdmin.get('/TDConfigureNode/js/*', function (req, res) {
        var options = {
            root: __dirname + '/lib/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });

    RED.httpAdmin.post("/deployArtifact", RED.auth.needsPermission('TDConfigureNode.read'), function (req, res) {
        console.log("got deploy call")
        //Do not remove the following code. Keep it for future reference for custom artefact upload
//        var form = new formidable.IncomingForm();
//        form.parse(req, function (err, fields, files) {
//            cmd.get(
//                    'java -jar ' + files.filetoupload.path,
//                    function (err, data, stderr) {
//                        if (err) {
//                            res.json(err);
//                        } else {
//                            res.json(data);
//                        }
//                    });
//        });

        cmd.get(
                'java -jar ' + artefactPath,
                function (err, data, stderr) {
                    if (err) {
                        console.log(err)
                        res.json(err);
                    } else {
                        console.log("not error")
                        res.json(data);
                    }
                });
    });

    RED.httpAdmin.get("/stopArtifact", RED.auth.needsPermission('TDConfigureNode.read'), function (req, res) {
        cmd.get(
                'fuser -k 8080/tcp',
                function (err, data, stderr) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(data);
                    }
                });
    });

    RED.httpAdmin.get("/checkStatus", RED.auth.needsPermission('TDConfigureNode.read'), function (req, res) {
        cmd.get(
                'ss -tulpn | grep :8080',
                function (err, data, stderr) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(data);
                    }
                });
    });
};
