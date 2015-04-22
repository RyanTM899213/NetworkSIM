/**
 * modules we use
 */
var fs=require('fs');
var SimulationManager = require("./SimulationManager.js");
var simulationList = SimulationManager.simulationList;
var Util = require("../Utilities/utilities.js");
var App_Spec = require("../Model/App_Spec.js");

/**
 * the function to deploy an application to a particular device
 * @param event_data, the event_data for the call including the simulation_id, device_id and application to be deployed
 * @param time_stamp, the time this event occured on the client
 */
function deployApp( event_data, time_stamp ){
	//get the simulation from the simulation_id
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	if(simulation != -1){
		//get the device_id from the token in the event_data
		var device_id= event_data.device_token;
		//get the device given the device_id
		var device=Util.findByUniqueID(device_id,simulation.getDevices());
		if(device != -1){
			for(index in simulation.app_specs){
				if(simulation.app_specs[index]._id == event_data.app_id){
					//log a new activity in the simulation
					var new_activity = "The App " +  simulation.app_specs[index].specJSON.name +  " was deployed to device " + device.device_name  
					+ " at " + time_stamp + "\n";
					//update the log for the simulation
					simulation.updateSimulationLog(new_activity);
					//attach the application to the device
					device.attachAppSpec(simulation.app_specs[index].specJSON);
				}
			}
			//ave the simulation state
			SimulationManager.saveSimulationState( event_data.simulation_id, time_stamp, simulation);
		}
	}
}

/**
 * Function to reverse the deployment of an application to a device
 * @param event_data, contains information for the event such as simulation_id, device_id and application to be removed
 * @param time_stamp, the time stamp this occured on the client
 */
function reverse_deploymentApp( event_data, time_stamp ){
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	if(simulation != -1){
		var device_id= event_data.device_token;
		var device=Util.findByUniqueID(device_id,simulation.getDevices());
		if(device != -1){
			for(index in simulation.app_specs){
				if(simulation.app_specs[index]._id == event_data.app_id){
					
					var new_activity = "The App " +  simulation.app_specs[index].specJSON.name +  " was removed from device " + device.device_name  
					+ " at " + time_stamp + "\n";
					simulation.updateSimulationLog(new_activity);
					device.removeAppSpec(simulation.app_specs[index].specJSON);
				}
			}
			SimulationManager.saveSimulationState( event_data.simulation_id, time_stamp, simulation);
		}
	}
	
}

/**
 * Function to launch an app for a device
 * @param event_data, information for this event
 * @param time_stamp, the time stamp this occured on the client
 */
function launchApp( event_data, time_stamp){
	var simulation=Util.findByUniqueID(event_data.simulation_id,simulationList);
	if(simulation !== -1){
		for(index in simulation.app_specs){
			if(simulation.app_specs[index]._id == event_data.app_id){
				console.log("Request to launch app came in");
			}
		}
		
	}
	
}

/**
 * 
 * @param location, the location where the app is
 * @param simulation_id, the of the simulation the app is to be attached to
 * @param spec, 
 * @param time_stamp
 */
function attachApp( location, simulation_id, spec, time_stamp){
	var simulation=Util.findByUniqueID(simulation_id,simulationList);
	if(simulation !== -1){
		spec = JSON.parse(spec);
		var new_activity = "The App " +  spec.name +  " was imported into the simulation  at " + time_stamp + "\n";
		simulation.updateSimulationLog(new_activity);
		setTimeout(function(){
			
				console.log("About to import");
				var new_spec = App_Spec.createNewApp_Spec( spec);
				simulation.attachAppSpec(new_spec);
				simulation.importApp(new_spec);

		}, 2000);
		
		SimulationManager.saveSimulationState( simulation_id, time_stamp, simulation);
	}
	
	
}
module.exports.reverse_deploymentApp = reverse_deploymentApp;
module.exports.attachApp = attachApp;
module.exports.launchApp = launchApp;
module.exports.deployApp = deployApp;