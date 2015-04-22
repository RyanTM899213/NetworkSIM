//
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var partition = require("./partitionModel").Partition;
var App = require("./appModel").App;
var Rdt = require("./RDTModel").RDT;

var simulationSchema = mongoose.Schema({
	   num_devices: Number,
	   num_networks: Number,
	   simulation_population: Number,
	   simulation_name: String, 
	   tokenMethod : String,
	   partition_list: [{type : mongoose.Schema.Types.ObjectId, ref: 'Partition'}],
	   apps : [{type : mongoose.Schema.Types.ObjectId, ref: 'App'}],
	   rdts : [{type : mongoose.Schema.Types.ObjectId, ref: 'RDT'}],
	   activity_logs : String,	   
});

//Static Functions

simulationSchema.statics.addSim = function (aSim)
{
	var LenneteSim = new Sim(aSim);
	LenneteSim.save();
    //console.log("new Simulation " + aSim);
}

//Find simulation by name
simulationSchema.statics.getSimByName = function (aString, callback)
{
 this.findOne( {simulation_name: aString}, function(err,obj)
 { 
   if(err) console.log("no sim with name " + aString);
   
   callback(obj);
   //console.log("found Simulation");
   //console.log(LenneteSim);   
  });			
}

//Modify simulation by name
simulationSchema.statics.modifySimByName = function (aString, aSim)
{
 this.findOne( {simulation_name: aString}, function(err,obj)
 { 
   if(err) console.log("no sim with name " + aString);
   var LenneteSim = new Sim();
   LenneteSim = obj;
   LenneteSim = aSim;
	LenneteSim.save();
	//callback();
  });		
}

simulationSchema.statics.findAllSimulations = function (callback)
{
	this.find({}, function(err, sims) {
		if(err) callback("No simulations or err ln, 180");
		callback(sims);
	});
}

module.exports = mongoose.model('Sim', simulationSchema, 'Simulations');