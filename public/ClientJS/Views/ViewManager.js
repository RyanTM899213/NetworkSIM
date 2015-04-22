/**
 * Functions which handle viewing different pages in our application
 */

/**
 * Renders the start page
 */
window.onload = function(){
	//loads the default sidebar for not being in a simulation
	defaultsideBarView();
	//loads the css
	loadStyleSheet('../css/main.css');
	//loads the default header
	defaultheaderView();
	//calls the function to send information to necessary views
	updateAllViews();	
}

/**
 *Gets the view which displays a list of available simulations
 */
function simulationListView(){
	//sets the header view
	defaultheaderView(); 
	//clears everything on the page
	clearNav();
	
	clearSection();

	var simulations = get_local_simulation_list();
	
	//adds the list of simulations into the page
	var html =  SimulationDataListTemplate(simulations);
	//gets the container of the page
	var content = getContainer();
	//sets the default sidebar page
	defaultsideBarView();
	removeClass('active');
	document.getElementById('nav-option-simCreate').className='active';
	content.innerHTML = html;
}

/**
 * Loads the necessary views for the start of viewing our application
 */
function updateAllViews( timeout){
	setTimeout(function() {
		simulationListView();
	}, timeout);	
}


/**
 * Shows the user's account information
 */
function AccountView(){
	var local_device = get_local_device();
	var html = AccountTemplate(local_device);
	getContainer().innerHTML = html;
	simulationSideBarView();
	removeClass('active');
	document.getElementById('my-account-link').className='active';
}

/**
 * Displays the header for viewing a current device
 */
function deviceHeaderView(){
	var local_device = get_local_device();
	var local_session = get_local_simulation();
	var html = viewDeviceTemplate(local_device, local_session);
	var content = getContainer();
	content.innerHTML = html;
}

/**
 * Displays the page for viewing applications as an Administrator
 */
function adminAppsView(){
	removeClass('active');
	document.getElementById('nav-option-applications').className='active';
	
	var local_session = get_local_simulation();
	var applications = local_session.apps;
	var app_map = mapDevicestoApp( applications);
	console.log(app_map);
	var html = viewAdminApplicationsTemplate(app_map);
	var content = getContainer();
	content.innerHTML = html;
}

function RDTsView(){
	removeClass('active');
	document.getElementById('nav-option-RDTs').className='active';

	var local_simulation = get_local_simulation();
	var rdts = local_simulation.rdts;
	var html = viewRDTsTemplate(rdts);
	var content = getContainer();
	content.innerHTML = html;
	
}

function TestsView(){
	removeClass('active');
	document.getElementById('nav-option-tests').className='active';

	var local_simulation = get_local_simulation();
	var tests = local_simulation.test;
	var html = viewTestsTemplate(tests);
	var content = getContainer();
	content.innerHTML = html;
}

function ViewRDTSpec(_id, e){
	var local_simulation = get_local_simulation();
	var rdts = local_simulation.rdts;
	
	if(e.innerHTML.indexOf("View Specification") > -1 ){
		for(var i = 0; i < rdts.length; i++){
			if(rdts[i]._id == _id){
				var div = document.getElementById(_id);
				if(div !== null) div.innerHTML = "<code>" + JSON.stringify(rdts[i]) + "</code>";
			}
		}
		e.innerHTML = 'Hide';
	}else if( e.innerHTML.indexOf('Hide') > -1 ){
		var div = document.getElementById(_id);
		if(div !== null) div.innerHTML = "";
		e.innerHTML = 'View Specification'
	}
}

function ViewAppSpec(_id, e){
	var local_simulation = get_local_simulation();
	var apps = local_simulation.apps;
	
	if(e.innerHTML.indexOf("View Specification") > -1 ){
		for(var i = 0; i < apps.length; i++){
			if(apps[i]._id == _id){
				var div = document.getElementById(_id);
				//console.log(_id);
				if(div !== null) div.innerHTML = "<code>" + JSON.stringify(apps[i]) + "</code>";
			}
		}
		e.innerHTML = 'Hide';
	}else if( e.innerHTML.indexOf('Hide') > -1 ){
		var div = document.getElementById(_id);
		if(div !== null) div.innerHTML = "";
		e.innerHTML = 'View Specification'
	}
}

