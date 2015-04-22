/**
 * Network Iterator
 * @param networkList is an ARRAY of network OBJECTS
 */
function NetworkIterator(networkList){
	this.networkList=networkList;
	
	this.index=0;
  
	//Required
	this.first = function() {
		return this.networkList[0];
	};
	//Required
	this.next = function() {
		var network=this.networkList[this.index];
		this.index++;
		return network;
	};
	//Required
	this.hasNext = function() {
		return this.index<this.networkList.length;
	};
	//Required
	this.reset = function() {
		this.index=0;
	};
	//Required
	/**
	   * Does some callback function on each item in the deviceList
	   */
	this.each = function(callback) {
		for (var item = this.first(); this.hasNext(); item = this.next()) {
			callback(item);
		}
	};
}

module.exports=NetworkIterator;