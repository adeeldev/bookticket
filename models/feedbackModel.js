var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
	"username" : String,
	"name" : String,
	"email" : String,
	"message":String,
	"createdOn" : Date
});

var feedbackSchema = mongoose.model('feedbackSchema',feedbackSchema);

module.exports = feedbackSchema;