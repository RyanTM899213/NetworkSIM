/**
 * Displays the page for viewing event logs of that simulation
 */
function EventLogViewTemplate(simulationJSON){
	//gets the for this page html from index.html
	var template = document.getElementById('template24').innerHTML;
	//compile the html with hogan.
	 textile = Hogan.compile(template);
	 tpl = textile.render(simulationJSON);
	 return tpl;
}