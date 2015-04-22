/**
 * Template for displaying the sidebar outside of any simulation
 */
function SimulationSideBarView(id){
	//get the html for the page from index.html
	var template = document.getElementById('template18').innerHTML;
	//compile the html with hogan
	textile = Hogan.compile(template);
	context = {'simulation_id' : id};
	tpl = textile.render(context);
	return tpl;
}