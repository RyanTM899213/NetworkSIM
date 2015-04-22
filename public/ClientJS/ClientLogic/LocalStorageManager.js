/**
 * Functions to handle interacting with the local storage on the client
 */

/**
 * getFromStorage gets an item from the local storage on the device by id
 * @param id: the key of the element to retrieve from local storage
 */
function getFromStorage(id){
	return localStorage.getItem(id);
}

/**
 * putinStorage puts an item into local storage under a key
 * @param id: the key under which to store the item in local storage
 * @param item: the item to store in local storage
 */
function putinStorage(id, item){
	if( id !== null && item !== null){
		localStorage.setItem(id, item);
	}
}

/**
 * clears the local storage
 */
function clearStorage(){
    localStorage.clear();
}


/************************************************************
 * 					Getters
 * ************************************************************/

/**
 * get the device for this user from the local storage
 */
function get_local_device(){
	return JSON.parse(getFromStorage('device'));
}

/** 
 * Gets the list of all the names of simulations from local storage
 */
function get_local_simulation_list(){
	return JSON.parse(getFromStorage('simulation_list'));
}

/** 
 * Gets the list of all the names of simulations from local storage
 */
function get_local_simulation(){
	return JSON.parse(getFromStorage('simulation'));
}

/**
 * Returns the event queue from session storage
 */
function get_local_events(){
	return JSON.parse(getFromStorage('localevents'));
}

/**
 * Returns the event queue from session storage
 */
function get_local_history(){
	return JSON.parse(getFromStorage('simulation_history'));
}

/**********************************************************
 * 				Modifiers
 * *****************************************************/

/**
 * Stores a simulation object in the local storage of the client
 */
function store_local_simulation(new_simulation){
	putinStorage( 'simulation', JSON.stringify(new_simulation));
}


/**
 * Stores a device objet in the local storage of the client
 */
function store_local_device(new_device){
	putinStorage( 'device', JSON.stringify(new_device));
}

/**
 * Stores a list of current simulation ids in the local storage of the client
 */
function store_local_simulation_list(new_simulation_names){
	putinStorage( 'simulation_list', JSON.stringify(new_simulation_names));
}

/**
 * Stores a new event queue in the local storage of the client
 */
function store_local_events(new_events){
	putinStorage( 'localevents', JSON.stringify(new_events));
}

/**
 * Stores a new simulation history in the local storage of the client
 */
function store_local_history(new_events){
	putinStorage( 'simulation_history', JSON.stringify(new_events));
}