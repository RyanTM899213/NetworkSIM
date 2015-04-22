/**
 * Functions for displaying the pages for listing the devices in the simulation
 */
/** 
 * Function to give the list of devices as well as an option to delete one if needed
 * @param devices, the device list
 * @returns str, the generated html string which was rendered from the network list provided
 */
function AdminDevicesListTemplate(devices){
	//gets the html for the page from index.html
	var template = document.getElementById('template16').innerHTML;
	//uses hogan to compile the html
	textile = Hogan.compile(template);
	context = { 'devices' : devices};
	tpl = textile.render(context);
	return tpl;
}

/** 
 * Function to give the list of devices within the current simulation in
 * a rendered html format. This function specifies the template of the layout
 * @param devices, the device list
 * @returns str, the generated html string which was rendered from the network list provided
 */
function DevicesListTemplate(devices){
	//gets the html for the page from index.html
	var template = document.getElementById('template14').innerHTML;
	textile = Hogan.compile(template);
	//copy everything about the device without references
	var devicesClone = deepCopy(devices);
	//gets the simulation for this client
	var simulation = get_local_simulation();
	//for each device
	for(dev in devicesClone){
	 	for(index in simulation.partition_list){
			var network = findByUniqueID(devicesClone[dev].current_network, simulation.partition_list[index].network_list);
			if(network!=-1){
				devicesClone[dev].current_network = network.network_name;
				break;
			}
		}
	}
	//adds the devces to the context
	context = { 'devices' : devicesClone};
	tpl = textile.render(context);
	return tpl;
}