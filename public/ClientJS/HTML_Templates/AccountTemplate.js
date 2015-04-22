/** 
 * Template for generating the information pertaining a a user's account
 * contains information about the account from the local_device data
 * @returns str, the generated html string for the template
 */
function AccountTemplate(device){
	//copies the device object completely without references
	var deviceClone = deepCopy(device); 
	//gets the simulation object from the client
	var simulation = get_local_simulation();
	for(index in simulation.partition_list){
		var network = findByUniqueID(device.current_network, simulation.partition_list[index].network_list);
		if(network!=-1){
			deviceClone.current_network = network.network_name;
			break;
		}
	}
	//gets the html from the index.html
	var template = document.getElementById('template12').innerHTML;
	//compiles the template with hogan
	textile = Hogan.compile(template);
	context = deviceClone;
	tpl = textile.render(context);
	return tpl;
}