/**
 * Functions for handling the drawing of the network topology
 */

var uniqueDataIndex=0;
//gets the canvas on which to draw ojects
var svgCanvas = document.querySelector('svg'),


//svg is required for the graphics
svgNS = 'http://www.w3.org/2000/svg',
//holds a list of all shapes on the page
shapes=[];

/**
 * Places the correct devices iwthin networks when generating the topology
 */
function connectDevicesToNetwork(deviceList,networkObject){
	var numDevices=deviceList.length;
	//the angle used to place the devices into the network
	var angle=2*Math.PI/numDevices;
	var connectedDevice;
	var i=0;
	for(device in deviceList){
		//creates a device shape on the topology
		connectedDevice=createObjectWithin(40,angle*i,networkObject.x,networkObject.y,createDeviceGraphicAt);
		//attaches the device to the network
		attachChild(networkObject,connectedDevice);
		//sets the name of the device for viewing
		connectedDevice.name=deviceList[device].current_device_name;
		//connects the device shape to the device object
		connectedDevice.represents=deviceList[device];
		//draw that device on the canvas
		connectedDevice.draw();
		connectedDevice.connected=true;
		i++;
	}
}

/**
 *creates a network graphic on the canvas
 */
function createNetworkGraphic(){
	return createNetworkGraphicAt(100,500);
}

/**
 * creates a device graphic on the canvas
 */
function createDeviceGraphic(){
	return createDeviceGraphicAt(50,50);
}

/**
 * function which creates a new network graphic on the canvas
 */
function createNetworkGraphicAt(xPosition, yPosition){
	var  network=new circle(xPosition, yPosition, 60, svgCanvas, 'network');
	shapes[uniqueDataIndex]=(network);
	uniqueDataIndex++;
	return network;
}

/**
 * function which creates a new device graphic on the canvas
 */
function createDeviceGraphicAt(xPosition, yPosition){
	var device=new circle(xPosition, yPosition, 10, svgCanvas, 'device');
	shapes[uniqueDataIndex]=(device);
	device.connected=false;
	uniqueDataIndex++;
	return device;
}

/**
 * function which creates a new partition graphic on the canvas between two networks
 */
function createPartitionGraphic(sourceNetwork, destinationNetwork){
	//creates a connection line between the two networks
	var connection=new line(sourceNetwork.x,sourceNetwork.y,destinationNetwork.x, destinationNetwork.y,svgCanvas,'network-connection');
	shapes[uniqueDataIndex]=(connection);
	sourceNetwork.connections[uniqueDataIndex]=destinationNetwork;
	destinationNetwork.connections[uniqueDataIndex]=sourceNetwork;
	uniqueDataIndex++;
}

/**
 * function which removes a partition line between two networks
 */
function removePartition(sourceNetwork,destinationNetwork){
	var index=sourceNetwork.connections.indexOf(destinationNetwork);
	//removes the connection between the two networks in both networks
	delete destinationNetwork.connections[index];
	delete sourceNetwork.connections[index];
	//removes the actual line from the canvas
	var oldLine=shapes[index];
	svgCanvas.removeChild(oldLine.element);
	delete shapes[index];
}

/**
 * attaches a child device to a parent within the svg canvas
 */
function attachChild(parentShape, childShape){
	var index=shapes.indexOf(childShape);
	parentShape.children[index]=childShape;
	//change the class of the element to be a connected device to apply css
	childShape.element.classList.add('connected-device');
	index=shapes.indexOf(parent);
}

/**
 * function which creates a new network graphic on the canvas
 */
function createObjectWithin(radius,angle,centerX,centerY,createFunction){
	var xpos=radius*Math.sin(angle);
	var ypos=radius*Math.cos(angle);
	var graphic=createFunction(centerX+xpos,centerY+ypos);
	return graphic;
}

/**
 * Clears all shapes from the svg canvas
 */
function clearCanvas(){
	var svgCanvas = document.querySelector('svg');
	if(svgCanvas !== undefined){
		//removes all elements from the canvas
		while (svgCanvas.lastChild) {
			svgCanvas.removeChild(svgCanvas.lastChild);
		}
	}
	//clears the shapes list
	shapes=[];
}

/**
 * Orders the canvas to ensure that devices are on top, followed by networks.
 */
