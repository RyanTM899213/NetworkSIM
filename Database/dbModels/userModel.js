var App = require("./appModel").App;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//User Schema properties
var userSchema = mongoose.Schema({
	
	token:String,
	email:String,
	verified: Boolean,
	current_partition: String,
	current_network: String,
	registeredOn: String,
	admin: Boolean,
	networks_created: [String],
	current_simulation: String,
	current_device_name: String,
	activity : String,
	apps : [{type : mongoose.Schema.Types.ObjectId, ref: 'App'}]
	
});

//Functions available to a "User" object. Functions defined inside schema
userSchema.statics.addUser = function (aUser)
{ 
  var Lennete = new User(aUser);
  Lennete.save();
  console.log("saved user " + aUser);
}

userSchema.statics.modifyUser = function (aToken, aUser)
{
	  this.findOne({token: aToken}, function(err, obj)
	  {
	  if(err) console.log("No user with that token");
	  console.log("user saved");
	  obj= aUser;
	  obj.save();
	  console.log("User with token " + aToken + " edited ");	
	  });
}

userSchema.statics.getUserByID = function (anID, callback)
{
	this.findOne( {_id : anID}, function(err, obj)
	{
		if(err) console.log("no user with id: " + anID );
		console.log("found network" + obj);
		callback(obj);
	});
}



//Define Schema and Schema functions as a model called User, using the userSchema, and stored in a collection called "Users"
module.exports = mongoose.model('User', userSchema, 'Users');