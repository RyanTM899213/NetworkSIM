
//sets the origin of the interact js topology 
var origin = {x: 0, y: 0};
var mouse = {x: 0, y: 0};
var waitTime=800;
//adds the mouse listener to interact with the topology
document.addEventListener('mousemove', function(e){ 
    mouse.x = e.clientX || e.pageX; 
    mouse.y = e.clientY || e.pageY;
}, false);

/****
 * -------------------
 * Object Interactions (using interact.js)
 * --------------------
 ****/

/**
 * Handles interaction between device objects in the topology
 */
interact('.device')
	//allows the device objects in the topology to be moved
	.draggable({
		//allows the device object to have inertia
	    inertia: true,
	    
	  	//restricts the device to be inside the canvas
	    restrict:{
	        restriction: "parent",
	        endOnly: true,
	        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	    },
	    //when starting to move the device object
	    onstart: function(event){
	    	if(interactable){
				//adds class to make sure object you are moving is on top 
				var shape = getShapeFromEvent(event);
				shape.element.classList.add('held-object');
			}
		},
		//while moving the device object
		onmove: function (event) {
			if(interactable){
				//gets the circle from the list of shapes
				var shape = getShapeFromEvent(event);
				moveUIElementAndChildren(shape, event.dx,event.dy);
			}
		},
		//when finished dragging the device object
		onend: function(event){
			if(interactable){
				//stops ensuring that object is ontop after dropped
				var shape = getShapeFromEvent(event);
				//removes the class saying that the device is held
				shape.element.classList.remove('held-object');
				orderCanvas();
				if(shape.connected==false){
					console.log("Disconnecting device!");
					removeDeviceFromNetwork(shape.represents.token);
				}
			}
		},
	});

/**
 * Handles moving a network object in the topology view
 */
interact('.network')
	//allows device and network objects interact with network objects when dropped onto them
	.dropzone({
		//things which can interact with a network object
		accept: '.device, .network', 
		//the overlap necessary to interact with a network object
		overlap: 0.7,
		// when one of the accepted objects is being moved
		ondropactivate: function(event){
			if(interactable){
				//adds the classes to distinguish where you can drop the object being moved
				event.target.classList.add('drop-locations');
			}
		},
		//when an accepted object moves within this object, change the css
		ondragenter: function (event) {
			if(interactable){
			    var draggableElement = event.relatedTarget,
			        dropzoneElement = event.target;
			    	
			    if (draggableElement.classList.contains('device')){
				    dropzoneElement.classList.add('drop-target');
				    draggableElement.classList.add('connected-device');
				    var device=getRelatedShapeFromEvent(event);
				    device.connected=true;

			    }
			}
		},
		//when an accepted object leaves this object, remove the distinguishing css
		ondragleave: function (event) {
			if(interactable){
				event.target.classList.remove('drop-target');
				event.relatedTarget.classList.remove('connected-device');
				var network=getShapeFromEvent(event);
				var networkIndex=event.target.getAttribute('data-index');
				var device=getRelatedShapeFromEvent(event);
				var deviceIndex=event.relatedTarget.getAttribute('data-index');
				delete network.children[deviceIndex];
				device.connected=false;
			}
		},

		//when an accepted object is dropped into this object
		ondrop: function (event) {
			if(interactable){
				var draggableElement=event.relatedTarget;
				var dropzoneElement=event.target;
				var dragClass=draggableElement.classList[0];
				
				var dropzone=getShapeFromEvent(event);
				var dragged=getRelatedShapeFromEvent(event);
				//if the object dropped into the network is a device
				if(dragClass==='device'){
					//attach the device to the network
					attachChild(dropzone,dragged);
					dragged.connected=true;
					//get infromation about the objects
					deviceName=shapes[draggableElement.getAttribute('data-index')].name;
					newNetworkName=shapes[dropzoneElement.getAttribute('data-index')].name;
					//sends a message to the server that the device was moved to the network
					moveDeviceToNetwork(dragged.represents.token,dropzone.represents._id);
					//waits for the response from the server to update the topologys
					setTimeout(updateTopology(shapes,get_local_simulation().partition_list),waitTime);
				}
			}
			//if the object being dragged in is a network
			if(dragClass==='network'){
				if(interactable){
					var circleDragging = shapes[draggableElement.getAttribute('data-index')];
					var circleDraggedTo = shapes[dropzoneElement.getAttribute('data-index')];
					
					//if these two networks are not in this partition
					if(!partitionExists(dropzone,dragged)){
						//create a partition graphic between the two objects
						var partition=createPartitionGraphic(dropzone,dragged);
						//gets the id of both partitions
						var partitionA = findPartitionIDForNetwork(dropzone.represents);
						var partitionB = findPartitionIDForNetwork(dragged.represents);
						if(partitionA!=partitionB){
							//merge the two partitions and send the information to server
							mergePartition(partitionA,partitionB);
							//update the topology when the server has sent information back
							setTimeout(updateTopology(shapes,get_local_simulation().partition_list),waitTime);
						}
					}
					//otherwise if there is a partition between the two networks
					else{
						var oldpartitionID=findPartitionIDForNetwork(dragged.represents);
						//removes the partition between the two
						removePartition(dropzone,dragged);

						var newpartitionlist=breadthFirstSearch(dropzone,dragged);
						var connected=false;
						for(partition in newpartitionlist){
							if(newpartitionlist[partition]==dragged){
								connected=true;
							}
						}

						if(!connected){
							var list = [];
							//creates the list of networks to break off from the partition
							for(var i=0;i<newpartitionlist.length;i++){
								list.push(newpartitionlist[i].represents);
							}
							//sends the message to the server to divide the partition
							dividePartition(list,oldpartitionID);
							//renders the topology with the servers response
							setTimeout(updateTopology(shapes,get_local_simulation().partition_list),waitTime);
						}
					}
					//returns the network back to its original location
					snapToLocation(dragged,origin);
				}
			}
		
		},
		//when a drop is possible, change the css between the objects
		ondropdeactivate: function (event) {
			if(interactable){
				event.target.classList.remove('drop-locations');
			    event.target.classList.remove('drop-target');
			}
		},
	})
	//allows a network to be moved
	.draggable({
			//gives the network object inertia
		    inertia: true,
		    
		    //restricts network to be inside the canvas
		    restrict:{
		        restriction: "parent",
		        endOnly: true,
		        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
		    },
			//allow the network object to be moved by updating the graphic
			onmove: function (event) {
				if(interactable){
					var shape = getShapeFromEvent(event);
					moveUIElementAndChildren(shape,event.dx,event.dy);
					updatePartitionLines(shape);
				}
			},
			//when the movement starts, update the object to be the held object so that it is on top
			onstart: function(event){
				if(interactable){
			    	var shape = getShapeFromEvent(event);
					origin.x=shape.x;
					origin.y=shape.y;
					
					//adds class to make sure object you are moving is on top 
					var shape = getShapeFromEvent(event);
					shape.element.classList.add('held-object');
				}
			},
			//when the movement has ended
			onend: function(event){
				if(interactable){
					//stops ensuring that object is ontop after dropped
					var shape = getShapeFromEvent(event);
					shape.element.classList.remove('held-object');
					orderCanvas();
				}
			},
		});

