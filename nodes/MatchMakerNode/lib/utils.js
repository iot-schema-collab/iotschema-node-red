const noderedFlowAPIURL = location.protocol + "//" + location.hostname + ":" + location.port + "/flows";

function discoverMatches() {
    let flowId;
    let subFlowIds = [];
    let recipe = {};
    let nodes = [];
    let ids = [];
    let flowNodeIds = [];
    let iotIpNodes = [];


    function render(matches) {
        let staticContent = '<div id="Configurations">';
        staticContent = staticContent.concat('<div style="margin-top:50px;margin-left: 20px">');
        staticContent = staticContent.concat('<label for="directory">Thing Directory URL:</label>');
        staticContent = staticContent.concat('<input type="text" name="directory" id="directoryURL" value="http://127.0.0.1:8080">');
        staticContent = staticContent.concat('<button type="button" onClick="discoverMatches()">Discover</button>');
        staticContent = staticContent.concat('<label id="TDURLStatus"></label>');
        staticContent = staticContent.concat('</div></div>');

        let rendered = '';

        if (Object.keys(matches).length === 0) {
            staticContent = staticContent.concat('<br/><label><font color="red">Error while connecting to server</font></label><br/>');
            $('#MatchMakingResults').replaceWith("<div id='MatchMakingResults'></div>");
        } else {

            rendered = rendered.concat('<div id="MatchMakingResults" style="margin-top:30px;margin-left: 20px">');
            rendered = rendered.concat('<label style="font-weight: bold">Results</label>');

            var devices = '';
            for (var key in matches) {
                devices += key + ",";
            }

            //removing last comma
            devices = devices.substring(0, devices.length - 1);
            let createEnable = '';

            for (let key in matches) {

                rendered = rendered.concat('<div style="white-space:nowrap">');
                rendered = rendered.concat('<label for="name">' + key + ':</label>');

                if (matches[key].length === 0) {
                    rendered = rendered.concat('<label><font color="red">No matches found</font></label><br/>');
                    createEnable = 'disabled';
                } else {
                    rendered = rendered.concat("<select id=\'" + key + "\' style='width: 180px;'>");

                    for (let device in matches[key]) {
                        rendered = rendered.concat("<option value=\"" + matches[key][device] + "\">" + matches[key][device] + "</option>");
                    }
                    rendered = rendered.concat("</select></br>");
                }
                rendered = rendered.concat('</div>');
            }
            rendered = rendered.concat('<br/><label for="flowname">App Name:</label>');
            rendered = rendered.concat('<input type="text" name="flowname" id="flowname"/><br/>');
            rendered = rendered.concat('<button type="button" onClick="createFlow(\'' + devices + '\')"' + createEnable + '>Create</button>');
            rendered = rendered.concat('</div>');
        }
        $('#MatchMakingResults').replaceWith(rendered);
    }

    function renderDeployOption(flowId) {

        let rendered = '<div id="Configurations">';
        rendered = rendered.concat('<div style="margin-top:50px;margin-left: 20px">');
        rendered = rendered.concat('<label for="directory">Thing Directory URL:</label>');
        rendered = rendered.concat('<input type="text" name="directory" id="directoryURL" value="http://127.0.0.1:8080">');
        rendered = rendered.concat('<button type="button" id="discoverButton" onClick="discoverMatches(\'' + flowId + '\')">Discover</button>');
        rendered = rendered.concat('<br/>');
        rendered = rendered.concat('<label id="TDURLStatus"></label>');
        rendered = rendered.concat('<div id="ConfigStatus"></div>');
        rendered = rendered.concat('</div');
        rendered = rendered.concat('</div>');
        $('#MatchMakingResults').replaceWith("<div id='MatchMakingResults'></div>");
        return rendered;
    }

    function parseFlow(flowNodes) {

        for (var j in nodes) {
            //get flow id
            if ((JSON.stringify(nodes[j].type)).indexOf("subflow:") !== -1 && nodes[j].wires) {
                var index = (nodes[j].type).indexOf(":");
                var length = (nodes[j].type).length;
                var id = (nodes[j].type).substring(index + 1, length);
                subFlowIds.push(id);
                flowId = nodes[j].z;
            } else if (nodes[j].type === "tab") {
                flowId = nodes[j].id;
                break;
            }
        }
        if (flowId === undefined) {
            flowId = nodes[0].z;
        }
        for (var j in nodes) {
            var nodeInfo = {};
            //get ids of all nodes of a flow
            if ((nodes[j].z) === flowId && (nodes[j].type.indexOf("subflow:") <= -1)) {
                flowNodeIds.push(nodes[j].id);
                //get each node wiring information
                nodeInfo.id = nodes[j].id;
                if (nodes[j].name)
                    nodeInfo.name = nodes[j].name;
                if (nodes[j].iptype)
                    nodeInfo.type = nodes[j].type;
                if ((nodes[j].wires[0]) && (nodes[j].wires[0].length > 0) && !(nodes[j].wires[1] && nodes[j].wires[1]))
                    nodeInfo.outgoingNodes = processNode(nodes[j].wires[0]);
                else if (nodes[j].wires[0] && nodes[j].wires[0].length > 0 && nodes[j].wires[1] && nodes[j].wires[1].length > 0)
                    nodeInfo.incomingNodes = processNode(nodes[j].wires[0]);
                if (nodes[j].wires[1] && nodes[j].wires[1].length > 0)
                    nodeInfo.outgoingNodes = processNode(nodes[j].wires[1]);
                //get ids of all iot.schema.org interaction pattern nodes in a flow
                if ((nodes[j].capability) || (nodes[j].featureOfInterest) || (nodes[j].propertyType) || (nodes[j].iptype)) {
                    iotIpNodes.push(nodes[j]);
                    nodeInfo.nodeType = "iotIPNode";
                    nodeInfo = getIoTNodeAttr(nodeInfo, nodes[j]);
                } else {
                    nodeInfo.nodeType = "others";
                }
                flowNodes.push(nodeInfo);
            } else if ((nodes[j].z) === flowId && (nodes[j].type.indexOf("subflow:") > -1)) {
                getFlowNode(nodes[j]);
            }
            //flowNodes.push(nodeInfo);
        }
    }

    function getIoTNodeAttr(result, node) {
        if (node.operation)
            result.operation = node.operation;
        if (node.capability)
            result.capability = node.capability;
        if (node.iptype)
            result.ipType = node.iptype;
        if (node.foi)
            result.foi = node.foi;
        if (node.foiType)
            result.foiType = node.foiType;
        if (node.propertyType)
            result.propertyType = node.propertyType;
        if (node.minValue)
            result.minValue = node.minValue;
        if (node.maxValue)
            result.maxValue = node.maxValue;
        if (node.unitCode)
            result.unitCode = node.unitCode;
        if (node.propertyValues)
            result.propertyValues = node.propertyValues;
        return result;
    }

    function getFlowNode(node) {
        var index = (node.type).indexOf(":");
        var length = (node.type).length;
        var id = (node.type).substring(index + 1, length);
        var flowNode = {};

        for (var i in nodes) {
            if ((nodes[i].z === id) && (nodes[i].capability)) {
                flowNodeIds.push(nodes[i].id);
                flowNode.id = nodes[i].id;
                if (nodes[i].name)
                    flowNode.name = nodes[i].name;
                if (nodes[i].type)
                    flowNode.type = nodes[i].type;
                //get each node wiring information
                if (node.wires[0] && node.wires[0].length > 0)
                    flowNode.incomingNodes = processNode(node.wires[0]);
                if (node.wires[1] && node.wires[1].length > 0) {
                    var result = processNode(node.wires[1]);
                    flowNode.outgoingNodes = result;
                }
                //get ids of all iot.schema.org interaction pattern nodes in a flow
                iotIpNodes.push(nodes[i]);
                flowNode.nodeType = "iotIPNode";
                flowNode = getIoTNodeAttr(flowNode, nodes[i]);
            } else if (nodes[i].z === id) {
                flowNode.nodeType = "others";
            }
            flowNodes.push(flowNode);
        }
    }

    function processNode(idArray) {
        var result = [];
        var m;
        if (idArray.length === 0) {
            m = [];
            m.push(idArray);
        } else
            m = idArray;
        for (var i in m) {
            for (var j in nodes) {
                if (nodes[j].id === m[i]) {
                    if ((nodes[j].type).indexOf("subflow:") > -1) {
                        var index = (nodes[j].type).indexOf(":");
                        var length = (nodes[j].type).length;
                        var id = (nodes[j].type).substring(index + 1, length);
                        for (var k in nodes) {
                            if ((nodes[k].z === id) && (nodes[k].capability)) {
                                result.push(nodes[k].id);
                            }
                        }
                    } else {
                        result.push(m[i]);
                    }
                }
            }
        }
        return result;
    }

    function createRecipeMetaData() {

        for (var j in nodes[j]) {
            //get flow id
            if (nodes[j].id === flowId) {
                recipe.id = flowId;
                recipe.name = nodes[j].label;
                recipe.description = nodes[j].info;
                break;
            }
        }
    }

    function createInteractionsList(flowNodes) {
        //check the wiring information of each node and extract ingredient info and add to interactions
        //list

        var interactions = [];
        for (var i in flowNodes) {
            if ((flowNodes[i].outgoingNodes) && ((flowNodes[i].outgoingNodes).length > 0) && !(flowNodes[i].incomingNodes)) {
                for (var j in flowNodes[i].outgoingNodes) {
                    var interaction = {};
                    interaction.source = {};
                    interaction.source.id = flowNodes[i].id;
                    if (flowNodes[i].operation)
                        interaction.source.operation = flowNodes[i].operation;
                    interaction.destination = {};
                    interaction.destination.id = flowNodes[i].outgoingNodes[j];
                    var desInx = ids.indexOf(interaction.destination.id);
                    if (flowNodes[desInx])
                        interaction.destination.operation = flowNodes[desInx].operation;
                    interactions.push(interaction);
                    interaction = {};
                }
            } else if ((flowNodes[i].incomingNodes) && ((flowNodes[i].incomingNodes).length > 0) && !(flowNodes[i].outgoingNodes)) {
                var interaction = {};
                interaction.destination = {};
                interaction.destination = flowNodes[i].id;
                if (flowNodes[i].operation)
                    interaction.destination.operation = flowNodes[i].operation;
                for (var j in flowNodes[i].incomingNodes) {
                    interaction.source = {};
                    interaction.source.id = flowNodes[i].incomingNodes[j];
                    var srcInx = ids.indexOf(interaction.source.id);
                    if (flowNodes[srcInx].operation)
                        interaction.source.operation = flowNodes[srcInx].operation;
                    interactions.push(interaction);
                    interaction = {};
                }
            }
        }
    }

    function getTDDataType(pType) {
        var tdType;
        if ((pType.indexOf("integer") > -1) || (pType.indexOf("float") > -1)) {
            tdType = "<http://www.w3.org/ns/td#Number>";
        } else if ((pType.indexOf("boolean") > -1)) {
            tdType = "<http://www.w3.org/ns/td#Boolean>";
        }
        return tdType;
    }

    function generateIngredientQuery(flowNodes) {

        var matchingResults = {};
        var prefix = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                "PREFIX building: <http://schema/building#>\n" +
                "PREFIX schema: <http://schema.org/>\n" +
                "PREFIX iot: <http://iotschema.org/>\n" +
                "PREFIX ms: <http://mindsphere.io/>\n";
        var query = "";
        var qarray = [];
        var j = 0;
        var k = 0;
        var numberOfRequests = 0;
        var async_request = [];
        var responseData = '';
        for (var i in flowNodes) {
            if (flowNodes[i].nodeType === "iotIPNode") {
                matchingResults[flowNodes[i].name] = [];
                numberOfRequests++;
                query = "?n WHERE { GRAPH ?g  { ?s rdf:type  <http://www.w3.org/ns/td#Thing> .\n" +
                        "?s <http://www.w3.org/ns/td#interaction> ?p .\n" +
                        "?p <http://www.w3.org/ns/td#name> ?n .\n" +
                        "?p rdf:type  <http://iotschema.org/" + iotSlicer(flowNodes[i].ipType) + "> . \n" +
                        "?p <http://iotschema.org/capability> <http://iotschema.org/" + iotSlicer(flowNodes[i].capability) + "> . \n";

                /*if(flowNodes[i].foi){
                 query = query + "?i ?p ?foi building:"+flowNodes[i].foi +" . \n";
                 }if(flowNodes[i].unitCode){
                 query = query + "?i schema:unitCode "+flowNodes[i].unitCode +" .  ";
                 }
                 if(flowNodes[i].minValue){
                 query = query + "OPTIONAL { ?v schema:minValue "+flowNodes[i].minValue +" } ";
                 }
                 if(flowNodes[i].maxValue){
                 query = query + "OPTIONAL { ?v schema:maxValue "+flowNodes[i].maxValue +" } ";
                 }*/
                query = query + " }}";

                //execute the query on SPARQL Endpoint/thing directory/vlog.
                qarray[j] = query;
                //execute query on thing repository
                var uri = encodeURIComponent(qarray[j]);
                var thingDerectoryUrl = $('#directoryURL').val() + '/td-lookup/sem?query=';
                console.log(uri);
                async_request.push($.ajax({
                    url: thingDerectoryUrl + uri,
                    method: 'get',
                    dataType: "text",
                    async: false,
                    success: function (text) {

                        responseData += text;
                        if (text.includes("Triple")) {

                            var elements = [];
                            var newStr = text.substring(0, text.length - 2) +
                                    text.substring(text.length - 1, text.length);
                            var js = JSON.parse(newStr);

                            Object.keys(js).forEach(function (key) {
                                elements.push(js[key][0]["n"]);
                            });

                            matchingResults[flowNodes[i].name] = elements;
                        }
                    },
                    error: function (jq, status, message) {
                        return {};
                    }
                }));
                j++;
            }
        }
        return matchingResults;
    }

    function iotSlicer(str) {
        return (str.slice(str.indexOf(":") + 1, str.length));
    }

    function serviceCallHttp(nodeID, flowRequestOpts) {
        var res = [];
        const Http = new XMLHttpRequest();
        const url = flowRequestOpts;
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = (e) => {
            res = Http.responseText;

            let flowNodes = JSON.parse(res).filter(function (element) {
                let currentFlowNodes = element.z === nodeID;
                return (currentFlowNodes);
            });

            let recipeFlow = {};
            recipeFlow["@graph"] = flowNodes;
            for (var i = 0, j = 0; i < (recipeFlow["@graph"]).length; i++, j++) {
                nodes[j] = recipeFlow["@graph"][i];
                ids[j] = nodes[j].id;
            }
            parseFlow(flowNodes);
            createInteractionsList(flowNodes);
            var matching = generateIngredientQuery(flowNodes);
            render(matching);
        };
    }

    $.getJSON('checkStatus', function (data) {
        if (data.length > 0) {
             $('#TDURLStatus').replaceWith('<label id="TDURLStatus" style="color:red"></label>');
            if ($('#directoryURL').val() === "") {
                $('#TDURLStatus').replaceWith('<label id="TDURLStatus" style="color:red">Error : TD URL is empty</label>');
            } else {
                serviceCallHttp(RED.workspaces.active(), noderedFlowAPIURL);
            }
        } else {
            $('#TDURLStatus').replaceWith('<label id="TDURLStatus" style="color:red">\n\
Error : TD Web Directory is not running</label>');
        }
    });
}

