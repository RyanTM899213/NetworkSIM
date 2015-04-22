/**
 * Code for managing applications on the client side
 */


/**
 * Function which deploys a specific app to devices in the simulation
 */
function DeployApp(app_id, device_token){
	var local_simulation = get_local_simulation();
	if(local_simulation!==null){
		//creates the event to add to the event queue telling the server to deploy the app
		var params = { 
				'device_token' : device_token,
				'app_id': app_id, 
				'simulation_id': local_simulation._id,
				};
		var url = '/deploy/App';
		var timestamp = new Date();
		//add the event to the event queue
		addToEventQueue(url, params, timestamp);
		alert("App has been deployed this device");
		setTimeout(function(){
			adminAppsView();
		},1000);
	}
	else{
		console.log("local simulation was passed null parameters");
	}
}

function reverseDeployApp(app_id, device_token){
	var local_simulation = get_local_simulation();
	if(local_simulation!==null){
		//creates the event to add to the event queue telling the server to deploy the app
		var params = { 
				'device_token' : device_token,
				'app_id': app_id, 
				'simulation_id': local_simulation._id,
				};
		var url = '/reverse/deploy/App';
		var timestamp = new Date();
		//add the event to the event queue
		addToEventQueue(url, params, timestamp);
		setTimeout(function(){
			adminAppsView();
		},1000);
		alert("App will be removed to from this device");
	}
	else{
		console.log("local simulation was passed null parameters");
	}
}

/**
 * Function which launches an application on the client side
 */
function  LaunchApp(app_id){
	var local_simulation = get_local_simulation();
	//gets the applications in the local simulations
	var apps = local_simulation.apps;
	
	if(local_simulation!==null){
		//creates the event to add to the event queue telling the server to launch the app for this device
		var params = { 
				'app_id': app_id, 
				'simulation_id': local_simulation._id,
				};
		var url = '/launch/App';
		var timestamp = new Date();
		//add the event to the event queue
		addToEventQueue(url, params, timestamp);
		//launch the view app page with this application
		ViewApp(app_id);
		
	}
	else{
		console.log("local simulation was passed null parameters");
	}
}