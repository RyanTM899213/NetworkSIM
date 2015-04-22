 /**
 * Template for the page where you can view logs as a device
 */
function LogsTemplate(logs){
	//gets the html for the page from index.html
	var template = document.getElementById('template17').innerHTML;
	//compile the html with hogan
	textile = Hogan.compile(template);
	var logs_array = logs.split("\n");
	//inserts the logs into the page
	context = {'logs' : logs_array};
	tpl = textile.render(context);
	return tpl;
}