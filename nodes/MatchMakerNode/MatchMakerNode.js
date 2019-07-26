const cmd = require('node-cmd');

module.exports = function (RED) {
    "use strict";

    function MatchMakerNode(n) {
        RED.nodes.createNode(this, n);
    }

    RED.nodes.registerType("MatchMakerNode", MatchMakerNode, {
    });

    RED.httpAdmin.get('/MatchMakerNode/js/*', function (req, res) {
        var options = {
            root: __dirname + '/lib/',
            dotfiles: 'deny'
        };
        res.sendFile(req.params[0], options);
    });

    RED.httpAdmin.get("/checkStatus", RED.auth.needsPermission('MatchMakerNode.read'), function (req, res) {
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