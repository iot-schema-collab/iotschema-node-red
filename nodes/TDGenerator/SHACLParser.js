
function parseNotNode(shape){
	var resultNodeId = shape["sh:not"]["@id"];
	return resultNodeId;
}

function parseAndNode(shape){
	var listNodes = [];
	if(shape["sh:and"]["@list"]){
		listNodes = parseListNode(shape["sh:and"]["@list"]);
	}
	return listNodes;
}

function parseInNode(shape){
	var listNodes = [];
	if(shape["sh:in"]["@list"]){
		listNodes = parseListNode(shape["sh:in"]["@list"]);
		//console.log("list nodes:"+listNodes);
	}	
	return listNodes;
}

function parseListNode(node){
	var listNodes = [];
	for(var k = 0; k < node.length; k++){
		listNodes.push(node[k]["@id"]);
	}	
	return listNodes;
}

function parsePropertyNode(shape){
	var resultNodeId = shape["sh:property"]["@id"];
	//check result node type here or return it to checkNodeType and check it recursively in that function??
	return resultNodeId;
}

function getShape(shapes, nodeId){
	var shape;
	for(var i = 0; i < shapes.length; i++){
		if(shapes[i]["@id"] == nodeId){
			shape = shapes[i];
			break;
		}
	}
	return shape;
}

function checkNodeType(nodeId){
	
	var shape = getShape(shapes, nodeId);
	var nodeType = "";
	var resultNodeId;
	if(shape["sh:property"]){
		nodeType = "PropertyNode";
		resultNodeId = parsePropertyNode(shape);
		checkNodeType(resultNodeId);
	}
	else if(shape["sh:and"]){
		nodeType = "AndNode";
		var listNodes = parseAndNode(shape);
		for(var i = 0; i < listNodes.length; i++){
			checkNodeType(listNodes[i]);
		}
	}
	else if(shape["sh:in"]){
		nodeType = "InNode";
		var listNodes = parseInNode(shape);
		for(var i = 0; i < listNodes.length; i++){
			checkNodeType(listNodes[i]);
		}		
	}
    else if(shape["sh:not"]){
		nodeType = "NotNode";
		resultNodeId = parseNotNode(shape);
		checkNodeType(resultNodeId);
	}
	else if(shape["sh:path"]){
		var path = shape["sh:path"]["@id"];
		console.log("path: "+path);
		if(shape["sh:node"]){
			checkNodeType(shape["sh:node"]["@id"]);
		}
		else{
			result = shape;
		}
	}
	
	return shape;
}