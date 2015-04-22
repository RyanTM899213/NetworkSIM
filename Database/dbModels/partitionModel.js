//requires mongoose node module
var mongoose = require('mongoose');

//requires schema
var Schema = mongoose.Schema;

//referencing the network model because partition has reference to network models
var Network = require("./networkModel").Network;

//partition objects will have an array-list of Network objects referenced by their ObjectId.
var partitionSchema = mongoose.Schema({
	 network_list : [{type : mongoose.Schema.Types.ObjectId, ref: 'Network'}], 
	});

/*
 * Below are static functions that can be used by a partition model.
 */


//stores a partition in the database, iff the passed in object follows partition structure 
partitionSchema.statics.savePartition = function (aPartition){
	var newPartition = new Partition(aPartition);
	newPartition.save();
}

//callback a partition object based off an ObjectId query search from the Partition collection
partitionSchema.statics.getPartitionByID = function (anID, callback){
	//ObjectId query for type Partition
	Partition.findOne({_id : anID}, function(err, obj){
		//Partition with queried ObjectId does not exist
		if(err) console.log("No partition with ObjectId " + anID);
		//Partition with queried ObjectId found 
		console.log("found partition" + obj);
		//callback object
		callback(obj);
	});
}

  //**** NOT SURE

//queries by partition for partition object and replaces object with passed in object thus maintaining objectId 
partitionSchema.statics.modifyPartitionByName = function (aString, aPartition){
    //query 
	Partition.findOne({partition_name : aString}, function(err,obj){
	   if(err) console.log("no Partition exists with that name");
	   obj = aPartition;
	   obj.save();
	   console.log("partition saved");
   });
}

//export and define this mongoose model named "Partition", including structure and static functions from "partitionSchema, and stored in collection "Partitions"
module.exports = mongoose.model('Partition', partitionSchema, 'Partitions');