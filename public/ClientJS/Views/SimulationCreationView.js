/**
 * Handles displaying and interacting with the page where you can create new simulations
 */

//holds the number of networks
var netnumbers = 0;
//holds the number of devices
var devicenumbers = 0;
//holds the number of available left to fill
var avail_networks = 0;
//holds the number of devices availablle to fill
var avail_devices = 0;
//holds the number of network fields created on the page
var created_network_field=0;
//holds the number of device fields created on the page
var created_device_field=0;
 

/**
 * expandField expands the section to allow you to add networks and devices
 * @param selector: the field in which to expand (ie devices, networks, etc)
 */
function expandField(selector){
	var number = selector.value;
	if(!isInt(number)||number<0){
		number=0;
	}
	//if changed the number of networks allowed for this simulation
	if (selector.name == 'netnumbers'){
		if(number<created_network_field){
			var error=document.getElementById('input-num-error');
			error.innerHTML='invalid number of networks, please delete some fields.';
		}
		else{
			netnumbers = number-created_network_field;
			var error=document.getElementById('input-num-error');
			error.innerHTML='';
		}
	}
	//if changed the number of devices allowed for this simulation
	if( selector.name == 'devicenumbers'){
		if(number<created_device_field){
			var error=document.getElementById('input-num-error');
			error.innerHTML='invalid number of devices, please delete some fields.';
		}
		else{
			devicenumbers = number-created_device_field;
			var error=document.getElementById('input-num-error');
			error.innerHTML='';
		}
	}
	//displays the number of networks and devices left to be added
	generateConfigTable();
}

/**
 * Check to make sure that an element is entered in this field
 */ 
function checkField(elem){
	if(elem.value == null){
		alert('Please enter a value.');
	}
}

/**
 * generateConfigTable creates the table for which to configurate
 * a new simulation.
 */
function generateConfigTable(){
	avail_networks = netnumbers;
	avail_devices = devicenumbers;
	//displays the number of available devices and networks to be added to the simulation
	document.getElementById('avail-devices').innerHTML = avail_devices;
	document.getElementById('avail-networks').innerHTML = avail_networks;
	if( avail_devices >0 && avail_networks > 0 ){
		var add_buttons = document.getElementsByClassName('partition-adder');
		//allows buttons to be pressed
		enableButtons(add_buttons);
	}
	
	
}

/**
 * updateavailableField updates the available number of devices
 * and networks.
 */
function updateavailableField(){
	document.getElementById('avail-devices').innerHTML = avail_devices;
	document.getElementById('avail-networks').innerHTML = avail_networks;
}
/**
 * addtoConfigTable inserts a new element in to the page allowing you to create a new partition, network, and device
 */
function addtoConfigTable(insert_point, name, element){
	if( insert_point == null || element == null) return false;
	//the html to insert into the page
	var html = '';
	element.disabled = false;
	var div = null;
	switch(name){
		//if a network field should be entered
		case 'Network':
			if( avail_networks > 0){
				div = createTrElement();
				avail_networks -= 1;
				netnumbers-=1;
				//generate a network field to put into the page
				html = generateNetworkTable();
				created_network_field+=1;
			}
			else{
				//otherwise, if no available networks left, disable the button
				element.disabled = true;
			}
			break;
		//if a device field should be inserted
		case 'Device':
			if( avail_devices >0 ){
				div = createTrElement();
				//generate the html for the device field to be put into the page
				html = generateDeviceClass();
				avail_devices -= 1;
				devicenumbers-=1;
				created_device_field+=1;
			}
			else{
				//otherwise disable the button
				element.disabled = true;
			}
			break;
		//if a partition field should be put into the page
		case 'Partition':
			if(avail_networks > 0 ){
				div = createTableElement();
				//generate the html for the partition field
				html = generatePartitionTable();
				avail_networks -= 1;
				netnumbers-=1;
				created_network_field+=1
			}
			else{
				//otherwise disable the button
				element.disabled = true;
			}
			break;
		default:		
	}
	//insert the element into the page
	if( div !== null){
		div.innerHTML = html;
		parent_of_insert = insert_point.parentNode;
		parent_of_insert.insertBefore(div, insert_point);
	}
	updateavailableField();	
}

/**
 * registerNewEmail creates a location on the page to enter a new 
 * email to be registered with the server
 * @param e: not sure what e is
 * @param insert_point: The point in the DOM tree at which to enter the element
 */
