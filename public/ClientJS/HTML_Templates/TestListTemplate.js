/**
 * Template for viewing the test scripts from the admin point of view.
 */
function viewTestsTemplate(tests){
	//get the html from index.html for this page
	var template = document.getElementById('template23').innerHTML;
	//compile the template for html
	textile = Hogan.compile(template);
	context = {'tests' : tests};
	tpl = textile.render(context);
	return tpl;
}