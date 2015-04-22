var Util=require("../Utilities/utilities.js");
var Network=require("./Network.js");
var DevModel = require("../Database/dbModels/userModel.js");

function Device(deviceName,token, simulation_name , email){
	
	//Required variables//
	this.device_name=deviceName;
	
	//Our Variables//
	this.networkObject=Network.createNewNetwork('','');
	this.networks_created = [];
	this.rdts = [];
	this.token=token;
	this.deviceJSON = {};
	this._id= token;

	
	//Required Functions//
	this.joinNetwork=joinNetwork;
	this.leaveNetwork=leaveNetwork;
	this.replicateRDT=replicateRDT;
	this.accessRDT=accessRDT;
	this.accessRDTByName = accessRDTByName;
	this.attachAppSpec = attachAppSpec;
	this.removeAppSpec = removeAppSpec;
	
	//Our Functions//
	this.attachJSON=attachJSON;
	this.updateDeviceLog = updateDeviceLog;

	
}


function createNewDevice(deviceName,token, simulation_id, email){
	var createdDevice = new Device(deviceName,token, simulation_id ,email);
	var deviceJSON = new DevModel();
	
	deviceJSON.current_device_name=deviceName;
	deviceJSON.current_simulation = simulation_id;
	deviceJSON.admin = false;
	deviceJSON.verified = false;
	deviceJSON.current_partition = '';
	deviceJSON.current_network = '';
	deviceJSON.activity = '';
	deviceJSON.email = deviceName;
	deviceJSON.token = token;
	createdDevice.deviceJSON=deviceJSON;

	createdDevice.networkObject.addDevice(createdDevice);
	deviceJSON.save();

	return createdDevice;
}

function loadDeviceFromDatabase(deviceID){
	var createdDevice = new Device('');
	DevModel.findOne({_id: deviceID}, function(err,deviceJSON){
		if(!err){
		 createdDevice.attachJSON(deviceJSON);
		}
	});
	return createdDevice;
}

function attachJSON(deviceJSON){
	this.deviceJSON=deviceJSON;
	this.device_name=deviceJSON.current_device_name;
	this.token=deviceJSON.token;
	this._id=deviceJSON.token;
};


function joinNetwork(network){

	  if(this.networkObject!=network){

		this.networkObject.removeDevice(this);
		  
		this.networkObject = network;
		this.deviceJSON.current_partition=network.partitionObject._id;
		this.deviceJSON.current_network=network._id;
		this.deviceJSON.save();
	}
};
  
function leaveNetwork(network){

	  var network = Network.createNewNetwork('','');
	  this.deviceJSON.current_network= '';
	  this.deviceJSON.current_partition= '';

	  network.device_list.push(this);
	  network.networkJSON.device_list.push(this.deviceJSON._id);
	  network.networkJSON.markModified('device_list');
	  this.networkObject=network;
	  this.deviceJSON.current_partition = network.partitionObject._id;
	  this.deviceJSON.current_network = network.id;

	  this.deviceJSON.save();
	  network.networkJSON.save();
};

//This is supposed to make the device join the network it used to be in. idk lol
function returnNetwork(){
};
 
function replicateRDT(rdt){
	  this.rdts.push(rdt);
	  //this.deviceJSON.rdts.push(rdt)
	  this.deviceJSON.save();
};

//acces an rdt by name
function accessRDTByName(rdt_name){
	var test = null;
	for(var i = 0; i < this.rdts.length; i++){
		
		if(this.rdts[i].constructor.name === rdt_name) {
			test =  this.rdts[i];
		}
		
	}
	return test;
};

function attachAppSpec( app_specJSON){
	this.deviceJSON.apps.push(app_specJSON._id);
	 this.deviceJSON.save();
}

function removeAppSpec( app_specJSON){
	var index = this.deviceJSON.apps.indexOf(app_specJSON._id);
	if(index !== -1){
		this.deviceJSON.apps.splice(index, 1);
	}
	 this.deviceJSON.save();
}


function accessRDT(){
    // Access the previously registered replicated data type in the device
	var index = this.rdts.length-1;
	return this.rdts[index];
};



function updateDeviceLog(new_activity){
	this.deviceJSON.activity += new_activity;
	this.deviceJSON.save();
}


module.exports.createNewDevice = createNewDevice;
module.exports.loadDeviceFromDatabase=loadDeviceFromDatabase;
