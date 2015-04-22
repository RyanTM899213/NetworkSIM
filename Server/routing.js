var SimulationManager = require("./SimulationManager.js");
var FileManager = require("./FileManager.js");
var ApplicationManager = require("./ApplicationManager.js");
var RDTManager = require("./RDTManager.js");
var io = {};

var clients = [];
var client_map = {};

function injectIO(object){
	io = object;
}

function generateUID() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
}


function handleClient (socket) {
	//console.log(socket);
	var tweet = {user: "nodesource", text: "Hello, world!"};
	var id = generateUID();
    // to make things interesting, have it send every second
	//console.info('New client connected (id=' + socket.id + ').');
	
	io.to(socket.id).emit('session_start', id);

    socket.on("disconnect", function () {
    	 var index = clients.indexOf(socket);
         if (index !== -1) {
             clients.splice(index, 1);
             //console.info('Client gone (id=' + socket.id + ').');
         }
    });
    
    socket.on("/getSync", function(data){    		
    		var json = JSON.parse(data);
    		var token = json.token;
    		var events = json.eventQueue ;
    		var simulation= json.simulation_id;
    		//console.log(simulation);
    		SimulationManager.authToken(token, simulation, function(obj){
    			//for now allow empty tokens
    			
    			if(obj.Response == 'Success'){
    				//map the socket_id to that users token
    				client_map[token] = socket.id;
    				console.log("Successful authentication");
    					handleEventQueue(token, events, function(){
	    					//the painful part, we need to send it to all clients in the simulation
	    					var list = SimulationManager.getAllActiveDevices(simulation);
	    					
	    					for(var index = 0; index < list.length; index++){
	    						var user_token = list[index]['token'];
	    						var socket_id = client_map[user_token];
	    						
	    						var state = SimulationManager.getAppStateForDevice(user_token,simulation);
                                io.to(socket_id).emit('syncState', state);
	    						
	    					}    					
    				});
    				
    			}else{
    				handleEventQueue(token, events, function(){    					
    					var state= SimulationManager.getBlankAppState();
    					
    					io.to(socket.id).emit('syncState', state);
    					
    				});
    			}
    			
    		});
    });

    socket.on("/authenticate/authToken", function (data){
    	
    	var json = JSON.parse(data);
    	var token = json.token;
    	var time_stamp = json.time_stamp;
    	var simulation_id = json.simulation_id;
    	SimulationManager.authToken(token, simulation_id, function(obj){
    	//for now allow empty tokens
    		client_map[token] = socket.id;
    		io.to(socket.id).emit('validate_user', obj);
    	});
    });
    
    socket.on("/get/History", function (data){
    	
    	var json = JSON.parse(data);
    	var token = json.token;
    	var simulation_id = json.simulation_id;
    	SimulationManager.authToken(token, simulation_id, function(obj){
    		if(obj.Response == 'Success'){
		    	var history = SimulationManager.getSimulationHistory(simulation_id);
		    	io.to(socket.id).emit('syncHistory', history);
    		}else{
    			io.to(socket.id).emit('validate_user', obj);
    		}
    	});
    	//for now allow empty tokens
    		
    	
    } );           
    
    
};




function handleEventQueue(token, eventQueue, callback) {
	for(var i = 0; i < eventQueue.length; i++) {
		
		switch(eventQueue[i].route) {

			case '/move/Device/Freelist' :
                SimulationManager.removeDeviceFromNetwork(eventQueue[i].event_data, eventQueue[i].time_stamp);
                break;
			case '/create/Simulation': 
				SimulationManager.createSimulation(eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;

			case '/create/Network' :
				SimulationManager.createNetwork( eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;		

			case '/create/Device' :
					SimulationManager.createDevice(eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;

			case '/move/Device/Network':
					SimulationManager.addDeviceToNetwork(eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;

			case '/merge/Partitions' :
				SimulationManager.mergePartitions(eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;
			
			case '/divide/Partition':
				SimulationManager.dividePartition(eventQueue[i].event_data, eventQueue[i].time_stamp);
				break;
            case '/upload':
                FileManager.uploadAllFiles(eventQueue[i].event_data, eventQueue[i].time_stamp);
                break;
                
            case '/deploy/App':
                ApplicationManager.deployApp(eventQueue[i].event_data, eventQueue[i].time_stamp);
                break;
                
            case '/reverse/deploy/App':
                ApplicationManager.reverse_deploymentApp(eventQueue[i].event_data, eventQueue[i].time_stamp);
                break;
                
            case '/launch/App':
                ApplicationManager.launchApp(eventQueue[i].event_data, eventQueue[i].time_stamp);
                break;
			default:
				break;
				
		}	
	}
	
	
	if (typeof(callback) == "function") {
		callback();
	}
};

module.exports.injectIO = injectIO;
module.exports.handleClient = handleClient;