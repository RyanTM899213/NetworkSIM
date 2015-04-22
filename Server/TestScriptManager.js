/**
 * New node file
 */
var SimulationManager = require("./SimulationManager.js");
var RDTManager = require("./RDTManager.js");
var simulationList = SimulationManager.simulationList;
var Util = require("../Utilities/utilities.js");

//instance variables
var script_rdts;
var device_mobility;
var moves;
var operations;
var frequency;

var deviceList;
var networkList; 
var partitionList;

/**
 * Function to initialize a test script for running in our simulation
 * @param simulation_id, the id the simulation the script is to be tested on
 * @param spec, the specification of the script
 * @param time_stamp, the time the script the uploaded
 */
function init(simulation_id, spec, time_stamp){
	console.log(simulation_id);
	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	//checks that we have a valid simulation to uses
	if(simulation !== -1){
		//get devices and networks
		console.log()
		partitionList = simulation.partition_list;
		var spec = JSON.parse(spec);
		
		//log the loading of the script
		var new_activity = "Test Script " + spec.name + " was loaded on the simulation at " + time_stamp + "\n";
		simulation.updateSimulationLog(new_activity);
		
		//gather the parameters from the script
		var parameters = spec.parameters;
		script_rdts = parameters.rdts;
		device_mobility = parameters.device_mobility;
		renderMoves();
		operations = parameters.operations;
		
		frequency = Math.floor(moves / operations);
		runScript(simulation);
		
	}
}

/**
 * Function to perform the actual running of the test script
 * @param simulation
 */
function runScript(simulation){
	//local variables for the function
	var ran_network;
	var ran_device;
	var ran_partition;
	var ran_rdt;
	var counter = 0;
	//get the device list and network list of the simulation
	deviceList = simulation.getDevices();
	networkList = simulation.getNetworks();
	//boolean for splitting a partition
	var partitionSplit = true;
	console.log("Device Moves is " + moves);
	//iterates of the script while there are valid operations and device movements to be made
	while ( moves > 0 && operations > 0){
		counter++;
		//get a random network and device
		ran_network = Util.randomElement( networkList );
		console.log(ran_network + "Hellow" +  ran_device);
		ran_device = Util.randomElement( deviceList );
		console.log(networkList + "Hello Again" + deviceList);
		//make sure everything is ok
		if(ran_network !== undefined && ran_device !== undefined && simulation !== undefined){
			
			var event_data = wrapDeviceMover( ran_device, ran_network, simulation);
			var time_stamp = new Date().toISOString();
			//add device to a network
			SimulationManager.addDeviceToNetwork(event_data, time_stamp);
			console.log("ran_device is " + ran_device.device_name + " ran_network is " + ran_network.networkName);
			//ensure we are at the right frequency for manipulating RDTs and partitions
			if((counter % frequency) === 0){
				
				console.log("Counter is now " + counter + " Frequency is set at" + frequency);
				ran_rdt = Util.randomElement(script_rdts);
				event_data = wrapRDTManipulator(ran_device, ran_rdt, simulation)
				RDTManager.manipulateRDT(event_data, time_stamp);
				operations--;
				//split the partitions is required
				if(partitionSplit){
					
					var ran_partition1 = Util.randomElement(partitionList);
					var ran_partition2 = Util.randomElement(partitionList);
					if(ran_partition1 !== undefined && ran_partition2 !== undefined  ){
						
						if(ran_partition1 !== ran_partition2){
							
							event_data = wrapPartitionMerge(ran_partition1, ran_partition2, simulation);
							SimulationManager.mergePartitions(event_data, time_stamp);
						}
					}
					partitionSplit = false;
				//otherwise merge partitions if required
				}else{
					
					ran_partition = Util.randomElement(partitionList);
					if(ran_partition !== undefined ){
						
						if(ran_partition.network_list.length > 1){
							
							var ran_network = Util.randomElement( ran_partition.network_list );
							
							if(ran_network !== undefined){
								
								event_data = wrapPartitionDivider( ran_network, ran_partition, simulation);
								SimulationManager.dividePartition(event_data, time_stamp);
							}
						}
					}
					partitionSplit = true;
				}
				
			}
		}
		
		moves--;
		
		//if(counter > 500) break;
	}
	
	
}

/**
 * Function to wrap the event data for moving a device to a network
 * @param device, the device to be moved
 * @param network, the networks the device will be moved to
 * @param simulation, the simulation this occurs in
 * @returns event_data, the event data wrapped
 */
function wrapDeviceMover( device, network, simulation){
	var event_data = {}
	event_data.network_id = network._id;
	event_data.device_token = device.token;
	event_data.simulation_id = simulation._id;
	return event_data;
	
}

/**
 * Function to wrap the RDT manipulator for manipulating the device
 * @param device, the device which RDT is to be manipulated
 * @param rdt_element, the rdt to be manipulated
 * @param simulation, the simulation this occurs in
 * @returns the event_data wrapped up
 */
function wrapRDTManipulator(device, rdt_element, simulation){
	var event_data = {};
	event_data.simulation_id = simulation._id;
	event_data.device_id = device.token;
	event_data.name = rdt_element.name;
	event_data.method = rdt_element.method;
	return event_data;
}

/**
 * Function to wrap the event_data for merging networks
 * @param partitiona, the first partiton to be merged
 * @param partitionb, the second partition to be merged
 * @param simulation, the this occurs in
 * @returns the event_data wrapped up
 */
function wrapPartitionMerge(partitiona, partitionb, simulation){
	var event_data = {};
	event_data.partition_a_id = partitiona._id;
	event_data.partition_b_id = partitionb._id;
	event_data.simulation_id = simulation._id;
	return event_data;
}

/**
 * FUnctiont o wrap the event_data for dividing partitions, removing a network from a partition
 * @param network, the network to be removed
 * @param partition, the partition that will have a network removed
 * @param simulation, the simulation this occurs in
 * @returns the event_data wrapped up
 */
function wrapPartitionDivider( network, partition, simulation){
	var event_data = {};
	event_data.split_networks_list = [ network];
	event_data.partition_id = partition._id;
	event_data.simulation_id = simulation._id;
	return event_data;
}

/**
 * Function to render the moves based on device mobility
 */
function renderMoves(){
	switch(device_mobility) {
	case 'high':
		moves = 40;
		break;
	case 'meduim':
		moves = 20;
		break;
	case 'low':
		moves = 10;
		break;
	default:
		break;
	
	}
}

module.exports.init = init;