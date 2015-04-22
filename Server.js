/****
 * This module is responsible for server-related actions and calls.
 * Please note that the relevant routing is under routing.js
 ****/

var express = require('express');
var path = require('path');
var logger = require('express-logger');
var SimulationManager = require('./Server/SimulationManager');
var Router = require("./Server/routing.js");
var SimulationModel = require("mongoose").model("Sim");
var StateModel = require("mongoose").model("State");
var RDTManager = require("./Server/RDTManager.js");


var app = express();
var globalCount = 0;
var port = 3332;  // must be on port 3332 on excalibur for the grader


var server = require("http").Server(app);
var io = require("socket.io").listen(server);


SimulationModel.findAllSimulations(function(simJSONlist){
	SimulationManager.loadSimulations(simJSONlist);
	
	StateModel.findAllStates(function(simHistoryJSONlist){
		SimulationManager.loadSimulationHistorys(simHistoryJSONlist);
		
		setTimeout(function(){
			
			Router.injectIO(io);
			io.on("connection", Router.handleClient);
	
			SimulationManager.populateLists();
			console.log("All simulations have been loaded.");
	
			server.listen(port, function(){
		  		console.log('listening on *: ' + port);
			});
	
		},7000);
		
	});	
	
});

app.post("/manipulate/RDT", function(request, response){
	
	var data = '';//waits until all of the data from the client has been received
	request.on("data", function(chunk){ //if a piece of the data from the client is being received 
		data += chunk.toString();
	});
	//if we have the entire data from the client
	request.on("end", function() {
		//console.log(data);
		var json = JSON.parse(data);
		var token = json.token;
		var time_stamp = json.timestamp;
		var name = json.event_data.name;
		var simulation_id = json.simulation_id;
		var new_val = 'Not available';
		SimulationManager.authToken(token, simulation_id, function(obj){
			if(obj.Response == 'Success'){
				new_val = RDTManager.manipulateRDT(json.event_data, time_stamp);
				var res = {'new_val' : new_val};
				response.send( res );
			}
			
		});
	});	
            
});    

app.get('/', function(request,response){
	response.sendFile("/index.html", {"root": __dirname});	
}); 

app.get('/index', function(request,response){
	response.sendFile("/index.html", {"root": __dirname});
	
}); 

app.get('/gui/Drawing.js', function(request, response){
	response.sendFile("/public/ClientJS/TopologyGUI/Drawing.js", {"root": __dirname});
})

app.get('/gui/Shapes.js', function(request, response){
	response.sendFile("/public/ClientJS/TopologyGUI/Shapes.js", {"root": __dirname});
})

app.get('/gui/Manipulation.js', function(request, response){
	response.sendFile("/public/ClientJS/TopologyGUI/Manipulation.js", {"root": __dirname});
})

app.get('/gui/interact-1.2.2.js', function(request, response){
	response.sendFile("/public/ClientJS/TopologyGUI/interact-1.2.2.js", {"root": __dirname});
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'apps')));

app.use("/css",  express.static(__dirname + '/public/stylesheets'));
app.use("/logic", express.static(__dirname + '/public/ClientJS/ClientLogic'));
app.use("/template", express.static(__dirname + '/public/ClientJS/HTML_Templates'));
app.use("/view", express.static(__dirname + '/public/ClientJS/Views'));
app.use("/gui", express.static(__dirname + '/public/ClientJS/GUI'));
app.use("/js",  express.static(__dirname + '/public/ClientJS'));
app.use("/img",  express.static(__dirname + '/public/img'));
app.use("/apps",  express.static(__dirname + '/apps/'));

exports.io=io;

