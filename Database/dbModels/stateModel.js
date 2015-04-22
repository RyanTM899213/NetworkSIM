//requires mongoose
var mongoose = require('mongoose');
//requires schema
var Schema = mongoose.Schema;

//defines the schema

var stateSchema = mongoose.Schema({
	 //type string
	 simulation_id : String,
	 state : [{ simulation:  Object, timestamp : String }],
	 
	 
	});

stateSchema.statics.newState = function (aState)
{
  var LenneteState = new State(aState)
  LenneteState.save();
  //console.log("Saved state" + state);
}

stateSchema.statics.getStateByID = function (anID, callback)
{
	this.findOne( {_id : anID}, function(err, obj)
	{
		if(err) console.log("no state with id: " + anID );
		console.log("found state " + obj);
		callback(obj);
	});
}

stateSchema.statics.findAllStates = function (callback)
{
	this.find({}, function(err, states) {
		if(err) callback("No states or err ln, 180");
		callback(states);
	});
}



module.exports = mongoose.model('State', stateSchema, 'States');