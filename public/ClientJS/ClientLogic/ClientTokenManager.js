/**
 * Handles tokens on the client side
 */

/**
 * Attaches a token to the user.
 * local_device is the device for this user which is stored in local storage
 */
function attachToken(new_token){
	//gets the current device of the user
	var local_device = get_local_device();
	if(local_device !== null){
		//adds a token to the user
		local_device.token = new_token;
		//puts the local device information in storage
		putinStorage( 'device', JSON.stringify(local_device) );
	}
	else{
		console.log("Local device does not exist");
	}
}

/**
 * authToken sends a token to the server to be authenticated
 * @token: a token code given by the user
 */
function authToken(token, id){
	var timestamp = new Date();
	//sets the body of the message to the server to be the token
	var body = {'token': token, 'simulation_id': id, 'time_stamp' : timestamp};
	params = JSON.stringify(body);
	//adds the event to the event queue
	updateLocalEventsToken(token);
	updateLocalEventsSimulationId(id);
	//sends the token to be validated by the server
	socket.emit('/authenticate/authToken', params);
	setTimeout( function(){ simulationListView(); }
	, 1000 );
}

/**
 *Gets whether the user has been verified from the local storage
 */
function getVerified(){
	var local_device = get_local_device();
	return local_device.verified;
}



/**
 * Only used in the registration page.
 * authenticate gets the token from the token input field on the registration page
 */
function authenticate(){
	//gets the token from the html
	var input = document.getElementsByName('tokenvalue')[0];
	var token = input.value;
	var id = document.getElementById('simulation_id_div').value;
	//sends the token to be verified
	authToken(token, id);
}