/**
 * Modules we use
 */
var fs=require('fs');
var SimulationManager = require("./SimulationManager.js");
var simulationList = SimulationManager.simulationList;
var Util = require("../Utilities/utilities.js");
var RDT_Spec = require("../Model/RDT_Spec.js");

/**
 * function to attach and RDT to the simulation
 * @param location, the location where the RDT is located on the server
 * @param simulation_id, the id of the simulation this occurs in
 * @param spec, the specification of the RDT to be imported
 */
function attachRDT( location, simulation_id, spec){
	var time_stamp = new Date().toISOString();
	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	if(simulation !== -1){
		spec = JSON.parse(spec);
		var new_activity = "The RDT " +  spec.name +  " was imported into the simulation at  " + time_stamp + "\n";
		simulation.updateSimulationLog(new_activity);
		
		setTimeout(function(){
					//require the rdt in our simulation
					var rdt = require(location + "/" + spec['main']);
					simulation.importRDT(rdt);
					 console.log("About to import");
					//attach the specs for the RDT into the simulation
					var new_spec = RDT_Spec.createNewRDT_Spec( spec);
					simulation.attachRDTSpec(new_spec);

		}, 2000);
		//save the state
		SimulationManager.saveSimulationState( simulation_id, time_stamp, simulation);
	}
	
}

/**
 * Function to manipulate a given RDT
 * @param event_data, the event_data contains information for the device to be manipulated, the rdt name and method and simulation_id
 * @param time_stamp, the time_stamp this occured on
 * @returns , the new value of the RDT
 */
function manipulateRDT(event_data, time_stamp){
	
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	var device_id = event_data.device_id;
	var rdt_name = event_data.name;
	var rdt_method = event_data.method;
	var val = 'Not available';
	
	if(simulation !== -1){
		//get the devices from the simulation
		var deviceList = simulation.getDevices();
		//get the device specified in the device_id
		var device = Util.findByUniqueID(device_id,deviceList);
		if(device !== -1){
			var activity = " Device " + device.device_name + " manipulated the RDT " + rdt_name + " performing an " + rdt_method + " at " + time_stamp + "\n";
			device.updateDeviceLog(activity);
			simulation.updateSimulationLog(activity);
			//get the RDT from the device
			var RDT = device.accessRDTByName(rdt_name);
			if(RDT !== null){
				RDT[rdt_method]();
				val =  RDT.val();
			}
		}else{
			console.log("Device was not found for manipulating the RDT");
		}
		//save the simulation state
		SimulationManager.saveSimulationState( event_data.simulation_id, time_stamp, simulation);
		
	}
	
	return val;

}

module.exports.attachRDT = attachRDT;
module.exports.manipulateRDT = manipulateRDT;
