/**
 * Displays the page for viewing applications for a Device
 */
function DeviceAppsListTemplate(applications){
	//gets the html from index.html for this page
	var template = document.getElementById('template22').innerHTML;
	//compiles the file with hogan
	textile = Hogan.compile(template);
	context = {'apps' : applications};
	tpl = textile.render(context);
	return tpl;
}