function checkServerStatus() {
    $.getJSON('checkStatus', function (data) {
        if (data.length > 0) {
            return true;
        } else {
            return false;
        }
    });
}

function validateRecipeFlow() {

    $.ajax({url: noderedFlowAPIURL, success: function (result) {
            recipeDescription = result;
            var existingElements = getCurrentFlowNodes(result, RED.workspaces.active());

            let thingDescriptionNodes = existingElements.filter(function (element) {
                let currentFlowNodes = element["type"] === "ThingDescriptionGenerator";
                return (currentFlowNodes);
            });

            if (thingDescriptionNodes.length > 0) {

            }

            let iotSchemaNodes = existingElements.filter(function (element) {
                let currentFlowNodes = element.hasOwnProperty("iptype");
                return (currentFlowNodes);
            });

            let invalidConfiguration = false;
            let errorMessage = "<br/><br/><label style='font-weight: bold'>Configure following properties before deploy <label><br/>\n\
                <table style='border: 1px;solid #ddd;text-align: left;'>";
            for (index in iotSchemaNodes) {
                let emptyName = false;
                let emptyOperation = false;
                let currentNodeError = "<tr><td>" + iotSchemaNodes[index].type + " &nbsp->&nbsp</td>";
                if (iotSchemaNodes[index].name === "") {

                    invalidConfiguration = true;
                    emptyName = true;
                    currentNodeError = currentNodeError + "<td><font color='red'>name</font></td>";
                }
                if (iotSchemaNodes[index].operation === "") {
                    invalidConfiguration = true;
                    emptyOperation = true;
                    currentNodeError = currentNodeError + "<td><font color='red'>&nbsp&nbspoperation</font></td>";
                }
                if (emptyName || emptyOperation) {
                    currentNodeError = currentNodeError + "</tr>";
                    errorMessage = errorMessage + currentNodeError;
                }
            }
            if (invalidConfiguration) {
                errorMessage = errorMessage + "</table>";
                $('#ConfigStatus').
                        replaceWith("<div id='ConfigStatus'>" + errorMessage + "</div>");
                $('#MatchMakingResults').
                        replaceWith("<div id='MatchMakingResults'></div>");
                $('#discoverButton').prop('disabled', true);
            }
        }
    }
    );
}

