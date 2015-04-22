/**
 * Helper file for getting elements from simulation object which is stored in local storage and retrieved from the client
 * These have been all tested to ensure that they work correctly 
 */
/**
 * gets the list of partition id's for this current simulation
 */
function getAllPartitionIds(){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		//gets the partition list from the simulation
		var partition_list = local_simulation.partition_list;
		var list = [];
		//for each partition, get its unique ID
		for(var i = 0; i < partition_list.length; i++){
			list.push(partition_list[i]._id);
		}
		return list;
	}
	else{
		console.log("Error:getPartitionIds was passsed null parameters");
	}
}

/**
 * Returns a list of all partition objects in this simulation
 */
function getAllPartitionObjects(){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		//returns the list of partition objects
		return local_simulation.partition_list;
	}
	else{
		console.log("Error: getAllPartitionObjects was passed a null simulation object");
	}
}


/**
 * Returns the list of all network Id's in the simulation
 */
function getAllNetworkIds(){
	var local_simulation = get_local_simulation();
	//if the currently stored simulation is not null
	if (local_simulation!==null){
		//gets the list of partition objects from the simulation
		var partition_list = local_simulation.partition_list;
		var list = []; 
		//for each partition
		for (var i = 0; i < partition_list.length; i++){
			//gets the list of network objects from the partition
			var networks = partition_list[i].network_list
			for (var j = 0; j < networks.length; j++){
				//adds the id of that network to the list
				list.push(networks[j]._id);
			}
		}
		return list;
	}
	else{
		console.log("Error:getAllNetworkIds recieved null local_simulation");
	}
}

/**
 * Retrieves a list of all network objects in the simulation
 */
function getAllNetworkObjects(){
	var local_simulation = get_local_simulation();
	//if the current simulation object of the client is not null
	if (local_simulation!==null){
		//gets the list of partitions of that simulation
		var partition_list = local_simulation.partition_list;
		var list = []; 
		for(var i = 0; i < partition_list.length; i++){
			//gets the list of networks of that partition
			var networks = partition_list[i].network_list;
			for (var j = 0; j < networks.length; j++){
				//adds the network objects to the list
				list.push(networks[j]);
			}
		}
		return list;
	}
	else{
		console.log("Error:getAllNetworkObjects recieved null simulation object");
	}
}

/**
 * Retrieves a list of all network objects in the simulation
 */
function getAllNetworkObjects(simulation){
	if (simulation!==null){
		//gets the list of partition in that simulation
		var partition_list = simulation.partition_list;
		var list = []; 
		for(var i = 0; i < partition_list.length; i++){
			//gets the list of partitions in that simulation 
			var networks = partition_list[i].network_list;
			for (var j = 0; j < networks.length; j++){
				//adds the network to the list
				list.push(networks[j]);
			}
		}
		return list;
	}
	else{
		console.log("Error:getAllNetworkObjects recieved null simulation object");
	}
}

/**
 * Returns all of the tokens of the devices in this simulation
 */
function getAllDeviceTokens(){
	var local_simulation = get_local_simulation();
	if(local_simulation!==null){
		//gets the list of networks
		var networklist = getAllNetworkObjects();
		var list = [];
		for( var i = 0; i < networklist.length; i++){
			//for each device in the network
			var devicelist = networklist[i].device_list;
			for(var j = 0; j < devicelist.length; j++){
				//adds the token of that device to the list 
				list.push(devicelist[j].token);
			}
		}
		return list;
	}
	else{
		console.log("Error:getAllDeviceIds recieved null simulation object");
	}
}

/**
 * Retrieves all of the device objects in this simulation
 */
function getAllDeviceObjects(){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		var list=[];
		//gets all network objects for this simulation
		console.log(local_simulation);
		var network_list=getAllNetworkObjects(local_simulation);
		for (var i=0;i<network_list.length;i++){
			//gets the list of devices from each network
			var device_list=network_list[i].device_list;
			for (var j=0; j<device_list.length;j++){
				//adds each to the list
				list.push(device_list[j]);
			}
		}
		return list;
	}
	else{
		console.log("Error: getAllDeviceObjects was passed a null simulation object");
	}
}

