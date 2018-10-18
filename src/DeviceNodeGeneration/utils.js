const url = require('url');

module.exports = {
    createDataModel: function createDataModel(rawData) {
        let data = rawData;
        let dataModel = {};

        let properties = data['properties'];
        let actions = data['actions'];
        let baseURL = data['base'];
	let security = data['security'];
	let securityScheme = "nosec";
	if(security){
                let secType = security[0][Object.keys(security[0])[0]];
		securityScheme = secType.charAt(0).toUpperCase() + secType.slice(1);
	}

        let propertyNodes = [];
        let actionNodes = [];

        //properties
        if (properties) {
            for (let i = 0; i < Object.keys(properties).length; i++) {
                let currentProperty = {};
                let propertyObject = properties[Object.keys(properties)[i]];
                currentProperty.numberOfInputs = 0;
                currentProperty.numberOfOutputs = 1;
                currentProperty.node_version = "1.0.0";
                currentProperty.node_description = "undefined";
                currentProperty.repository = "undefined";
                currentProperty.license = "undefined";
                currentProperty.node_name = Object.keys(properties)[i];
		currentProperty.securityScheme = securityScheme.toLowerCase();
		currentProperty.securitySchemeName = securityScheme.charAt(0).toUpperCase() + securityScheme.slice(1);
                currentProperty.type = "property";
                currentProperty.writable = properties[Object.keys(properties)[i]]["writable"];
                currentProperty.observable = properties[Object.keys(properties)[i]]["observable"];
		currentProperty.mediaType = properties[Object.keys(properties)[i]]["forms"][0]["mediaType"];
               
                if(baseURL){
                	currentProperty.baseURL = baseURL;
              
			let protocol = baseURL.split(':')[0];
			if(protocol === 'http' || 'https'){
				currentProperty.protocol = 'https';
			}
			else{
				currentProperty.protocol = 'coap';			
			}
                	const myURL = url.parse(baseURL);
                	currentProperty.hostname = myURL.hostname;
                	currentProperty.path = properties[Object.keys(properties)[i]]["forms"][0]["href"];

			if(currentProperty.path.startsWith("http")){
				currentProperty.url = currentProperty.path;
			}
				
			else if(baseURL[baseURL.length - 1]==="/"){
                    		currentProperty.url = baseURL  + currentProperty.path;
                	}
               		 else
                	{
                    		currentProperty.url = baseURL + "/" + currentProperty.path;
                	}

                }
                else{
			currentProperty.url = properties[Object.keys(properties)[i]]["forms"][0]["href"];
			let protocol = currentProperty.url.split(':')[0];
			if(protocol === 'http' || 'https'){
				currentProperty.protocol = 'https';
			}
                        else{
				currentProperty.protocol = 'coap';			
			}
		}
     
                //security handling
		
                      
                if (currentProperty.writable) {
                    currentProperty.numberOfInputs = 1;
                }

                propertyNodes[i] = currentProperty;
            }
        }

        //actions
        if (actions){
            for (let i = 0; i < Object.keys(actions).length; i++) {
                let currentAction = {};
                currentAction.numberOfInputs = 1;
                currentAction.numberOfOutputs = 0;
                currentAction.node_version = "1.0.0";
                currentAction.node_description = "undefined";
                currentAction.repository = "undefined";
                currentAction.license = "undefined";
                currentAction.node_name = Object.keys(actions)[i];
		currentAction.securityScheme = securityScheme.toLowerCase();
		currentAction.securitySchemeName = securityScheme.charAt(0).toUpperCase() + securityScheme.slice(1);
                currentAction.type = "action";
		currentAction.mediaType = actions[Object.keys(actions)[i]]["forms"][0]["mediaType"];

                if(baseURL){
                	currentAction.baseURL = baseURL;
			let protocol = baseURL.split(':')[0];
			if(protocol === 'http' || 'https'){
				currentAction.protocol = 'https';
			}
			else{
				currentAction.protocol = 'coap';			
			}
                	const myURL = url.parse(baseURL);
                	currentAction.hostname = myURL.hostname;
                	currentAction.path = actions[Object.keys(actions)[i]]["forms"][0]["href"];

			if(currentAction.path.startsWith("http")){
				currentAction.url = currentAction.path;
			}
				
			else if(baseURL[baseURL.length - 1]==="/"){
                    		currentAction.url = baseURL  + currentAction.path;
                	}
               		 else
                	{
                    		currentAction.url = baseURL + "/" + currentAction.path;
                	}

                }
                else{
			currentAction.url = actions[Object.keys(actions)[i]]["forms"][0]["href"];
			let protocol = currentAction.url.split(':')[0];
			if(protocol === 'http' || 'https'){
				currentAction.protocol = 'https';
			}
			else{
				actions.protocol = 'coap';			
			}
		}
                      

                if (actions[Object.keys(actions)[i]].hasOwnProperty('output')) {
                    currentAction.numberOfOutputs = 1;
                }

                actionNodes[i] = currentAction;
            }
    }
        dataModel.properties = propertyNodes;
        dataModel.actions = actionNodes;
        return dataModel;
    }
};