/****
 * --------
 * Checks and updaters
 * ---------
 ****/


/**
 * Moves a shape and all of its children to a specific location
 */
function snapToLocation(shape,coordinates){
	//decides on the location to move the shape
	var xdiff=(shape.x-coordinates.x);
	var ydiff=(shape.y-coordinates.y);
	//moves the shape
	shape.x=coordinates.x;
	shape.y=coordinates.y;
	//moves all of the shapes attached to that shape
	for(index in shape.children){
		var child=shape.children[index];
		child.x-=xdiff;
		child.y-=ydiff;
		child.draw();
	}
	//update the partition lines connecting that shape
	updatePartitionLines(shape);
	//redraw the shape
	shape.draw();
	
}

/**
 * Redraws the partition lines between networks
 */
function updatePartitionLines(networkShape){
	//update all the partitions including this network
	for(index in networkShape.connections){
		var connectedNetwork=networkShape.connections[index];
		var theLine=shapes[index];
		//update the line position and redraw it
		theLine.update(networkShape.x,networkShape.y,connectedNetwork.x,connectedNetwork.y);
		theLine.draw();
	}
}

/**
 * checks if an element has a certain class
 */
function hasClass(element, Elclass) {
    return element.classList.contains(Elclass);
}

/**
 * Move a topology object and all of its children
 */
function moveUIElementAndChildren(UIShape,dx,dy){
	//sets the location of the shape
	UIShape.x +=dx;
	UIShape.y += dy;
	//moves all of the children of the shape
	for(index in UIShape.children){
		UIShape.children[index].x+=dx;
		UIShape.children[index].y+=dy;
		UIShape.children[index].draw();
	}
	//redraws the shape
	UIShape.draw();
}

/**
 * Checks if a partition line exists between two network shapes in the topology
 */
function partitionExists(dropzoneObject, dragObject){
	var index=dropzoneObject.connections.indexOf(dragObject);
	return index>-1;
}

/**
 * Gets a shape from a manipulation event of the topology
 */
function getShapeFromEvent(event){
	var index=event.target.getAttribute('data-index');
	return shapes[index];
}

/**
 * get the shape in the related event of the topology event 
 */
function getRelatedShapeFromEvent(event){
	var index=event.relatedTarget.getAttribute('data-index');
	return shapes[index];
}