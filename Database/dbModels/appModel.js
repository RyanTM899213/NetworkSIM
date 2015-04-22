//require mongoose node module
var mongoose = require('mongoose');

//require schema 
var Schema = mongoose.Schema;

var applicationSchema = mongoose.Schema({

	name : String,
	version : String,
	description : String,
	main : String,
	rdt_list : [String]
	
	});

applicationSchema.statics.getAppByID = function (anID, callback)
{
	this.findOne( {_id : anID}, function(err, obj)
	{
		if(err) console.log("no app with id: " + anID );
		console.log("found app" + obj);
		callback(obj, err);
	});
}

module.exports = mongoose.model('App', applicationSchema, 'Apps');