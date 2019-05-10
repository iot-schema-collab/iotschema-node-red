let TDURL = "http:" + "//" + location.hostname + ":" + "8080" + "/td";
let VOCAB_URL = "http:" + "//" + location.hostname + ":" + "8080" + "/vocab";
let TD_LOOKUP_URL = "http:" + "//" + location.hostname + ":" + "8080" + "/td-lookup/sem?query=";
const noderedFlowAPIURL = location.protocol + "//" + location.hostname + ":" + location.port + "/flows";
const noderedFlowAdminAPIURL = location.protocol + "//" + location.hostname + ":" + location.port + "/flow";
const contextFilePath = "../artefacts/context.json";
const iotSchemaGitURL = "https://api.github.com/repos/aparnathuluva/iotschema/contents/";
let isThingDescription = false;
let recipesToBeimported = {};
let selectedRecipes = new Set([]);
const contextDescription = '';
const resources = ['interaction-patterns.jsonld', 'capability.jsonld', 'core.jsonld', 'unit.jsonld'];
var deployed = false;
const TDType = '"@type": "Thing"';
function deploy() {
    //  if ($('#filePath').val() === '') {
    //      $('#filePathStatus').replaceWith("<div id='filePathStatus'style='margin-top: 15px;'>Please select the 
    //      artefact</div>");
    //  } else {

    let formData = new FormData();
    let req = new XMLHttpRequest();
    //      let file = document.getElementById("filePath").files[0];
    //     $('#serverStatus').
    //                     replaceWith("<div id='serverStatus' style='margin-top: 20px;'>Server Status: Starting 
    //                     ...</div>");
    //     formData.append("filetoupload", file);
    req.open("POST", '/deployArtifact');
    req.send(formData);
}

function readResourcesFromRemoteRepo() {
    for (file in resources) {
        $.getJSON(iotSchemaGitURL + resources[file], function (data) {
            $.ajax({
                type: "POST",
                url: TDURL,
                crossDomain: true,
                data: window.atob(data["content"]),
                async: false,
                headers: {
                    'content-type': 'application/td+json'
                },
            });
        });
    }
}

function storeResourcesInTD() {
    $.ajax({
        type: "POST",
        url: TDURL,
        crossDomain: true,
        data: window.atob(data["content"]),
        headers: {
            'content-type': 'application/td+json'
        },
    });
}

function stop() {
    $.getJSON('stopArtifact', function () {
    });
}

function checkStatus() {
    setInterval(function () {
        if (!document.getElementById("remoteTD").checked) {
            $.getJSON('checkStatus', function (data) {
                if (data.length > 0) {
                    if(!deployed){
                     deployed = true;
   	             readResourcesFromRemoteRepo();
		     
       		}
                    $('#serverStatus').
                            replaceWith("<div id='serverStatus' style='margin-top: 20px;'>Server Status: Running</div>");
                    $('#startButton').prop("disabled", true);
                    $('#stopButton').prop("disabled", false);
                } else if ($('#serverStatus').text() === 'Server Status: Starting ...') {
                    $('#serverStatus').
                            replaceWith("<div id='serverStatus' style='margin-top: 20px;'>Server Status: Starting ...</div>");
                    $('#stopButton').prop("disabled", true);
                    $('#startButton').prop("disabled", true);
                } else {
                    $('#serverStatus').
                            replaceWith("<div id='serverStatus' style='margin-top: 20px;'>Server Status: Not Running</div>");
                    $('#stopButton').prop("disabled", true);
                    $('#startButton').prop("disabled", false);
                }
            });
        }
    }, 2500);

}

function displayValue() {
    if (document.getElementById("retrieveTD").checked) {
        storeTDQuery.style.display = 'none';
        retTDQuery.style.display = 'inline';
        retRecQuery.style.display = 'none';
        $('#submitBtn').prop("disabled", false);
    } else if (document.getElementById("retriveRec").checked) {
        storeTDQuery.style.display = 'none';
        retTDQuery.style.display = 'none';
        retRecQuery.style.display = 'inline';
        $('#submitBtn').prop("disabled", false);
    } else if (document.getElementById("storeRec").checked) {
        storeTDQuery.style.display = 'none';
        retTDQuery.style.display = 'none';
        retRecQuery.style.display = 'none';
        $('#submitBtn').prop("disabled", false);
    } else if (document.getElementById("storeTD").checked) {
        storeTDQuery.style.display = 'inline';
        retTDQuery.style.display = 'none';
        retRecQuery.style.display = 'none';
        $('#submitBtn').prop("disabled", false);
    } else {
        storeTDQuery.style.display = 'none';
        retTDQuery.style.display = 'none';
        retRecQuery.style.display = 'none';
        $('#submitBtn').prop("disabled", true);
    }
}

