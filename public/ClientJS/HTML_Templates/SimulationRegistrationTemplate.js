/**
 * Template for the page where you can register for a simulation
 */
function SimulationRegistrationTemplate(id){
	//gets the html for this page from index.html
	var template = document.getElementById('template8').innerHTML;
	//compile the html with hogan
	textile = Hogan.compile(template);
	context = id;
	tpl = textile.render(context);
	return tpl;
}