/*
 * Mongoose models are required here. 
 */

var models = ['userModel.js', 'networkModel.js', 'simulationModel.js', 'partitionModel.js', 'stateModel.js', 'appModel.js','RDTModel.js'];
exports.initialize = function() {
    var l = models.length;
    for (var i = 0; i < l; i++) {
    	console.log("requiring " + models[i]);
        require("./" +models[i])();
    }
};