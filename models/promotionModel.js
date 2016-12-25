var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var promotionSchema = new Schema({
	event_name :  String,
	event_description : String,
	event_date : Date,
	event_start_time : Date,
	event_end_time : Date,
	total_tickets : String,
	remaining_tickets : Number,
	is_electronic: String,
	price : String,
	event_address : String,
	event_category : String,
	location_latituude : String,
	location_longitude : String,
	owner_Id : String,
	banner_Image_url : String,
	seating_plan_doc_url : String,
	price : String,
	created : {
		type: Date,
		default: Date.now
	}
})

var promotionModel = mongoose.model('promotionModel',promotionSchema);

module.exports = promotionModel;