function ViewApp( app_id){
	local_device = get_local_device();
	var apps = local_device.apps;
	var display = false;
	
	for(var i = 0; i < apps.length; i++){
		//console.log(apps[i]);
		if(apps[i]._id == app_id){
			display = true;
			var location = "../apps/" + apps[i].name + "/" + apps[i].main;
			
		}
	}
	if(display == true){
		var frame = "<iframe src='" + location + "' width='100%' height='600px'> </iframe> ";
	}else{
		var frame = "<iframe src='../apps/not_found.html' width='100%' height='600px'> </iframe> ";
	}
	//clears everything on the page
	
	clearSection();
	var content = getContainer();
	content.innerHTML = frame;
	
}
/**
 * Displays the user's information
 */
function deviceDefaultView(){
	//clears everything on the page
	
	clearSection();
	
	var local_device = get_local_device();
	//sets the top bar to be the default look
	defaultheaderView();
	if(getVerified() == false){
		alert('You do not have permission to access this. Please get a token first.');
	}else{
		AccountView();
	}
}


/**
 * Displays the user's information
 */
function appDefaultView(){
	//clears everything on the page
	
	clearSection();
	
	var local_simulation = get_local_simulation();
	//sets the top bar to be the default look
	defaultheaderView();
	if(getVerified() == false){
		alert('You do not have permission to access this. Please get a token first.');
	}else{
		//sets the page to view to 'user information' page
		var apps = DeviceAppsListTemplate(local_simulation.apps);
		var content = getContainer();
		if(local_simulation.apps==''||local_simulation.apps==null){
			apps += "No applications are registed to this simulation.";
		}
		content.innerHTML = apps;
		//sets the sidebar to the sidebar for when inside a simulation
		simulationSideBarView();
		removeClass('active');
		document.getElementById('my-apps-link').className='active';
	}
}

/**
 * sets the sidebar of the page to look as it should when the page is opened
 */
function defaultheaderView(){
	var header = document.getElementById('template6');
	var head= getHeader();
	head.innerHTML = header.innerHTML;
}

/**
 * newSimulationView changes the view to the page where a simulation may be created
 */
function newSimulationView(){
	var simulation_view = document.getElementById('template10');
	var html = simulation_view.innerHTML;
	var content = getContainer();
	//update the active link
	removeClass('active');
	document.getElementById('nav-option-simView').className='active';
	content.innerHTML = html;
	//sets the number of devices, networks, and partitions created to 0
	setCreateFieldsToZero();
}
/**
 * displays a field in which to create a new network in the new simulation page
 */
function createNetworkView(){
	var network_view = document.getElementById('template1');
	var html = network_view.innerHTML;
	var content = getContainer();
	content.innerHTML = html;
	removeClass('active');
	document.getElementById('my-create-network-link').className='active';
}

/**
 * displays the sidebar when not within a specific simulation
 */
function defaultsideBarView(){
	var sidebar = document.getElementById('template5');
	var aside = getSideBar();
	html = sidebar.innerHTML;
	aside.innerHTML = html;
}

/**
 * Sets the sidebar to the appropriate sidebar for being within a simulation
 */
function simulationSideBarView(){
	var sidebar = document.getElementById('template9');
	var aside = getSideBar();
	aside.innerHTML = sidebar.innerHTML;
}

/****
 * A view which allows for manipulation of network topology through our GUI
 ****/