/**
 * Returns the network object given the id of that network
 */
 function getNetworkObjectById(network_id){
 	var network_object=null;
 	//i'm not checking for null here, is that right?
 	var network_list=getAllNetworkObjects();
 	for (var i=0; i<network_list.length;i++){
 		if (network_list[i]._id ==network_id){
 			network_object=network_list[i];
 		}
 	}
 	return network_object;
 }

/**
 * Returns a particular partition object given its _id
 */
function getPartitionObjectById(partition_id){
 	var partition_object=null;
 	//gets the list of all partitions in this simulation
 	var partition_list=getAllPartitionObjects();
 	for (var i=0; i<partition_list.length;i++){
 		//find the partition with the same id in the list
 		if(partition_list[i]._id == partition_id){
 			partition_object=partition_list[i];
 		}
 	}
 	return partition_object;
 }

/**
 * Gets the device object given a device token
 */
function getDeviceObjectByToken(device_token){
 	var device_object=null;
 	//gets the list of all device objects in this simulation
 	var device_list=getAllDeviceObjects();
 	for (var i=0; i<device_list.length;i++){
 		//if the device has the same token, return that token.
 		if(device_list[i].token==device_token){
 			device_object=device_list[i];
 		}
 	}
 	return device_object;
 }

/**
 * Return all the device tokens within a particular network object
 */
function getDeviceTokensOfNetworkId(network_id){
	//gets the network by the token
	var network =getNetworkObjectById(network_id);
	if(network!==null){
		var list=[];
		//for each device in the network, return a list of their tokens
		for (var i=0; i<network.device_list.length;i++){
			var token= network.device_list[i].token;
			list.push(token);
		}
		return list;
	}
	else{
		console.log("Error: getNetworkObjectById returned null network object");
	}
}

/**
 * Returns all of the device objects within a particular network
 */
function getDeviceObectsOfNetworkId(network_id){
	//gets the network belonging to that network id
	var network =getNetworkObjectById(network_id);
	if(network!==null){
		return network.device_list;
	}
	else{
		console.log("Error: getNetworkObjectById returned null network object");
	}
}

/**
 * Returns the activity logs for this simulation
 */
function getSimulationActivityLogs(){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		return local_simulation.activity_logs;
	}
	else{
		console.log("Error:getSimulationActivityLogs was passed a null simulation object");
	}
}

/**
 * Returns the network id that a device is connected to
 */
function getNetworkIdOfDevice(device_token){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null&&device_token!==null){
		//get all the network objects in the simulation
		var list = getAllNetworkObjects();
		var network_id = '';
		//for each network get the list of devices in that network
		for(var i = 0; i < list.length; i++){
			var device_list = list[i].device_list;
			for(var j = 0; j < device_list.length; j++){
				//if the token of this device is the same, return the network id
				if(device_list[j].token == device_token){
					network_id = list[i]._id;
				}
			}
		}
		//it's fine if this is blank, as that indicates that the device is not in a network
		return network_id;
	}
	else{
		console.log("Error:getNetworkIdOfDevice recieved null parameters");
	}
}

/**
 * Returns the network object which contains a device
 */
function getNetworkObjectOfDevice(device_token){
	if(device_token!==null){
		//gets the list of networks from the current simulation
		var network_list = getAllNetworkObjects();
		var network_obj = null;
		for(var i = 0; i < network_list.length; i++){
			//gets the list of devices for each network
			var device_list = network_list[i].device_list;
			for(var j = 0; j < device_list.length; j++){
				if(device_list[j].token == device_token){
					//if the device tokens are the same, return that network object
					network_obj = network_list[i];
				}
			}
		}
		return network_obj;
	}
	else{
		console.log("Error:Error:getNetworkObjectOfDevice was passed null parameters");
	}
}

