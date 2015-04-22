/**
 * Template for file uploading
 */
function uploadFileTemplate(simulation){
	//gets the html for the page from index.html
	var template = document.getElementById('template19').innerHTML;
	//compile the page with hogan
	textile = Hogan.compile(template);
	context = simulation;
	tpl = textile.render(context);
	return tpl;
	
}