function registerNewEmail(e, insert_point){

	var email = document.getElementById('new_email').value;
	var newemail = "<td> <input type = 'checkbox' name = 'email[]' value = '" + email + "'> " + email + " </td> ";

	//create a dummy email element	
	var dummyelement = createTrElement();
	dummyelement.innerHTML = newemail;
	parent_of_insert = insert_point.parentNode;
	parent_of_insert.insertBefore(dummyelement, insert_point);
	//gets the value of the email
	var email = document.getElementById('new_email').value = '';
}

/**
 * deletefromConfigTable delete a field from the table. 
 * @param delete_point
 * @param name: what kind of field we are deleting from the table
 */
function deletefromConfigTable(delete_point, name, map){
	if( delete_point == null || map == null) return false;
	var html;
	element = document.getElementById(map);
	switch(name){
		//if it is a network field which should be deleted
		case 'Network':
			//remove all device fields following this network field
			removeDevices(delete_point);
			//updates the number of available networks
			avail_networks += 1;
			netnumbers+=1;
			created_network_field-=1;
			//enable the button to add new network fields
			var add_buttons = element.getElementsByClassName('net-adder');
			enableButtons(add_buttons);
			break;
		//if a device field should be deleted
		case 'Device':
			//updates the number of available devices field
			avail_devices += 1;
			devicenumbers+=1;
			created_device_field-=1;
			//enable the button to add new device fields
			var add_buttons = element.getElementsByClassName('device-adder');
			enableButtons(add_buttons);
			break;
		//if a partition field should be deleted
		case 'Partition':
			//remove all network fields within this partition field
			removeNetworks( delete_point);
			var add_buttons = element.getElementsByClassName('partition-adder');
			enableButtons(add_buttons);
			break;
		default:
					
	}
	//delete the html object
	var parent_of_delete = delete_point.parentNode;
	parent_of_delete.removeChild(delete_point);
	//handles deleting up-most table object if the element being deleted is a partition
	if (name == 'Partition'){
		var grand_parent;
		for (var i=0;i<3;i++){
			grand_parent=parent_of_delete.parentNode;
			grand_parent.removeChild(parent_of_delete);
			parent_of_delete=grand_parent;
		}
	}
	updateavailableField();
}

/** Function to remove devices from the configuration table
 * @param element: the element to be removed.
 */
function removeDevices( element){
	var allDevices = element.getElementsByClassName('device');
	for(var i = 0; i < allDevices.length; i++){
		avail_devices += 1;
		created_device_field-=1;
		console.log("created-device-field:"+created_device_field);
	}
}

/** 
 * Function to remove a network from the configuration table
 * @param element: the node cluster to be removed
 */
function removeNetworks( element){
	var allNetworks = element.getElementsByClassName('network');
	var networks_length=allNetworks.length;
	for(var i = 0; i < networks_length; i++){
		deletefromConfigTable(allNetworks[0].parentNode.parentNode, 'Network', 'config-map');
	}
}

/** function to enable a list of buttons
 * @param buttons_array, the list of button elements to be enabled
 */
function enableButtons( buttons_array){
	for(var i = 0; i < buttons_array.length; i++){
		buttons_array[i].disabled = false;
	}
	
}
/**
 * create an html tr element floating in the html.
 */
function createTrElement(){
	var mydiv = document.createElement('tr');
	return mydiv;
}

/**
 * Creates a table element in the dom
 */
function createTableElement(){
	var mydiv = document.createElement('div');
	mydiv.className='center-table';
	return mydiv;
}

/**
 * Sets the number of devices, networks, and partitions created to 0.
 */
function setCreateFieldsToZero(){
	netnumbers = 0;
	devicenumbers = 0;
	avail_networks = 0;
	avail_devices = 0;
	created_network_field=0;
	created_device_field=0;
	updateavailableField();
}

/**
 * create a div element floating in the html.
 */
function createDivElement(){
	var mydiv = document.createElement('div');
	return mydiv;
	
}

/**
 * generatePartitionTable returns an html table to contain the partitions from the templates
 */
function generatePartitionTable(){
	var table = document.getElementById('template2');
	return table.innerHTML;
	
}

/**
 * generateNetworkTable returns an html table to contain from the templates
 * the list of networks
 */
function generateNetworkTable(){
	var network_section = document.getElementById('template3');
	return network_section.innerHTML;
	
}
 
/** Function to get the device section form the templates
 *	@return, the inner html of the template
 */
function generateDeviceClass(){
	var device_section = document.getElementById('template4');
	return device_section.innerHTML;
}