function validateRequiredField() {
    var res = [];
    const Http = new XMLHttpRequest();
    Http.open("GET", noderedFlowAPIURL);
    Http.send();
    Http.onreadystatechange = (e) => {
        res = Http.responseText;

        let flowNodes = JSON.parse(res).filter(function (element) {
            let currentFlowNodes = element.hasOwnProperty("iptype");
            return (currentFlowNodes);
        });
        return flowNodes;
    };
}

function shiftFlowX(existingNodes) {
    for (node in existingNodes) {
        existingNodes[node]["x"] = existingNodes[node]["x"] + 300;
    }
    return existingNodes;
}
function recalculatePositions(existingNodes, newNodes) {

    for (node in newNodes) {
        var candidateNode = existingNodes.filter(obj => {
            return obj.name === newNodes[node]["connectingNode"];
        });

        //setting method of the new node
        if (candidateNode[0]["operation"] === "observe" || candidateNode[0]["operation"] === "retrieve") {
            newNodes[node]["method"] = "GET";
            newNodes[node]["interval"] = 2;
            newNodes[node]["wires"][0] = candidateNode[0]["id"];
            newNodes[node]["x"] = candidateNode[0]["x"] - 250;
            newNodes[node]["y"] = candidateNode[0]["y"];
        } else if (candidateNode[0]["operation"] === "update") {
            newNodes[node]["method"] = "PUT";
            candidateNode[0]["wires"][1] = newNodes[node]["id"];
            newNodes[node]["x"] = candidateNode[0]["x"] + 250;
            newNodes[node]["y"] = candidateNode[0]["y"];
        } else if (candidateNode[0]["operation"] === "create") {
            newNodes[node]["method"] = "POST";
            candidateNode[0]["wires"][1] = newNodes[node]["id"];
            newNodes[node]["x"] = candidateNode[0]["x"] + 250;
            newNodes[node]["y"] = candidateNode[0]["y"];
        }
    }
    var allnodes = existingNodes.concat(newNodes);
    return allnodes;
}

