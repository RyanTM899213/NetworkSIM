var Util=require("../Utilities/utilities.js");
var Network=require("./Network.js");
var Partition=require("./Partition.js");
var SimModel = require("../Database/dbModels/simulationModel.js");
var App = require("./App_Spec.js");
var RDT = require("./RDT_Spec.js");
var NetworkIterator = require("./Iterators/NetworkIterator.js");
var DeviceIterator = require("./Iterators/DeviceIterator.js")
var SimM = require('mongoose').model("Sim");
function Simulation(simulation_name){

	//variables
	
	this.partition_list = [];
	this.device_list=[];
	this.network_list=[];
	this.networkIterator = new NetworkIterator(this.network_list);
	this.deviceIterator = new DeviceIterator(this.device_list);
	this.apps = [];
	this.rdts = [];
	this.app_specs = [];
	this.rdt_specs = [];
	
	this.simulationJSON = {};
	
	
	//admin.js stuff
	this.importRDT=importRDT;
	this.importApp=importApp;
	this.removeApp=removeApp;

	//functions
	this.getNetworks=getNetworks;
	this.getDevices=getDevices;
	this.addPartition=addPartition;
	this.addDevice=addDevice;
	this.addNetwork=addNetwork;
	this.removeNetwork=removeNetwork;
	this.attachRDTSpec = attachRDTSpec;
	this.attachAppSpec = attachAppSpec;
	this.mergePartitions = mergePartitions;
	this.attachJSON =attachJSON;
	this.updateSimulationLog = updateSimulationLog;
	this.attachNetworkIterator = attachNetworkIterator;
	this.attachDeviceIterator = attachDeviceIterator;
}

function createNewSimulation(simulation_name){
	var createdSimulation = new Simulation(simulation_name);
	var simulationJSON = new SimModel();

	simulationJSON.simulation_name = simulation_name;
	simulationJSON.num_devices = 0;
	simulationJSON.num_networks = 0;
	simulationJSON.simulation_population = 0;
	simulationJSON.activity_logs = '';
	createdSimulation._id=simulationJSON._id;

	createdSimulation.simulationJSON=simulationJSON;
	createdSimulation.attachJSON(simulationJSON);
	simulationJSON.save();
	return createdSimulation;
}

function loadSimulationFromJSON(simulationJSON){
	var createdSimulation= new Simulation('');
	createdSimulation.attachJSON(simulationJSON);
	
	for(var index=0;index<createdSimulation.simulationJSON.partition_list.length;index++){

		var createdPartition=Partition.loadPartitionFromDatabase(createdSimulation.simulationJSON.partition_list[index]);
		createdSimulation.partition_list.push(createdPartition);

	}

	for(var index =0; index<createdSimulation.simulationJSON.apps.length ;index++){
		
		App.loadAppSpecFromDatabase(createdSimulation.simulationJSON.apps[index], function(createdApp){
			createdSimulation.app_specs.push(createdApp);
			
		});
		
	}

	
	
	return createdSimulation;
}

function attachDeviceIterator(new_list){
	this.deviceIterator = new DeviceIterator(new_list);
	
}

function attachNetworkIterator( new_list){
	this.networkIterator = new NetworkIterator(new_list);
}


function attachJSON(simulationJSON){
		this.simulation_name=simulationJSON.simulation_name;
		this.simulationJSON=simulationJSON;
		this._id=simulationJSON._id;
};

function importRDT(rdt){
		this.rdts.push(rdt);
		this.deviceIterator.index = 0;
		this.networkIterator.index = 0;
		rdt.init( this.networkIterator, this.deviceIterator);
}

function attachAppSpec( appSpec){
	this.simulationJSON.apps.push(appSpec.specJSON._id);
	this.app_specs.push(appSpec);
	this.simulationJSON.save();
}

function attachRDTSpec( rdtSpec){
	this.simulationJSON.rdts.push(rdtSpec.specJSON._id);
	this.rdt_specs.push(rdtSpec);
	this.simulationJSON.save();
}
	
function importApp(app){
		this.apps.push(app);	
		
}
	
function removeApp(app){
		var index = this.apps.indexOf(app);
		if (index > -1) {
		    this.apps.splice(index, 1);
		}
		
}



function getNetworks(){
		var merged = [];
		for(var i = 0; i < this.partition_list.length; i++){

			var Networks = this.partition_list[i].network_list;

			for( var j = 0 ; j < Networks.length; j++){
				merged.push(Networks[j]);
			}
							
		}  
		return merged;
}

function getDevices(){
		var merged = [];
		for(var i = 0; i < this.partition_list.length; i++){

			var Networks = this.partition_list[i].network_list;

			for( var j = 0 ; j < Networks.length; j++){
					var Devices = Networks[j].device_list;
					for (var k =0 ; k<Devices.length; k++){
						merged.push(Devices[k]);
					}
			}
							
		}
		return merged;
		
}

function addPartition(partition){
		
		this.partition_list.push(partition);
		this.simulationJSON.partition_list.push(partition.partitionJSON._id);
		this.simulationJSON.markModified('partition_list');
		this.simulationJSON.save();
} 
	

function addDevice(device){
	device.deviceJSON.simulation_name = this.simulationJSON.simulation_name;
	this.device_list.push(device);
	this.simulationJSON.num_devices++;
	device.deviceJSON.save();
	this.simulationJSON.save();
}

function addNetwork(network){

	var partition= Partition.createNewPartition(this.simulationJSON.simulation_name, network.network_name);
	this.partition_list.push(partition);
	partition.addNetwork(network);
	this.network_list.push(network);
	this.simulationJSON.partition_list.push(partition.partitionJSON._id);
	this.simulationJSON.markModified('partition_list');
	this.simulationJSON.num_networks++;
	this.simulationJSON.save();
}

function removeNetwork(network){
	var devices=network.device_list;
	for(device in devices){
		network.removeDevice(devices[device]);
	}
	network.partitionObject.removeNetwork(network);
	this.simulationJSON.num_networks--;
	this.simulationJSON.save();
		
}

function mergePartitions(partitionA,partitionB){
	for(var index=0;index<this.partition_list.length;index++){

		if(this.partition_list[index]._id==partitionB._id){
			this.partition_list.splice(index,1);
			//console.log(this.simulationJSON.partition_list);
			partitionA.mergePartitions(partitionB);
			break;

		}
	}

	var index=this.simulationJSON.partition_list.indexOf(partitionB._id);

	if(index!==-1){


		this.simulationJSON.partition_list.splice(index,1);
		console.log(this.simulationJSON.partition_list);


	}
	//this.simulationJSON.markModified('partition-list');
	this.simulationJSON.save();
}

function updateSimulationLog(new_activity){
	this.simulationJSON.activity_logs += new_activity;
	this.simulationJSON.save();
}



module.exports.createNewSimulation=createNewSimulation;
module.exports.loadSimulationFromJSON=loadSimulationFromJSON;
