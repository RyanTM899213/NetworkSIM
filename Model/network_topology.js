var networkList = Simulation.getNetworks();
//Required
this.deviceList = Simulation.getDevices();

var partitionList;


/****
 * Required
 ****/
function NetworkIterator(){
	networkList = Simulation.getNetworks();
	
  this.index=0;
  //Required
  this.first = function() {
    return networkList[0];
  };
  //Required
  this.next = function() {
	  var network=networkList[index];
	  index++;
	  return network;
  };
  //Required
  this.hasNext = function() {
    return this.index<networkList.length;
  };
  //Required
  this.reset = function() {
    this.index=0;
  };
  //Required
  this.each = function(callback) {
    for (var item = this.first(); this.hasNext(); item = this.next()) {
      callback(item);
    }
  };
}

/****
 * Required
 ****/
function DeviceIterator(){
	
	this.index=0;
  //Required
  this.first = function() {
	  return deviceList[0];
  };
  //Required
  this.next = function() {
	  var device=deviceList[index];
	  index++;
	  return device;
  };
  //Required
  this.hasNext = function() {
	  return this.index<deviceList.length;
  };
  //Required
  this.reset = function() {
	  this.index=0;
  };
  //Required
  this.each = function(callback) {
	  for (var item = this.first(); this.hasNext(); item = this.next()) {
	      callback(item);
	    }
  };
}

/****
 * Required
 ****/
function Network(networkName, networkKind){
  //Required
  this.networkName = networkName; // String
  //Required
  this.networkKind = networkKind; // Constant: WiFi, GSM
  //Required
  this.deviceIterator = new DeviceIterator(); // Returns an iterator that provides Device objects
  
  this.partition={};
  this.deviceList=[];
  
  //Required
  this.addDevice = function(device){
  };

  //Required
  this.removeDevice = function(device){
  };
  //Required
  this.connectNetwork = function(network){
  };
  //Required
  this.disconnectNetwork = function(network){
   
  };
  
}

/****
 * Required
 ****/


function Device(deviceName){
	this.token = '';
	this.networkObject={};
	this.device_name  = '';
	this.rdt = {};
	this.deviceJSON={};
 
  //Required
  this.joinNetwork = function(network){};
  //Required
  this.leaveNetwork = function(network){};
  //Required
  this.returnNetwork = function(){
    // Make the device re-join a previous network
  };
  //Required
  this.replicateRDT = function(rdt){
    // Register a replicated data type in the device
  };
  //Required
  this.accessRDT = function(){
    // Access the previously registered replicated data type in the device
  };
}

function Partition(partitionName, simulationName){
	
	this.partition_name=partitionName;
	this.networks=[];
	this.simulation_name=simulationName;
	
	this.addNetwork=function(network){};
	this.removeNetwork=function(network){};
	this.mergePartition=function(partition){};
	this.dividePartition=function(network,partition){};
}


exports.NetworkIterator = NetworkIterator;
