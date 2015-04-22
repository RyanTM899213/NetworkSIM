var Util=require("../Utilities/utilities.js");
var Database=require("../Database/mongooseConnect.js");
var PModel = require("../Database/dbModels/partitionModel.js");
var NetworkModel = require("../Database/dbModels/networkModel.js");
var NetworkIterator=require('./Iterators/NetworkIterator.js');
var Network = require("./Network.js");

function Partition(partitionName, simulationName){
	//Variables
	this.partition_name=partitionName;
	this.simulation_name=simulationName;
	this.network_list=[];
	this.NetworkIterator = new NetworkIterator(this.network_list);
	this._id='';
	//Functions
	this.addNetwork=addNetwork;
	this.removeNetwork=removeNetwork;
	this.mergePartitions=mergePartitions;
	this.attachJSON=attachJSON;

	//Constructor contents
	this.partitionJSON = {};
	

}

function createNewPartition(partitionName,simulationName){
	var createdPartition = new Partition(partitionName, simulationName);
	var partitionJSON = new PModel();
	createdPartition.attachJSON(partitionJSON);
	partitionJSON.save();
	return createdPartition;
}

function loadPartitionFromDatabase(partitionID){
	var createdPartition = new Partition('','');
	PModel.findOne({_id: partitionID},function(err,partitionJSON){
		if(!err){

				for(var index=0; index<partitionJSON.network_list.length;index++){
					
					var createdNetwork=Network.loadNetworkFromDatabase(partitionJSON.network_list[index]);
					createdNetwork.partitionObject=createdPartition;
					createdPartition.network_list.push(createdNetwork);
		
				}
				createdPartition.attachJSON(partitionJSON);
			}
	});

		return createdPartition;
}


function attachJSON(partitionJSON){
		this.partitionJSON=partitionJSON;
		this._id=partitionJSON._id;
}

function addNetwork(network){
		network.partitionObject=this;
		this.network_list.push(network);
		this.partitionJSON.network_list.push(network.networkJSON._id);
		this.partitionJSON.markModified('network_list');
		this.partitionJSON.save();
		network.networkJSON.save();
}

function removeNetwork(network){

	for(var index=0; index<this.network_list.length;index++){
		if(this.network_list[index]._id==network._id){
			var newPartition=createNewPartition('');
			newPartition.addNetwork(network);
			this.network_list.splice(index,1);
			this.partitionJSON.network_list.splice(index,1);
			this.partitionJSON.network_list.pull(network._id);
			this.partitionJSON.markModified('network_list');
			this.partitionJSON.save();
			break;
			
		}
	}
	return network.partitionObject;
}

function mergePartitions(partition){

		var networks=partition.network_list;

		for(key in networks){
			networks[key].partitionObject=this;
			this.partitionJSON.network_list.push(networks[key]._id);
			this.partitionJSON.markModified('network_list');
			this.network_list.push(partition.network_list[key]);
		}

		this.partitionJSON.save();
};

module.exports.createNewPartition = createNewPartition;
module.exports.loadPartitionFromDatabase=loadPartitionFromDatabase;