function orderCanvas(){
	//makes sure networks are below devices
	for (index in shapes){
		if(hasClass(shapes[index].element, 'network')==true&&shapes[index]!=null){
			svgCanvas.appendChild(shapes[index].element);
			svgCanvas.appendChild(shapes[index].displayName);
		}
	}
	//makes sure devices are on top of everything except for objects which the user is currently dragging
	for (index in shapes){
		if(hasClass(shapes[index].element, 'device')==true&&shapes[index]!=null){
			svgCanvas.appendChild(shapes[index].element);
			svgCanvas.appendChild(shapes[index].displayName);
		}
	}
	//orders held objects on top
	for (index in shapes){
		if(hasClass(shapes[index].element, 'held-object')==true&&shapes[index]!=null){
			svgCanvas.appendChild(shapes[index].element);
			svgCanvas.appendChild(shapes[index].displayName);
			//order the children devices
			for (var i =0; i<shapes[index].children.length;i++){
				if(shapes[index].children[i]!= null)
					svgCanvas.appendChild(shapes[index].children[i].element);
			}
		}
	}
	
}

/**
 * Finds the partition ID of a given network shape object
 */
function findPartitionIDForNetwork(networkObject){
	for (var index=0;index<displayed_partition_list.length;index++){
		var networks = displayed_partition_list[index].network_list;

		for(var netindex=0;netindex<networks.length;netindex++){

			if(networks[netindex]._id==networkObject._id){
				return displayed_partition_list[index]._id;
			}
		}
	}
	return -1;
}
/****
 * Algorithm for generating the topology given a partition_list object to display all of the devices, networks, 
 * and partitions of the topology.
 ***/
function generateTopology(partition_list, areaWidth){
	console.log(partition_list);

	//clears the canvas, before redrawing everything
	clearCanvas();
	var positioningRadius,numPartitions,rootXY;
	var networkIndex=0;
	var root,connected,connectedDevice;
	
	//holds all of the partitions which actually exist, and are not just partitions containing devices not in any network
	var realPartitions=getRealPartitions(partition_list);
	console.log(realPartitions);
	//holds all of the devices not in any networks
	var free_list=getAllFreeDevices(partition_list);
	console.log(free_list);
	numPartitions=realPartitions.length;
	//radius for positioning shapes in the topology
	positioningRadius=areaWidth/(numPartitions+1);
	rootXY=positioningRadius;
	
	//position each partition
	for(partition in realPartitions){
		
		var network_list=realPartitions[partition].network_list;
		var angle=Math.PI/network_list.length;
		//for each network in the partition
		for(network in network_list){
			//if this is the first network in the partition, use it as the root
			//then create a star shaped pattern around the network in the partition
			if(networkIndex==0){
				root=createNetworkGraphicAt(rootXY,rootXY);
				root.name=network_list[network].network_name;
				console.log(network_list[network]);
				root.represents=network_list[network];
				connectDevicesToNetwork(network_list[network].device_list,root);
			}
			//otherwise, create the networks in a star shaped pattern around the root network
			else{
				connected=createObjectWithin(positioningRadius*3/4,networkIndex*angle,rootXY,rootXY,createNetworkGraphicAt);
				connected.name=network_list[network].network_name;
				connected.represents=network_list[network];
				createPartitionGraphic(root,connected);
				connectDevicesToNetwork(network_list[network].device_list,connected);
			}
			networkIndex++;
		}
		
		rootXY+=positioningRadius;
		networkIndex=0;
		
	}
	var distance=areaWidth/(1+free_list.length);
	var freeDevice;
	//finally place all of the devices not in any network
	for(var i=0;i<free_list.length;i++){
		freeDevice=createDeviceGraphicAt(distance*(i+1),20);
		freeDevice.represents=free_list[i];
		freeDevice.name=free_list[i].current_device_name;
		freeDevice.draw();
	}
	displayed_partition_list=partition_list;
}

/****
 * Mouseover function for the GUI, displays the name of a device or network when hovered over
 ****/
function mouseOver(e){
	e = e || event;
	//gets the object which was moused over
	if (event.type == 'mouseover'){
		var fromElem = e.fromElement || e.relatedTarget;
		var toElem = e.srcElement || e.target;
	}
	else if (e.type == 'mouseout'){
		fromElem = e.srcElement || e.target;
		toElem = e.toElement || e.relatedTarget;
	}
	//stringifies the name of the node which was moused over
	function toString(el) { 
		return el ? (el.id || el.nodeName) : 'null' ;
	}
	//if moved onto a circle element, display the name of that circle element
	if(toString(toElem) == "circle"){
		circleElem=shapes[toElem.getAttribute('data-index')];
		circleElem.nameVisible=true;
		circleElem.draw();
	}
	//if moved off of that circle element, remove the name of that circle element.
	if(toString(fromElem) == "circle"){
		circleElem=shapes[fromElem.getAttribute('data-index')];
		circleElem.nameVisible=false;
		circleElem.draw();
	}
}
//adds the mouse listener to the document
document.onmouseover = mouseOver;
document.onmouseout = mouseOver;