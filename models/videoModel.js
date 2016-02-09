var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var videoSchema = new Schema({
	title : String,
	url : String,
	thumbnail : String,
	type:String,
	date : Date
});

var videoModel = mongoose.model('videoSchema',videoSchema);
module.exports = videoModel;