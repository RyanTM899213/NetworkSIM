/**
 * Displays the page for viewing the applications in the simulations from the 
 * Administrator's point of view.
 */
function viewAdminApplicationsTemplate(applications){
	//gets the html from index.html
	var template = document.getElementById('template19').innerHTML;
	//compiles the template with hogan
	textile = Hogan.compile(template);
	//inserts the applications into the page
	context = {'apps' : applications};
	tpl = textile.render(context);
	return tpl;
}