/**
 * Template for viewing a page with available rdts for a device
 */
function viewRDTsTemplate(rdts){
	//gets the html for the page from index.html
	var template = document.getElementById('template20').innerHTML;
	//compiles the page with hogan
	textile = Hogan.compile(template);
	//inserts the rdts into the page
	context = {'rdts' : rdts};
	tpl = textile.render(context);
	return tpl;
}