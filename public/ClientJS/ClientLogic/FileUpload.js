/**
 * Functions which handle uploading files on the client side to the server
 */

//list of currently uploaded files
var current_files=[];
//the list of files to upload event to send to the server
var uploadEvent={};

/**
 * handles this type of file on the client
 */
function handleFiles(file_type) {
	current_files = document.getElementById(file_type).files;		
	readFiles();
	updateData();				
}

/**
 * Populates the current page with information about the uploaded files
 */
function updateData(){
	//bytes in file
	var fileBytes = 0,
	nFiles = current_files.length;
	//holds the size of the file
	var fileSize;
	//creates the table element to be input
	var thediv = "<table class='center-table'>";
	for (var nFileId = 0; nFileId < nFiles; nFileId++) {
		//increments file size and number of bytes
		fileSize=current_files[nFileId].size;
		fileBytes += fileSize;
		//gets the file extension
		var ext= current_files[nFileId].name.split('.').pop();
		var img;
		//handle based on the extension of the file
		switch (ext){
			//if it is a javascript file place this image into the table
			case "js":
				img='../img/js-128.png'
				break;
			//otherwise set this image into the table
			default:
				img='../img/html-128.png';
				break;
		}

		//adds the information about the file to the page
		thediv +="<tr id='FILE"+nFileId+
		"'> <td> <img src='"+img+"' height='128' width='128'/> </td> <td> "+
		current_files[nFileId].name+"</td> <td> Size: "+fileSize+" Bytes" +
				"</td> </tr>";
	}
	//ends the table
	thediv +=" </table> ";
	//place this information into the page
	document.getElementById("Files").innerHTML = thediv;
	var fileSize = fileBytes + " bytes";

	document.getElementById("fileNum").innerHTML = nFiles;
	document.getElementById("fileSize").innerHTML = fileSize;
}

/**
 * Delete a file from the table on the page
 */

function DeleteFile(int){		
	 updateData();
}

/**
 * Function which reads in a file 
 */
function readFiles(){
	for(var i=0;i<current_files.length;i++) { 
		uploadEvent= {name : '', simulation_id:'', spec : '', type : '',  files: []};
		setup_reader(current_files[i]); 
	}
	
}
/**
 * Sets up the file reader for reading in a file from the client
 */
function setup_reader(file){
	
	fileReader = new FileReader();
	var name=file.name;
	var type = file.type;
	//upond reading in the file from the client
	fileReader.onload=function(){
		addFileToEvent(this,type ,name);
	};
	//read in the file as text
	fileReader.readAsText(file);
		 
}

/**
 * Checks if the correct files have been included
 * @param: needle, the file we need to fine
 * @param: haystack, the place in which to find that file
 */
function hasRequiredFile(needle, haystack){
	if(needle==null||needle==''||haystack==null||haystack==''){
		return false;
	}
	//holds whether the file has been found
	var bool = false;
	//for each object in the haystack
	for (var i = 0; i < haystack.length; i++){
		//if found the correct object
		if(haystack[i]['name'] == needle){
			//if it's the required package.json
			if(needle == 'package.json'){
				//add this information to the event
				uploadEvent.name = JSON.parse(haystack[i]['data']).name;
				uploadEvent.spec = JSON.stringify(haystack[i]['data']);
			}
			//if it's the required test.json
			else if (needle == 'test.json'){
				//add this information to the event
				uploadEvent.name = JSON.parse(haystack[i]['data']).name;
				uploadEvent.spec = JSON.stringify(haystack[i]['data']);
			}
			//set true that the object has been found
			bool = true;
			break;
		}
	}
	return bool;
}

/**
 * Checks to ensure that all RDTs required for this application are already imported
 */
function checkRDTSinApp(){
	var msg = "";
	//gets the simulation object from the client
	var local_simulation = get_local_simulation();
	if(local_simulation != null){
		//gets all of the RDTs imported into the simulation
		var rdts = local_simulation.rdts;
		//gets the data from the specification file uploaded
		var data = JSON.parse(uploadEvent.spec);
		data = JSON.parse(data);
		var key = "rdt_list";
		//gets the rdt_list the specifcatio information
		var app_rdts = data.rdt_list;
		console.log(app_rdts);
		console.log(data);
		if(data.rdt_list !== null){
			if( rdts.length < 1){
				//checks through all of the rdts in the data and ensures that each of these RDTS are imported
				for( index in app_rdts){
					if( rdts.indexOf(app_rdts[index]) <= -1){
						msg += "This application requires the RDT " + app_rdts[index]  + "\n Please import it using the RDT Manager Upload Tool \n\n";
					}
				}  
			}
			console.log(msg);
			if(msg.length > 1){
				alert(msg);
				return false;
			}else{
				return true;
			}
		}
	}
}

