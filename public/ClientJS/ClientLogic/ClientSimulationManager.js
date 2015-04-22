/**
 * Code for managing simulation objects on the client side
 */

/**
 * CreateSimulation creates a new simulation in the application.
 */
function CreateSimulation(){
	if(verifyNoDuplicateFields()&&checkParametersWereEntered()){
		//deactivates the create simulation button
		document.getElementById('button-create-simulation').onclick=null;
		//creates the event to send to the server
		var body = wrapCreateSimulation();
		var url = "/create/Simulation";
		var timestamp = new Date();
		//adds the event to the event queue
		addToEventQueue(url, body, timestamp);
		//loads the view of all created simulations
		setTimeout( function(){ simulationListView(); }
		, 1000 );
	}
}

/**
 * Wraps values and generates the config map and other data required for creating a simulation
 * @returns create_simulation, the new simulation object created
 */
function wrapCreateSimulation() {
	//gets the parameters of the new simulation to create
	var simulation_name = document.getElementById('simulation_name').value;
	var num_devices = document.getElementById('num_devices').value;
	var num_networks = document.getElementById('num_networks').value;
	var tokenMethod = document.getElementById('tokenmethod').value;
	var config_div = document.getElementById('config-map');
	var string = generateConfigMap(1, 'config-map');

	//creates the create simulation object with this information
	var create_simulation = {};
	create_simulation.num_devices = parseInt(num_devices);
	create_simulation.num_networks = parseInt(num_networks);
	create_simulation.simulation_population = 0;
	create_simulation.simulation_name = simulation_name;
	create_simulation.globalcount = 0;
	create_simulation.tokenMethod = tokenMethod;
	create_simulation.config_map = JSON.parse(string);
	create_simulation.config_map['freelist'] = {};
	create_simulation.activity_logs = '';
	
	console.log(create_simulation);
	//returns the simulation information to be added to the event
	return create_simulation;
}


/**
 * Function to get the states associates from a simulation 
 */
function getSimulationHistory(simulation_id){
	console.log(simulation_id);
	//creates the body of the event to send to the server
	var param = { 
			'token' : getLocalDeviceToken(),
			'simulation_id': simulation_id,
			};
	params = JSON.stringify(param);
	var url = '/get/History';
	//sends the request to be validated by the server
	socket.emit(url, params);
	setTimeout( function(){ eventLogsView(); }
	, 1000 );
	
}


var incr = 0;
/** 
 * Generates the fields on the create simulation page for the user to populate 
 * and create a new simulation.
 * 
 * @param level, the level of the field to insert
 * @param start_element, the starting HTML element
 * @returns {String}, the rendered JSON stringified config map
 */
function generateConfigMap(level, start_element){
	switch(level){
		//if the level is partition
		case 1:
			//gets all the partitions from the input field 
			var partitions = getAllPartitionsInputField();
			//creates the simulation map with the inputted parameters
			var simulation_map = '{';	
			for (var i = 0; i < partitions.length; i++){
				var partition_name = partitions[i].value;
				start_element = getGrandParentElement(partitions[i]);
				if( i == partitions.length - 1){
					simulation_map +=  '"' + partition_name + '": {' + generateConfigMap(2, start_element) + '}';
				}else{
					simulation_map +=  '"' + partition_name + '": {' + generateConfigMap(2, start_element) + '},';
				}
			}
			//returns the simulation map as an object
			return simulation_map + '}' ;
			break;
		//if the level is network
		case 2:
			//gets all inputted networks
			var networks = getAllNetworksInputField(start_element);
			//generates the simultion map
			var simulation_map = '';	
			for (var i = 0; i < networks.length; i++){
				//for each network, generates the information needed to be added to the simulation map
				var network_name = networks[i].value;
				simulation_map  += '"' + network_name + '" : {';
				start_element = getGrandParentElement(networks[i]);
				if( i == networks.length - 1){
					simulation_map +=  generateConfigMap(3, start_element) + '} ';
				}else{
					simulation_map +=  generateConfigMap(3, start_element) + '}, ';
				} 
			}
			return simulation_map;
			break;
		//if the level is device
		case 3:
			//gets all of the inputted devices
			var devices = getAllDevicesInputField(start_element);
			//creates an empty simulation map
			var simulation_map = '';		
			//fills the simulation map with the device
			for (var i = 0; i < devices.length; i++){
				incr += 1;	
				var device_name = devices[i].value;
				if( i == devices.length - 1){
					simulation_map +=  '"' + device_name + '": ' + incr  ;
				}else{
					simulation_map +=  '"' + device_name + '": ' + incr  + ',' ;
				}
			}
			return simulation_map;
			break;
	}
}

