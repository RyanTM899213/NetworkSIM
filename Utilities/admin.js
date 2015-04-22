

function importRDT(rdtName){
  // Import a replicated data type to use in the simulation

  /* The RDT will have a common interface like the following after you import
   * it:
   *
   *   rdt.init(networkIterator, deviceIterator); // initiate the RDT type with your
   *   networkIterator from the simulation
   *
   * For a simple integer counter RDT, it will also have methods to increment
   * and get the value of the counter, e.g.:
   *
   *   rdt.inc(); // increment the integer counter by one
   *   rdt.val(); // get the current value of the counter
   */
}

function removeRDT(rdtName){
  // Remove the RDT from the simulation
}

function importApp(appName){
  // Import and initialize your web application in the simulation
}

function removeApp(appName){
  // Remove the application from the simulation
}

function addNetwork(networkName, networkKind){
  // Add a network with the given name and kind to the simulation
	var Network = new Network(networkName, networkKind)
}

function removeNetwork(networkName){
	
	deviceList.add(Network);
  // Remove a network with the given name from the simulation
}

function addDevice(deviceName){
	var Device = new Device(deviceName)
	Simulation.addDevice()
  // Add a device with the given name to the simulation
}

function removeDevice(deviceName){
  // Remove a device with the given name from the simulation
}

function addPartition(partitionName){
	  // Add a partition with the given name to the simulation
}

function removePartition(partitionName){
	  // Remove a partition with the given name from the simulation
}



exports.importRDT = importRDT;
exports.importApp = importApp;
exports.addNetwork = addNetwork;
exports.removeNetwork = removeNetwork;
exports.addDevice = addDevice;
exports.removeDevice = removeDevice;
