/**
 * Handles routing the correct functions and making sure things display correctly for a device
 */

 /**
  * Wraps join network so as to refresh the page when finished
  */
function joinNetworkWrapper(device_token, network_id){
	moveDeviceToNetwork(device_token, network_id);
	setTimeout(function(){ NetworksListView(); }, 500);
}

 /**
  * Wraps leave network so as to refresh the page when finished
  */
function leaveNetworkWrapper(device_token){
	removeDeviceFromNetwork(device_token);
	setTimeout(function(){ NetworksListView(); }, 500);
}

/**
 * Wrapper to make a network on the network create page
 */
function Device_makeNetwork(element){
	//gets the name of the network input on the page
	var input = document.getElementById(element);
	console.log(input);
	if(input !== null){
		var name = input.value;
		if(name !== ''&&name!==null){
			//creates a network with this name
			alert("Created a network with name: "+name);
			createNetwork(name);
		}
		else{
			alert("Please enter a non-empty network name.");
			console.log("Device_makeNetwork recieved null parameters");
		}
	}
	else{
		alert("Please enter a non-empty network name.");
		console.log("Device_makeNetwork recieved null parameters");
	}
}