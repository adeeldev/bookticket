var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
	"firstName" : String,
	"lastName" : String,
	"email" : String,
	"username" : String,
	"password" : String,
	"langType": String,
	"createdOn" : Date
});

var adminModel = mongoose.model('adminModel',adminSchema);

module.exports = adminModel;