function displayServerOptions() {
    if (document.getElementById("remoteTD").checked) {
        serverPanel.style.display = 'none';
        remoteIDLocation.style.display = 'inline';
        connect.style.display = 'inline';


    } else if (document.getElementById("localTD").checked) {
        serverPanel.style.display = 'inline';
        remoteIDLocation.style.display = 'none';
        connect.style.display = 'none';
    }
}

function connectToRemoteTDServer() {
    $.ajax({
        type: "GET",
        async: true,
        crossDomain: true,
        dataType: 'jsonp',
        url: $('#remoteIDLocation').val(),
    }).done(function (message, text, jqXHR) {
        console.log("Server status", jqXHR.status);
        serverStatus.style.display = 'inline';
    }).fail(function(jqXHR, textstatus, errorThrown) {
        console.log("jqXHR: ", $('#serverStatus'));
        serverStatus.style.display = 'inline';
    });
}

function onSubmit() {
    if(!deployed){
    //readResourcesFromRemoteRepo();
    deployed = true;


}
    if (document.getElementById("storeTD").checked) {
        console.log("entered store TD "); 
        let TDJson = $('#storeTDQuery').val();
        $.ajax({url: noderedFlowAPIURL, crossDomain: true, success: function (result) {

                let existingElements = getFlowNodes(result, RED.workspaces.active());
            console.log("existingElements: ", existingElements);
                let thingDescriptionNodes = existingElements.filter(function (element) {
                    let currentFlowNodes = element["type"] === "ThingDescriptionGenerator";
                    return (currentFlowNodes);
                });
            console.log("thingDescriptionNodes.length: ", thingDescriptionNodes.length);
                if (thingDescriptionNodes.length > 0) {
                    isThingDescription = true;
                    $.getJSON('/TDGenerator/generatedContent', function (data) {
                        content = JSON.stringify(data);
                        console.log("content:  ", content);
                        $.ajax({
                            type: "POST",
                            url: TDURL,
                            crossDomain: true,
                            data: data,
                            headers: {
                                'content-type': 'application/td+json'
                            },
                        });
                    });
                } else if (TDJson.indexOf(TDType) >= 0) {
                    if ($('#remoteIDLocation').val()){
                        TDURL = $('#remoteIDLocation').val();
                        if (!TDURL.indexOf("td") >= 0){
                            TDURL = TDURL + "/td";
                        }
                    }
                    console.log("location.hostname: ", location.hostname);
                    $.ajax({
                        type: "POST",
                        url: TDURL,
                        crossDomain: true,
                        data: TDJson,
                        headers: {
                            'content-type': 'application/td+json'
                        },
                        success: function(result) {
                            alert("successfully stored TD!");
                        },
                        error: function(jqxhr, status, exception){
                            alert("exception:  ", exception);
                        }
                    });
                    
                }
            }
        }
        );

        // There are two cases
        // 1. Store a Thing Description
        //    We use the existance of TDGenerator node in the flow to indetify this scenario
        //    
        // 2. Store a Recipe
        //    If there is no TDGenerator node in the flow, we decide it as a recipe
        //    
        // Access the global context of NodeRed using the API to get flow description
    } else if (document.getElementById("storeRec").checked) {

        $.ajax({
            url: noderedFlowAPIURL, crossDomain: true, success: function (result) {

                let existingElements = getFlowNodes(result, RED.workspaces.active());
                console.log("existingElements: ", existingElements);
                tdContext = '{"@context":{"URL":{"@id":"http://schema.org/URL"},\n\
                                   "interactionCounter_1":{"@id":"http://schema.org/interactionCounter_1"},\n\
                                    "Common":{"@id":"http://iotschema.org/Common"},"Industry":\n\
                                    {"@id":"http://iotschema.org/Industry"},"Unit":{"@id":"http://iotschema.org/Unit"},\n\
                                    "interactionStatistic":{"@id":"http://schema.org/interactionStatistic"},"hue-light":\n\
                                    {"@id":"http://nodered.org/model#hue-light"},"versionInfo":{"@id":"http://www.w3.org/2002/07/owl#versionInfo"},\n\
                                    "userInteractionCount":{"@id":"http://schema.org/userInteractionCount"},\n\
                                    "observe":{"@id":"http://iot.schema.org/node/configuration#observe"},"license":\n\
                                    {"@id":"http://schema.org/license"},"url":{"@id":"http://schema.org/url"},"propertyValues":\n\
                                    {"@id":"http://iot.schema.org/node/configuration#propertyValues"},"runtimePlatform":\n\
                                    {"@id":"http://schema.org/runtimePlatform"},"accountablePerson":{"@id":"http://schema.org/accountablePerson"},\n\
                                    "nodePackage_1":{"@id":"http://nodered.org/model#nodePackage_1"},\n\
                                    "CodeDependency":{"@id":"http://nodered.org/model#CodeDependency"},\n\
                                    "Equipment":{"@id":"http://iotschema.org/Equipment"},"Thing":{"@id":"http://schema.org/Thing"},\n\
                                    "SubFlow":{"@id":"http://nodered.org/model#SubFlow"},"numberOfCodeForks":\n\
                                    {"@id":"http://nodered.org/model#numberOfCodeForks"},"dateModified":{"@id":"http://schema.org/dateModified"},\n\
                                    "CodeQualityCharacteristics":{"@id":"http://nodered.org/model#CodeQualityCharacteristics"},\n\
                                    "aggregateRating_1":{"@id":"http://nodered.org/model#aggregateRating_1"},\n\
                                    "delete":{"@id":"http://iot.schema.org/node/configuration#delete"},"FeatureOfInterest":\n\
                                    {"@id":"http://iotschema.org/FeatureOfInterest"},"Class":{"@id":"http://www.w3.org/2000/01/rdf-schema#Class"},\n\
                                    "type":{"@id":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},"interactionType":\n\
                                    {"@id":"http://schema.org/interactionType"},"SoftwareApplication":{"@id":"http://schema.org/SoftwareApplication"},"domainIncludes":{"@id":"http://schema.org/domainIncludes"},"inverseOf":{"@id":"http://schema.org/inverseOf"},"label":{"@id":"http://www.w3.org/2000/01/rdf-schema#label"},"Mobility":{"@id":"http://iotschema.org/Mobility"},"programmingLanguage":{"@id":"http://schema.org/programmingLanguage"},"reviewCount":{"@id":"http://schema.org/reviewCount"},"aggregateRating":{"@id":"http://schema.org/aggregateRating"},"numberOfCodeCommits":{"@id":"http://nodered.org/model#numberOfCodeCommits"},"capability":{"@id":"http://iotschema.org/capability"},"observable":{"@id":"http://iotschema.org/observable"},"Operation":{"@id":"http://iot.schema.org/node/configuration#Operation"},"maxValue":{"@id":"http://schema.org/maxValue"},"Event":{"@id":"http://iotschema.org/Event"},"processorRequirements":{"@id":"http://schema.org/processorRequirements"},"nativeCode":{"@id":"http://nodered.org/model#nativeCode"},"wires":{"@id":"http://nodered.org/model#wires"},"x":{"@id":"http://nodered.org/model#positionX"},"y":{"@id":"http://nodered.org/model#positionY"},"z":{"@id":"http://nodered.org/model#positionZ"},"update":{"@id":"http://iot.schema.org/node/configuration#update"},"numberOfCodeContributors":{"@id":"http://nodered.org/model#numberOfCodeContributors"},"dailyDownloads":{"@id":"http://nodered.org/model#dailyDownloads"},"nodeRedVersion":{"@id":"http://nodered.org/model#nodeRedVersion"},"weeklyDownloads":{"@id":"http://nodered.org/model#weeklyDownloads"},"Domain":{"@id":"http://iotschema.org/Domain"},"InteractionCounter":{"@id":"http://schema.org/InteractionCounter"},"Building":{"@id":"http://iotschema.org/Building"},"StructuredValue":{"@id":"http://schema.org/StructuredValue"},"Capability":{"@id":"http://iotschema.org/Capability"},"rangeIncludes":{"@id":"http://schema.org/rangeIncludes"},"PropertyChangedEvent":{"@id":"http://iotschema.org/PropertyChangedEvent"},"numberOfCodeBranches":{"@id":"http://nodered.org/model#numberOfCodeBranches"},"location":{"@id":"http://iotschema.org/location"},"CreativeWork":{"@id":"http://schema.org/CreativeWork"},"AggregateRating":{"@id":"http://schema.org/AggregateRating"},"ConsumeAction":{"@id":"http://schema.org/ConsumeAction"},"ConfigurationAttribute":{"@id":"http://nodered.org/model#ConfigurationAttribute"},"disambiguatingDescription":{"@id":"http://schema.org/disambiguatingDescription"},"nodeHostedOn":{"@id":"http://nodered.org/model#nodeHostedOn"},"temporalCoverage":{"@id":"http://schema.org/temporalCoverage"},"CodeRepository":{"@id":"http://nodered.org/model#CodeRepository"},"operation":{"@id":"http://iot.schema.org/node/configuration#operation"},"id":{"@id":"http://schema.org/identifier"},"Rating":{"@id":"http://schema.org/Rating"},"codeQuality":{"@id":"http://nodered.org/model#codeQuality"},"Recipe":{"@id":"http://nodered.org/model#Recipe"},"SubFlowOutput":{"@id":"http://nodered.org/model#SubFlowOutput"},"out":{"@id":"http://nodered.org/model#subFlowOutput"},"in":{"@id":"http://nodered.org/model#subFlowInput"},"inputs":{"@id":"http://nodered.org/model#numberOfInputs"},"outputs":{"@id":"http://nodered.org/model#numberOfOutputs"},"operatingSystem":{"@id":"http://schema.org/operatingSystem"},"SoftwareSourceCode":{"@id":"http://schema.org/SoftwareSourceCode"},"occurrencesOfUnreachableCode":{"@id":"http://nodered.org/model#occurrencesOfUnreachableCode"},"keywords":{"@id":"http://schema.org/keywords"},"packageManager":{"@id":"http://nodered.org/model#packageManager"},"ratingValue":{"@id":"http://schema.org/ratingValue"},"Property":{"@id":"http://iotschema.org/Property"},"CodeQualityCharacteristics_1":{"@id":"http://nodered.org/model#CodeQualityCharacteristics_1"},"source":{"@id":"http://purl.org/dc/terms/source"},"InstallAction":{"@id":"http://schema.org/InstallAction"},"datePublished":{"@id":"http://schema.org/datePublished"},"Site":{"@id":"http://iotschema.org/Site"},"usesNode":{"@id":"http://nodered.org/model#usesNode"},"containsNode":{"@id":"http://nodered.org/model#containsNode"},"retrieve":{"@id":"http://iot.schema.org/node/configuration#retrieve"},"create":{"@id":"http://iot.schema.org/node/configuration#create"},"featureOfInterest":{"@id":"http://iotschema.org/isPropertyOf"},"Text":{"@id":"http://schema.org/Text"},"NodePackage":{"@id":"http://nodered.org/model#NodePackage"},"InteractionPattern":{"@id":"http://iotschema.org/InteractionPattern"},"Resource":{"@id":"http://www.w3.org/2000/01/rdf-schema#Resource"},"codeRepository_1":{"@id":"http://nodered.org/model#codeRepository_1"},"ChangePropertyAction":{"@id":"http://iotschema.org/ChangePropertyAction"},"monthlyDownloads":{"@id":"http://nodered.org/model#monthlyDownloads"},"Actuator":{"@id":"http://iotschema.org/Actuator"},"numberOfCodeStars":{"@id":"http://nodered.org/model#numberOfCodeStars"},"numberOfCodeIssue":{"@id":"http://nodered.org/model#numberOfCodeIssue"},"Enumeration":{"@id":"http://schema.org/Enumeration"},"name":{"@id":"http://schema.org/name"},"info":{"@id":"http://www.w3.org/2000/01/rdf-schema#comment"},"color-namer":{"@id":"http://nodered.org/model#color-namer"},"Philips_Hue_Log_File_and_E-Mail":{"@id":"http://nodered.org/model#Philips_Hue_Log_File_and_E-Mail"},"numberOfCodeWatcher":{"@id":"http://nodered.org/model#numberOfCodeWatcher"},"Device":{"@id":"http://iotschema.org/Device"},"SubFlowInput":{"@id":"http://nodered.org/model#SubFlowInput"},"Action":{"@id":"http://iotschema.org/Action"},"Node":{"@id":"http://nodered.org/model#Node"},"numberOfCodeReleases":{"@id":"http://nodered.org/model#numberOfCodeReleases"},"minValue":{"@id":"http://schema.org/minValue"},"configurationAttribute":{"@id":"http://nodered.org/model#configurationAttribute"},"numberOfPullRequests":{"@id":"http://nodered.org/model#numberOfPullRequests"},"description":{"@id":"http://schema.org/description"},"numberOfCodeBestPractices":{"@id":"http://nodered.org/model#numberOfCodeBestPractices"},"unitCode":{"@id":"http://schema.org/unitCode"},"Flow":{"@id":"http://nodered.org/model#Flow"},"softwareVersion":{"@id":"http://schema.org/softwareVersion"},"occurrencesOfErrorProneCode":{"@id":"http://nodered.org/model#occurrencesOfErrorProneCode"},"npmVersion":{"@id":"http://nodered.org/model#npmVersion"},"Sensor":{"@id":"http://iotschema.org/Sensor"}},"@graph":[]}';
                context = JSON.parse(tdContext);
                context['@graph'] = existingElements;
                if ($('#remoteIDLocation').val()) {
                    VOCAB_URL = $('#remoteIDLocation').val();
                    if (!VOCAB_URL.indexOf("vocab") >= 0) {
                        VOCAB_URL = VOCAB_URL + "/vocab";
                    }
                }
                $.ajax({
                    type: "POST",
                    url: VOCAB_URL,
                    crossDomain: true,
                    data: JSON.stringify(context),
                    headers: {
                        'content-type': 'application/td+json'
                    },
                    success: function (result) {
                        alert("successfully stored recipe!");
                    },
                    error: function (jqxhr, status, exception) {
                        alert("exception:  ", exception);
                    }
                });
            }
        }
        );

    }  else if (document.getElementById("retriveCap").checked) {
        console.log("entered store TD "); 
       
       var cap = $('#capQuery').val();
       var rawQuery = "?o WHERE { GRAPH ?g { ?s  <http://www.w3.org/2000/01/rdf-schema#subClassOf> <http://iotschema.org/Capability> . ?s <http://iotschema.org/providesInteractionPattern> ?o . FILTER (?s= <http://iotschema.org/";
       rawQuery = rawQuery.concat(cap);
       rawQuery = rawQuery.concat(">) } }");

      // console.log(rawQuery);
       var capabilities = [];
       
       $.ajax({
        url: TD_LOOKUP_URL + encodeURIComponent(rawQuery),
        type: 'GET',
        dataType: "text",
           crossDomain: true,
        success: function(res,body) {
            
            var reg = /http:\/\/iotschema.org\/[A-Za-z0-9]+./g
            var found = res.match(reg);

            for(c in found){
  		var cap = (found[c].slice(0,-1)).split("http://iotschema.org/")[1];
                console.log(cap);
                capabilities.push(cap.toLowerCase());
  		
             }

        capResults = "<div id='capabilityResultSet'><select id='capabilitySelect' multiple onchange='addCapability()'>"
       for (capability in capabilities){
       	capResults = capResults.concat("<option value='"+capabilities[capability]+"'>"+capabilities[capability]+"</option>");
        console.log(capResults)
       }
       capResults = capResults.concat("</select><br/></div>");
       $('#capabilityResultSet').replaceWith(capResults);

        }
       });
       
       
    
    } else if (document.getElementById("retriveRec").checked) {

        $.getJSON(TDURL, function (data) {
            let resultset = "<div style='margin-top: 20px;' id='resultList'>";
            for (resource in data) {
                if (!(data[resource].hasOwnProperty('@type') && data[resource]['@type'][0] === 'Thing')) {
                    recipesToBeimported[resource] = data[resource];
                    resultset = resultset.concat('<input type="checkbox" name="' +
                            resource + '" value="' + resource + '" onclick = onClickCandiateFlow(this) \n\
                            style="margin-bottom:15px">'
                            + data[resource]["@graph"][0]["label"]) + '</input><br/>';
                }
            }
            resultset = resultset.concat("<button id='importBtn' onclick=importRecipe()>Import</button>")
            resultset = resultset.concat("</div>")
            $('#resultList').replaceWith(resultset);
        });
    } 
}