function getCurrentFlowNodes(allnodes, flowID) {
    let flowNodes = allnodes.filter(function (element) {
        let currentFlowNodes = element.z === flowID;
        return (currentFlowNodes);
    });
    return flowNodes;
}

function makeid(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function makeNodeId() {
    let head = makeid(8);
    let tail = makeid(6);
    return head + '.' + tail;
}

function createNode(nodeType) {
    let head = makeid(8);
    let tail = makeid(6);
    var a = {"id": head + '.' + tail, "type": nodeType, "name": "", "x": 300,
        "y": 255, "wires": [[]], "method": ""};
    return a;
}

function updateConnections(node, currentNode, nodeId, outdatedId, connections) {
    if (connections.indexOf(outdatedId) !== -1) {
        connections[connections.indexOf(outdatedId)] = nodeId;
        node["input"]++;
        currentNode["output"]++;
    }
}

function updateFlow(elements) {

    for (i in elements) {
        elements[i]["input"] = 0;
        elements[i]["output"] = 0;
    }
    for (index in elements) {
        let node = elements[index];
        let outdatedId = node["id"];

        //assigning new id
        node["id"] = makeNodeId();

        //updating connected nodes
        for (position in elements) {
            let currentNode = elements[position];

            if (currentNode["type"] !== 'tab') {
                let connections = currentNode["wires"];
                let type = currentNode["type"];

                if (connections.length === 0) {
                    updateConnections(node, currentNode, node["id"], outdatedId, connections);
                } else {
                    for (index in connections) {
                        updateConnections(node, currentNode, node["id"], outdatedId, connections[index]);
                    }
                }
            }
        }
    }
    return elements;
}

function createFlow(matches) {

    var schemaNodes = matches.split(",");
    let newNodes = [];

    for (device in schemaNodes) {
        var elementId = '#' + schemaNodes[device];
        var newDeviceNode = createNode($(elementId).val());
        newDeviceNode["connectingNode"] = elementId.substr(1);
        newNodes.push(newDeviceNode);
    }

    let head = makeid(7);
    let tail = makeid(7);
    let flowId = head + '.' + tail;

    let recipeDescription;
    $.ajax({url: noderedFlowAPIURL, success: function (result) {
            recipeDescription = result;

            var existingElements = updateFlow(getCurrentFlowNodes(result, RED.workspaces.active()));
            var shiftedElements = shiftFlowX(existingElements);

            let flowDescription = {
                "id": flowId,
                "label": $('#flowname').val(),
                "nodes": recalculatePositions(shiftedElements, newNodes),
                "configs": []
            };
            const noderedFlowAdminAPIURL = location.protocol + "//" + location.hostname + ":" + location.port + "/flow";
            $.ajax({
                type: "POST",
                url: noderedFlowAdminAPIURL,
                data: JSON.stringify(flowDescription),
                dataType: "json",
                contentType: "application/json"
            });
        }});
}