/**
 * Returns the unique id of the partition which a network is in.
 */
function getPartitionIdOfNetwork(network_id){
	//gets the current simulation of the client
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		//gets the list of partitions for this simulation
		var partition_list = local_simulation.partition_list;
		var partition_id = '';
		for(var i = 0; i < partition_list.length; i++){
			//for each network in the partition, check if matching ids, then return the id
			//of the partition containing it.
			var networks = partition_list[i].network_list;
			for(var j = 0; j < networks.length; j++){
				if(networks[j]._id == network_id){
					partition_id = partition_list[i]._id;
				}
			}	
		}
		//returning a null or empty partition_id means that the network is not in a partition
		return partition_id;
	}
	else{
		console.log("Error:getPartitionName was passed null parameters");
	}
}

/**
 * Returns the partition object that a network is in
 */
function getPartitionObjectOfNetwork(network_id){
	//gets the current simulation that the client is in
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		//gets list of partitions in this simulation
		var partition_list = local_simulation.partition_list;
		var partition_obj = '';
		for(var i = 0; i < partition_list.length; i++){
			//gets list of networks in this partition
			var networks = partition_list[i].network_list;
			for(var j = 0; j < networks.length; j++){
				//if the id of the network matches the id, then return the partition object containing it
				if(networks[j]._id == network_id){
					
					partition_obj = partition_list[i];
				}
			}
		}
		return partition_obj;
	}
	else{
		console.log("Error:getPartitionObjectOfNetwork was passed null parameters");
	}
}

/**
 * Returns the partition that a particular device is in
 */
function getPartitionIdOfDevice( device_id){
	if(device_id!==null){
		var Partition_id = '';
		//gets the network id containing this device
		var network_id =  getNetworkIdOfDevice(device_id);
		if(network_id !== ''){
			//gets the partition id of the partition containing the network
			Partition_id =  getPartitionIdOfNetwork(network_id);
		}
		//if empty string is returned, means the device is not in a network.
		return Partition_id;
	}
	else{
		console.log("Error:getPartitionIdFromDevice was passed null parameters");
	}
}

/**
 * Returns the unique Id of this simulation
 */
function getLocalSimulationId(){
	//gets the simulation object which the client is currently in
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		//returns the id of that simulation object
		return local_simulation._id;
	}
	else{
		console.log("Error:getLocalSimulationId passed null simulation object");
		return '';
	}
}

/**
 * Returns the event logs of this current simulation object 
 **/
function getLocalSimulationLogs(){
	var local_simulation = get_local_simulation();
	if (local_simulation!==null){
		return local_simulation.activity_logs;
	}
	else{
		console.log("Error:getLocalSimulationLogs passed null simulation object");
		return '';
	}
}

/**
 * Function to get the list of devices as a list of device ids and names
 * and whether of not the device has a particular application deployed to it
 */
function mapDevicestoApp( applications){
	var app_map = {};
	var device_apps;
	var bool;
	var devices; 
	var map
	
	for(index in applications){
		
		applications[index]['device_list'] = [] ;
		devices = getAllDeviceObjects();
		if(devices !== null){
			for(var i = 0; i < devices.length; i++){
				device_apps = devices[i].apps;
				deployed = false;
				for(var j = 0; j < device_apps.length; j++){
					if(device_apps[j]._id == applications[index]._id){
						deployed = true;
						
					}
				}
				if(deployed == true){
					applications[index]['device_list'].push({ 'name':  devices[i].current_device_name, 'device_token' : devices[i].token,  'deployed': true});
				}else{
					applications[index]['device_list'].push({ 'name':  devices[i].current_device_name, 'device_token' : devices[i].token, 'deployed': false});
				}
				
			}
		}
	}
	
	return applications;
}
