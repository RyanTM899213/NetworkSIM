/**
 * New node file
 */

var connected = false;


function manipulateRDT(rdtName, method, fntoCall){
	var local_device = get_local_device();
	var simulation = get_local_simulation();
	var token = local_device.token;
	var timestamp = new Date();
	var route = '/manipulate/RDT';
	var event_data = {'name' : rdtName, 'method' : method, 'device_id' : token, 'simulation_id' : simulation._id};
	
	var event = {'event_data' : event_data, 'timestamp' : timestamp, 'token' : token, 'simulation_id' : simulation._id};
	event = JSON.stringify(event);
	
	send2Server(route, event, fntoCall );
}


/**
 * Ajax section for javascript
 * Bundles all of the event data and sends it to the server to handle.
 */
send2Server = function(url, params, callback)
{
	
    var request = new XMLHttpRequest();
    if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
    	
		request=new XMLHttpRequest();
		
	}else{// code for IE6, IE5
		
    	request=new ActiveXObject("Microsoft.XMLHTTP");
    	
    }
    request.onreadystatechange = function()
    {
        if (request.readyState == 4 && request.status == 200)
        {
        	var obj = JSON.parse(request.responseText);
            callback(obj['new_val']); // Another callback here
        }else{
        	//alert("Please wait")
        	
        }
    }; 
    request.open('POST', url);
    request.send(params);
}


/**
 * getFromStorage gets an item from the local storage on the device by id
 * @param id: the key of the element to retrieve from local storage
 */
function getFromStorage(id){
	return localStorage.getItem(id);
}

/**
 * get the device for this user from the local storage
 */
function get_local_device(){
	return JSON.parse(getFromStorage('device'));
}

/** 
 * Gets the list of all the names of simulations from local storage
 */
function get_local_simulation(){
	return JSON.parse(getFromStorage('simulation'));
}
