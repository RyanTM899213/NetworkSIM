/**
 * Function for viewing a page containing the list of all simulations in the application and interacting with them
 */
function SimulationDataListTemplate(simulations){
	//gets the device belonging to the client
	var local_device = get_local_device();
	//create the html for the page
	var str = '<h1 class="flip-up-text">List of current Simulations</h1>'+ "<div class = 'simulations_management'> ";
	str += " <table id = 'simslist'> ";
	str+="<tr><td>Simulation Name</td><td>Number of Devices</td><td>Number of Networks</td><td>Action</td></tr>";
	if(simulations !== null && simulations !== undefined ){
		//for each simulation in the list of simulations, add information about the simulation to the page
		for (var i =0 ; i < simulations.length; i++) {
			 str += "	<tr> " + "<td> <div class = 'sim-name'>  " + simulations[i].simulation_name+ " </div> </td> " +
				"<td> <div class = 'num-devices'>" + simulations[i].num_devices+ " </div> </td> " +
				"<td> <div class = 'num-networks'>" + simulations[i].num_networks+ " </div> </td> ";
			//if the device is able to view the page, generate a button to view the page
			if(local_device.verified == true && local_device.current_simulation === simulations[i].simulation_id){
				str += "<td> <div  class = 'btn btn-primary'  onclick = 'SimulationManagementView()'> View </div> </td>";
			}else{
				//otherwise add a button to register to that simulation
				str += "<td> <div  class = 'btn btn-primary'  onclick = 'RegisterView(&quot;" + simulations[i].simulation_id + "&quot;)' > Register  </div> </td> ";
			}
			str += " </tr>";
		}	
	}
	str +=  " </table> 	</div>";
	return str;
}