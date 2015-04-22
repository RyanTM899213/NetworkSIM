/**
 * Code for managing partitions on the client side
 */

/**
 * Segment a partition into two separate partitions
 */
function dividePartition(split_networks_list, partition_id){
	var local_simulation = get_local_simulation();
	//if the parameters are not null
	if(local_simulation !== null && split_networks_list!==null && partition_id!==null){
		//creates the body of the event
		var params = { 
				'split_networks_list': split_networks_list, 
				'partition_id': partition_id, 
				'simulation_id': local_simulation._id,
				};
		var url = '/divide/Partition';
		var timestamp = new Date();
		//adds the event to the event queue
		addToEventQueue(url, params, timestamp);
		
	}else{
		console.log("dividePartition was passed null parameters")
	}
}
/**
 * Merges two partitions into a single partition
 */
function mergePartition(partition_a_id, partition_b_id){
	var local_simulation = get_local_simulation();
	//if the parameters are not null
	if(local_simulation!==null && partition_a_id!==null && partition_b_id!==null){
		//creates the body of the event
		var params = { 
				'partition_a_id': partition_a_id, 
				'partition_b_id' : partition_b_id,
				'simulation_id': local_simulation._id,
				};
		var url = '/merge/Partitions';
		var timestamp = new Date();
		//adds the event to the event queue
		addToEventQueue(url, params, timestamp);
	}
}
