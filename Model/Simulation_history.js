/**
 * New node file
 */
/**
 * New node file
 */
var Database=require("../Database/mongooseConnect.js");
var Util=require("../Utilities/utilities.js");
var stateModel = require("../Database/dbModels/stateModel.js");

function Simulation_History(id){
	
	this._id = id;
	
	this.simulation_historyJSON = {};
	
	
	//functions
	this.addState = addState;
	this.attachJSON = attachJSON;

}

function loadSimulationHistoryFromJSON(simulation_historyJSON){
	var createdSimulationHistory = new Simulation_History('');
	createdSimulationHistory.attachJSON(simulation_historyJSON);
	
	return createdSimulationHistory;
}

function createNewSimulationHistory(simulation_id){
	var New_StatesObj = new Simulation_History(simulation_id);
	var simulation_historyJSON = new stateModel();
	simulation_historyJSON.simulation_id = simulation_id;
	New_StatesObj.simulation_historyJSON = simulation_historyJSON;
	New_StatesObj.attachJSON(simulation_historyJSON);
	simulation_historyJSON.save();
	
	return New_StatesObj;
}

function addState( stateJSON){

	this.simulation_historyJSON.state.push( stateJSON);
	this.simulation_historyJSON.save();
}

function attachJSON( json){
	
	this.simulation_historyJSON = json;
	this._id = json.simulation_id;

}
module.exports.createNewSimulationHistory = createNewSimulationHistory;
module.exports.loadSimulationHistoryFromJSON=loadSimulationHistoryFromJSON;