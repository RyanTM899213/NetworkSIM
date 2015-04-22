/**
 * New node file
 */
/**
 * New node file
 */
var Database=require("../Database/mongooseConnect.js");
var Util=require("../Utilities/utilities.js");
var rdtModel = require("../Database/dbModels/RDTModel.js");

function RDT_Spec( name){
	
	this.name = name
	this.specJSON = {};
	
	//functions
	this.getSpec = getSpec;
	this.attachJSON = attachJSON;
}

function createNewRDT_Spec( spec){
	var New_Spec = new RDT_Spec( spec.name);
	var specJSON= new rdtModel();
	specJSON.name = spec.name,
	specJSON.version = spec.version;
	specJSON.description = spec.description;
	specJSON.main = spec.main;
	New_Spec.specJSON = specJSON;
	New_Spec.attachJSON(specJSON);
	specJSON.save();
	return New_Spec;
}

function attachJSON(specJSON){
	this.specJSON=specJSON
	this._id=specJSON._id;
}

function loadRDTSpecFromDatabase(rdt_id, callback){
	var createdRDTSpec = new RDT_Spec('');
	rdtModel.findOne({_id:rdt_id},function(err,rdtJSON){
		if(!err){
			createdRDTSpec.attachJSON(rdtJSON);
			callback(createdRDTSpec);
		}
	});
	return createdRDTSpec;
}

function getSpec(){
	return this.specJSON;
}

module.exports.createNewRDT_Spec = createNewRDT_Spec;
module.exports.loadRDTSpecFromDatabase = loadRDTSpecFromDatabase;