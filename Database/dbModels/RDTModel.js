var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RDTSchema = mongoose.Schema({
	
	name : String,
	version : String,
	description : String,
	main : String    
	
	});

//static methods

RDTSchema.statics.getRDTByID = function (anID, callback)
{
	this.findOne( {_id : anID}, function(err, obj)
	{
		if(err) console.log("no RDT with id: " + anID );
		console.log("found RDT: " + obj);
		callback(obj);
	});
}

module.exports = mongoose.model('RDT', RDTSchema, 'RDTs');