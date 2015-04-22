/**
 * Functions which handle the client recieving and sending information to the server;
 */

 //holds the socket connection to the server
var socket = io.connect();
//boolean specifying whether the client is connected to the server currently
var connected = false;

/***
 * Handles sending the current event queue from the client to the server
 */
function syncWithServer(){
	var route = '/getSync';
	var event_data = '';
	//gets the stored event queue on the client
	local_events = get_local_events();
	if(local_events == null){
		//if the event queue is null create a new one
		event_data = JSON.stringify(newEventQueue());	
	}
	else{
		//stringify the event queue for sending
		var event_data = JSON.stringify(local_events);
	}	
	//emit the event queue to our listening socket server
	socket.emit(route, event_data );
}



/**
 * Callback function for receiving a new application state object (all information we need from the server)
 */
socket.on('syncState', function(appState){
	//reset the current event queue after sending an item
	clearEventQueue();
	//if the application state (appstate) is not null
	if(appState !== null){
		console.log(appState);
		//stores all of the information from the appstate
		store_local_simulation(appState.simulation);
		store_local_device(appState.device);
		store_local_simulation_list(appState.simulation_list);
		console.log(" This devices_id is " + appState.device._id );
	}
	else{
		console.log('recieved null object from server');
	}
});

/**
 * Function for recieving simulation history information from the server
 */
socket.on('syncHistory',  function(appHistory){
	if( isEmpty(appHistory) == false){
		//stores the simulation history for retrieval
		store_local_history(appHistory);
		console.log(appHistory);
	}else{
		console.log('recieved empty object from server for simulation history');
	}
});



/**
 * validate_user verifies whether the token input by the user is valid or not
 */
socket.on('validate_user', function(data){
	object = data;
	console.log(data);
	//if the authentication was a success
	if(object.Response == 'Success'){
		alert('You have been authenticated. \nPlease wait to be redirected');
		//sync with the server and redirect to the simulation
		syncWithServer();	
	}
	else{
		alert('Token invalid \nPlease enter the correct token for this simulation')
	}
});


/**
 * Creates the socket connection between the server and the client
 */
socket.on('connect', function () {
	console.log('Socket is connected.');
	connected = true;
	syncWithServer();
	//sets the view of the page to the list of simulations
	simulationListView();
});

/**
 * Handles disconnecting from the connection with the server
 */
socket.on('disconnect', function () {
	connected = false;
	location.reload();
	
	  console.log('Socket is disconnected.');
});