function checkRDTSinScript(){
	var msg = "";
	var local_simulation = get_local_simulation();
	if(local_simulation != null){
		
		var rdts = local_simulation.rdts;
		var data = JSON.parse(uploadEvent.spec);
		data = JSON.parse(data);
		var key = "rdts";
		var parameters = data.parameters;
		
		var script_rdts = parameters.rdts;
		console.log(script_rdts);

		if(script_rdts !== null){
			
			if( rdts.length < 1){
				
				for( index in script_rdts){
					var rdt_name = script_rdts[index].name;
					if( rdts.indexOf(script_rdts[rdt_name]) <= -1){
						msg += "This script requires the RDT " + rdt_name  + "\n Please import it using the RDT Manager Upload Tool \n\n";
					}
				}  
			}
			console.log(msg);
			if(msg.length > 1){
				alert(msg);
				return false;
			}else{
				return true;
			}
		}
	}
}

/**
 * Adds the file to upload to the event to be sent to the server
 */
function addFileToEvent(filereader,type,name){
	//sets the information of the file
	var theFile = {};
	theFile.type=type;
	theFile.data=filereader.result;
	theFile.name=name;
	//adds the file to the event to be sent to the server
	uploadEvent.files.push(theFile);
}

/**
 * Uploads the files for an application, RDT, or test script to the server.
 */
function pushFileEvent(file_type){
	//gets the simulation from the client
	var local_simulation = get_local_simulation();
	//creates the body of the information being added to the event queue
	uploadEvent.simulation_id = local_simulation._id;
	uploadEvent.type = file_type;
	//sets that a file has been uploaded
	var upload = true;
	
	//if uploading an RDT
	if( file_type == 'RDT'){
		//check that all of the required information for the RDT exists
		if(hasRequiredFile('spec.md', uploadEvent.files) == false){
			alert("Please include a Mark Down file for the specs");
			upload = false;
		}
		if( hasRequiredFile('package.json', uploadEvent.files) == false &&upload==true){
			alert("Please include a package.json file describing your RDT");
			upload = false;
		}
	}
	//if uploading an application
	else if( file_type == 'App'){
		//check that all of the required information for the application exists
		if( hasRequiredFile('package.json', uploadEvent.files) == false ){
			alert("Please include a package.json file describing your Application");
			upload = false;
		}
		if(checkRDTSinApp() == false&&upload==true) upload = false;
	}
	//if uploading a test script
	else if( file_type == 'Test'){
		
		if( hasRequiredFile('test.json', uploadEvent.files) == false ){
			alert("Please include a test.json file for your Test Script");
			upload = false;
		}
		if( checkRDTSinScript() == false&&upload==true) upload = false;
	}
	else{
		alert("Please input a file to upload");
		upload=false;
	}
	//passed all of the checks
	if( upload){
		//add the event to the event queue
		addToEventQueue('/upload',uploadEvent,new Date());
		var btn = document.getElementById('UploadButton');
		if(btn !== null){
			btn.innerHTML = "Please Wait";
			btn.onclick=null;
		}

		if (file_type=='Test'){
				alert("Test script is being run. Please view the simulation history to see the effect.");
		}
		//send the information to the server
		setTimeout(function(){
			syncWithServer();
			uploadEvent={};
			//sets the view to simulation management
			setTimeout(function(){
				var active = document.getElementsByClassName('active');
				if (file_type=='Test'&&active[0].id=='nav-option-tests'){
					eventLogsView();
				}
				else if (file_type == 'App'&&active[0].id=='nav-option-applications'){
					adminAppsView();
				}
				else if(file_type == 'RDT'&&active[0].id=='nav-option-RDTs'){
					RDTsView();
				}
			},1000);
		},6000);
	}
}
