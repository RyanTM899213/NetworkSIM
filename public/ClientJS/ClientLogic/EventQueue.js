/**
 * Handles all functionality of the event queue on the client side
 **/

/**
 * Initializes the local_events, which will hold all of the events
 * which occur on this device. This list will be sent to the server
 * to be handled and recorded. This is stored in the JSON format.
 */ 
function newEventQueue(){
	//fills the new event queue object
	var queue = {};
	queue.token = '';
	queue.eventQueue = [];
	queue.simulation_id = '';
	store_local_events(queue);
	return queue;
}


/**
 * addToEventQueue adds an event to the event queue of this device to be sent to the server.
 * @route: is how the server should handle this event in the form of a URL
 * @event_data: is the data which accompanies this event
 * @timeStamp: is the time at which this event occurred
 */
function addToEventQueue(route, event_data, time_stamp){
	//gets the events stored on the client
	var local_events = get_local_events();
	if(local_events == null){
		local_events = newEventQueue();
	}
	//creates the query to the server
	var query = {'route': route, 'event_data' : event_data, 'time_stamp': time_stamp}
	local_events.eventQueue.push(query);
	local_events.token = getLocalDeviceToken();  
	local_events.simulationId = getLocalSimulationId();
	//stores the events on the client
	store_local_events(local_events);
	if(connected == true){
		//sends the events to the server
		syncWithServer();
	}
}

/**
 * updates the token used to identify the event queue for the client
 */
function updateLocalEventsToken(token){
	//gets the events
	var local_events = get_local_events();
	//sets the token to the token of the user
	local_events.token = token;
	//returns the new object to the local storage.
	store_local_events(local_events);
}

/**
 * Updates the unique id (token) used to identify the event queue from the client
 */
function updateLocalEventsSimulationId(id){
	//gets the events
	var local_events = get_local_events();
	if(local_events == null){
		local_events = newEventQueue();
	}
	//sets the token to the token of the user
	local_events.simulation_id = id;
	//returns the new object to the local storage.
	store_local_events(local_events);
}


/**
 * Clears the event queue for the client
 */
function clearEventQueue(){
	//gets the local events
	local_events = get_local_events();
	if(local_events !== null){
		//empties the event queue
		local_events.eventQueue = [];
		store_local_events(local_events);
	}
	else{
		//if null, create a new event queue 
		local_events = newEventQueue();
	}
}