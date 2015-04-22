/**
 * Displays the page for interacting and viewing the network topology
 */
function NetworkTopologyTemplate(simulationJSON){
	//gets the html for viewing the network topology from index.html
	var template = document.getElementById('template21').innerHTML;
	//compile the page with hogan
	textile = Hogan.compile(template);
	tpl = textile.render(simulationJSON);
	return tpl;
}