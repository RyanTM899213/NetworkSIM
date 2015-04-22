/*************************************************
 * Getter methods for the local device object 
 **************************************************/

/**
 * Gets the token from the local device stored on the client
 */
function getLocalDeviceToken(){
	var local_device = get_local_device();
	//if the local device exists
	if(local_device!==null && local_device !== undefined){
		//return the token
		return local_device.token;
	}
	else{
		return '';
		console.log("Error: getLocalDeviceToken passed a null local_device");
	}
}

/**
 * Returns whether the device of the user is verified or not
 */
function getVerified(){
	var local_device = get_local_device();
	//if the device has been verified, return this
	if(local_device!==null){
		if(local_device.hasOwnProperty('verified')){
			return local_device.verified;
		}else{
			return false;
		}
	}
	else{
		console.log("Error: getVerified passed a null local_device");
	}
}

/**
 * Returns the unique token of the current device
 */
function getLocalDeviceToken(){
	var local_device = get_local_device();
	//if the local device exists, return the id
	if(local_device!==null && local_device !== undefined){
		return local_device.token;
	}
	else{
		console.log("Error: getLocalDeviceToken passed a null local_device");
	}
}

/**
 * Returns the logs for the local device
 */
function getLocalDeviceLogs(){
	var local_device = get_local_device();
	//returns the activity of the local device
	if(local_device!==null){
		return local_device.activity;
	}
	else{
		console.log("Error:getLocalSimulationLogs passed null simulation object");
		return '';
	}
}