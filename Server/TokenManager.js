var crypto = require('crypto');
var Database = require('../Database/mongooseConnect.js');

/**
 * Authenticates a token, returns a boolean value based on whether or not the device is valid.
 */
exports.authenticateToken = function authenticateToken(token, callback){
	var user = Database.getUserByToken(token, function(obj){
		var res = {};
		if(obj == null){
			res.Response = 'Fail';
		}
		else{	
			res.Response = 'Success';
			obj.verified = true;
			Database.modifyUser(token, obj, function(){
			});
		}
		callback(res);
	});
}

/*
 * Generates a token using a JS built-in hash function below 
 */
function generateToken(){
	var current_date = (new Date()).valueOf().toString();
	var random = Math.random().toString();
	var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
	return hash;
}

module.exports.generateToken = generateToken;