//TODO: these two functions are implemented as nested functions in utils.js
// remove nested functions and use functions from this file

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