exports.size=function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
};


exports.merge_objects = function(obj1,obj2){
	    for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
	    return obj1;
};
exports.compareObjects=function(obj1,obj2){
	for(key in obj1){
		if(obj2.hasOwnProperty(key)){
			if(obj1[key]!=obj2[key]){
				if(Array.isArray(obj1[key])){
					exports.compareObjects(obj1[key],obj2[key]);
				}
				else return false;
			}
		}
	}
	return true;
};

exports.replaceAll=function(find, replace, str) {
	  return str.replace(new RegExp(find, 'g'), replace);
};

exports.findSimulationByName=function(simulationName,simulationList){
	for(index in simulationList){
		if (simulationList[index].simulation_name==simulationName) return simulationList[index];

	}
	return -1;
};
exports.findNetworkByName=function(name,list){
	for(index in list){
		if (list[index].networkName==name){
			return list[index];}
		}

	return -1;
};

exports.findDeviceByName=function(name,list){
	for(index in list){
		if (list[index].deviceJSON.current_device_name==name) return list[index];

	}
	return -1;
};
exports.findByUniqueID=function(uniqueID,list){

	for(index in list){
		if(list[index]._id==uniqueID){
			return list[index];
		} 
	}
	
	return -1;
}

exports.randomElement = function(array){
	var element = array[Math.floor(Math.random()*array.length)];
	return element;
}

exports.deepCopy=function(item){
	if(item !== undefined && item !== ''){
		//console.log( " This is item after the check\n" + item);
		var jsonstring = JSON.stringify(item);
		var item = JSON.parse(jsonstring);
		
	}else{
		//console.log("Passed undefined object to deepCopy");
	}
	return item;
}