/*
 *checks if the parameters to creating a simulation were input correctly.
 */
function checkParametersWereEntered(){
	//gets each of the elements
	var num_devices=document.getElementById('num_devices').value;
	var simulation_name=document.getElementById('simulation_name').value;
	var num_networks=document.getElementById('num_networks').value;
	var token_method=document.getElementById('tokenmethod').value;
	//checks that each of the elements were entered correctly
	if(!isInt(num_devices)||num_devices==null||num_devices==''){
		alert("Please enter an integer value for the number of devices.");
		return false;
	}
	if(!isInt(num_networks)||num_networks==null||num_networks==''){
		alert("Please enter an integer value for the number of networks.");
		return false;
	}
	if(simulation_name==null||simulation_name==''){
		alert("Please enter a name for the simulation.");
		return false;
	}
	if(token_method==''||token_method==null){
		alert("please enter a token method.");
		return false;
	}
	if(avail_networks>0){
		alert("Please create all networks.");
		return false;
	}
	if (avail_devices>0){
		alert("Please create all devices.");
		return false;
	}
	return true;
}

/** Function to get all the partition input fields in the document
 * referencing the fields by class name and returning the DOM list
 * @return partiton_elements, the DOM list of input fields.
 */
function getAllPartitionsInputField(){
	var config_map = document.getElementById('config-map');
	var partition_elements = config_map.getElementsByClassName('partition');
	return partition_elements;
}

/** Function to get all the network input fields in the document
 * referencing the fields by class name and returning the DOM list
 * @return network_elements, the DOM list of input fields.
 */
function getAllNetworksInputField(partition){
	var network_elements = partition.getElementsByClassName('network');
	return network_elements;
}

/** Function to get all the device input fields in the document
 * referencing the fields by class name and returning the DOM list
 * @return device_elements, the DOM list of input fields.
 */
function getAllDevicesInputField(network){
	var device_elements = network.getElementsByClassName('device');
	return device_elements;
}

/**
 * Verifies that none of the entered names are duplicate or empty
 */
function verifyNoDuplicateFields(){
	//holds all of the names of partitions inputted into the create simulation
	var partition_names=[];
	//holds all of the names of networks inputted into the create simulation
	var network_names=[];
	//holds all of the emails of devices inputted into the create simulation
	var device_emails=[];
	//gets all partition fields in the page
	var list_of_partitions = getAllPartitionsInputField();
	//gets all of the values entered for the partition names
	for (var i = 0;i<list_of_partitions.length;i++){
		name = list_of_partitions[i].value;
		if (name == ""||name==null){
			alert("Please fill in all partition names.");
			return false;
		}
		partition_names.push(name);
	}
	//checks to make sure there are no duplicate names for partitions
	if (arrayContainsDuplicates(partition_names)){
		alert("Please ensure that all partition names are unique.");
		return false;
	}
	//gets a list of all network fields in the page
	var list_of_networks = getAllNetworksInputField(document.getElementById('config-map'));
	//gets all of the values entered for the network names
	for (var i=0;i<list_of_networks.length;i++){
		name = list_of_networks[i].value;
		if (name == ""||name==null){
			alert("Please fill in all network names.");
			return false;
		}
		network_names.push(name);
	}
	//checks to make sure there are no duplicate names for networks
	if (arrayContainsDuplicates(network_names)){
		alert("Please ensure that all network names are unique.");
		return false;
	}
	//gets a list of all device fields in the page
	var list_of_devices = getAllDevicesInputField(document.getElementById('config-map'));
	//gets all of the values entered for the device emails
	for (var i=0;i<list_of_devices.length;i++){
		name = list_of_devices[i].value;
		if (name == ""||name==null){
			alert("Please fill in all device emails.");
			return false;
		}
		device_emails.push(name);
	}
	//checks to make sure there are no duplicate emails for devices
	if (arrayContainsDuplicates(device_emails)){
		alert("Please ensure that all device emails are unique.");
		return false;
	}

	return true;
}