function networkTopologyView(){
	removeClass('active');
	document.getElementById('nav-option-viewTopology').className='active';

	document.getElementById('')
	//removes previously occuring stylesheets and javascript files if they occured before
	removeFile('topologyView.css', 'css');
	removeFile('Manipulation.js', 'js');
	removeFile('Drawing.js','js');
	defaultheaderView(); 
	
	clearNav();
	
	clearSection();

	var content = getContainer();
	loadStyleSheet('../css/topologyView.css');
	var html=NetworkTopologyTemplate(get_local_simulation());
	var content=getContainer();
	content.innerHTML=html;
	loadJSFile('../gui/Drawing.js');
	loadJSFile('/view/TopologyView.js');
	loadJSFile('/gui/Manipulation.js',setTimeout(function(){generateTopology(get_local_simulation().partition_list,800);}, 800));
	//sets the topology to be able to be interacted with
	interactable =true;

}


/***
 * A view which allows you to view the logs for devices and simulations based on a particular timestamp
 */
function eventLogsView(){
	removeClass('active');
	document.getElementById('nav-option-history').className='active';

	removeFile('topologyView.css', 'css');
	removeFile('EventLogView.css', 'css');
	removeFile('EventLogView.js', 'js');
	removeFile('Manipulation.js', 'js');
	removeFile('Drawing.js','js');

	//clearNav();
	
	clearSection();

	defaultheaderView();
	//defaultsideBarView();
	
	loadStyleSheet('../css/topologyView.css');
	loadStyleSheet('../css/EventLogView.css');
	loadJSFile('../view/EventLogView.js');
	loadJSFile('../gui/Drawing.js');
	
	
	var content = getContainer();
	
	var html=EventLogViewTemplate(get_local_simulation());
	var content=getContainer();
	content.innerHTML=html;

	setTimeout(function(){
		clearCanvas();
		populatePage(get_local_history());
		//sets the topology to be able to interact with
		interactable=false;
	}, 1000);
}

/**
 * Display's the token registration page
 */
function RegisterView(id){
	var obj = { 'id' : id};
	var html = SimulationRegistrationTemplate(obj);
	var content = getContainer();
	
	content.innerHTML = html;
	document.getElementById('simulation_id_div').value = id;
}

function adminLoginView(){
	var html = AdminLoginTemplate();
	var content = getContainer();
	
	content.innerHTML = html;
	
}

function SimulationManagementView(){
	clearNav();
	
	clearSection();
	clearContainer();
	
	var local_simulation = get_local_simulation();
	var aside = getSideBar();
	var sidebar = SimulationSideBarView(local_simulation._id);
	aside.innerHTML = sidebar;
	//loads the network topology
	networkTopologyView();
}


function SimulationManagementSideBarView(){
	var sidebar = document.getElementById('template18');
	
	aside.innerHTML = sidebar.innerHTML;
}
/**
 * Displays the list of all networks not sure if necessary
 */
function NetworksListView(){
	clearNav();
	
	clearSection();
	var local_simulation = get_local_simulation();
	var local_device = get_local_device();
	var lists = getRealNetworks(local_simulation.partition_list);
	var html = NetworksListTemplate(lists, local_device);
	
	getContainer().innerHTML = html;
	removeClass('active');
	document.getElementById('my-networks-link').className='active';
}

/**
 * Displays the list of all devices
 */
function DeviceListView(){
	clearNav();
	
	clearSection();
	var local_simulation = get_local_simulation();
	var devices = getAllDeviceObjects();
	var html =  DevicesListTemplate(devices);

	getContainer().innerHTML = html;
	removeClass('active');
	document.getElementById('my-devices-link').className='active';
}

/**
 * changes the page view to the logs of this user.
 */
function LogsView(){
	clearNav();
	
	clearSection();
	var logs = getLocalDeviceLogs();
	if(logs==''||logs==null){
		logs="This device has not performed any events so far.";
	}
	var html= LogsTemplate(logs);
	var content = getContainer();
	content.innerHTML = html;
	removeClass('active');
	document.getElementById('my-logs-link').className='active';
}

/**
* Displays the page for uploading files
**/

function uploadView(){
	loadJSFile('../logic/FileUpload.js');
	

	var simulation={};
	var html=uploadFileTemplate(simulation);
	var content=getContainer();
	content.innerHTML=html;
}