function addCapability(){
	getCapabilityNodePosition(addCapabilityNode, $('#capabilitySelect').val()[0])
}

function addCapabilityNode(positions, nodeType) {

    var nodeDefinition = [{"id": RED.nodes.id(), "type": nodeType,
            "z": "538e49f9.1c9f18", "name": "", "outputs":2, "noerr": 0,
            "x": (positions[0] + positions[2]) / 2, "y": positions[3] + 100,
            "wires": [[]]}]
    
    var importResult = RED.nodes.import(nodeDefinition);
    RED.history.push({t: "add", nodes: [importResult[0].map(function (n) {
                return n.id
            })], dirty: RED.nodes.dirty()});
    RED.nodes.dirty(true);
    RED.view.redraw(true);
}

function getCapabilityNodePosition(callback, nodeType) {
    $.ajax({url: noderedFlowAPIURL, crossDomain: true, success: function (result) {

            let existingElements = getFlowNodes(result, RED.workspaces.active());

            var minX = Math.pow(10, 1000);
            var minY = Math.pow(10, 1000);
            var maxX = 0;
            var maxY = 0;

            for (element in existingElements) {
                if (existingElements[element].x) {
                    if (minX > existingElements[element].x) {
                        minX = existingElements[element].x;
                    }
                    if (maxX < existingElements[element].x) {
                        maxX = existingElements[element].x;
                    }
                }
                if (existingElements[element].y) {
                    if (minY > existingElements[element].y) {
                        minY = existingElements[element].y;
                    }
                    if (maxY < existingElements[element].y) {
                        maxY = existingElements[element].y;
                    }
                }
            }
            callback([minX, minY, maxX, maxY], nodeType);
        }});
}

