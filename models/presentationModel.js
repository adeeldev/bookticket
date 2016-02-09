var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Q = require('q');

var presentationScehma = new Schema({
	title : String,
	thumbnail : String,
	url : String,
	type:String,
	date : Date
});

// presentationScehma.statics.addPresentation = function addPresentation(presData){
// 	var defered = Q.defer();

// 	return defered.promise;
// }

var presentationModel = mongoose.model('presentationModel',presentationScehma);
module.exports = presentationModel;