var config_map_test={ 
	'Partition1': 
	{'networka' :
	{ 'devicea' : 1,  'deviceb@mun.ca': 2, 'devicec@mun.ca':3},
	'networkb' :
			{ 'deviced': 4, 'devicee': 5},
		},
	 'Partition2':
	{ 'networkc' :
	{ 'devicef': 6, 'deviceg@mun.ca' : 7,  'deviceh@mun.ca': 8},
	'networkd' :
			{'devicei@mun.ca':9, 'device@mun.ca': 10},
		},
	 'Partition3':
	{ 'networke' : { 'devicek':'11'}
	},

			'freelist' : { 'devicef': 11, 'devicen@mun.ca' : 12,  'deviceo@mun.ca': 13 }

};
readConfigMap(config_map_test);
function readConfigMap(config_map){
	for(partition_name in config_map){
		console.log(partition_name);
		for(key in config_map[partition_name]){
			console.log(key);
		}
	}
}