function makeId(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function importRecipe() {

    selectedRecipes.forEach(recipe => {
        console.log(recipesToBeimported[recipe])
        let head = makeId(7);
        let tail = makeId(7);
        let flowId = head + '.' + tail;
        let filteredNodes = recipesToBeimported[recipe]["@graph"]
        let flowname = filteredNodes[0]["label"];

        let flowDescription = {
            "id": flowId,
            "label": flowname,
            "nodes": updateRecipeFlow(getFilterednodes(filteredNodes)),
            "configs": []
        };
        
        $.ajax({
            type: "POST",
            url: noderedFlowAdminAPIURL,
            crossDomain: true,
            data: JSON.stringify(flowDescription),
            dataType: "json",
            contentType: "application/json"
        });
    });
}
function getFilterednodes(allNodes) {
    let filteredNodes = allNodes.filter(function (element) {
        let currentFlowNodes = element["type"] !== "tab";
        return (currentFlowNodes);
    });
    return filteredNodes;
}

function makeNodeId() {
    let head = makeid(8);
    let tail = makeid(6);
    return head + '.' + tail;
}

function updateRecipeFlow(elements) {

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

function onClickCandiateFlow(cb) {
    if (cb.checked) {
        if (!selectedRecipes.has(cb.getAttribute("name"))) {
            selectedRecipes.add(cb.getAttribute("name"));
            console.log(recipesToBeimported)
            let information = "<div style='margin-top: 20px;' id='information'>";
            information = information.concat("<br/>");
            information = information.concat(recipesToBeimported[cb.getAttribute("name")]["@graph"][0]["label"]);
            information = information.concat("<br/>");
            information = information.concat("<br/>");
            information = information.concat(recipesToBeimported[cb.getAttribute("name")]["@graph"][0]["info"]);
            information = information.concat("</div>");
            $('#information').replaceWith(information);
        }
    } else {
        if (selectedRecipes.has(cb.getAttribute("name"))) {
            selectedRecipes.delete(cb.getAttribute("name"));
            let information = "<div style='margin-top: 20px;' id='information'>";
            information = information.concat("</div>")
            $('#information').replaceWith(information);
        }
    }
}

function getFlowNodes(allnodes, flowID) {
    let flowNodes = allnodes.filter(function (element) {
        let currentFlowNodes = element.z === flowID || element.id === flowID;
        return (currentFlowNodes);
    });

    return flowNodes;
}

function readFile(filepath) {
    var str = "";
    var txtFile = new File(filepath);
    txtFile.open("r");
    while (!txtFile.eof) {
        str += txtFile.readln() + "\n";
    }
    return str;
}
