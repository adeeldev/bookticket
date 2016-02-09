var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var moment = require('moment');


var ticketExchangeSchema = new Schema({
	event_name :  String,
	user_id : String,
	event_description : String,
	event_date : Date,
	event_start_time : Date, 
	event_end_time : Date,
	price : String,
	event_address : String,
	qty : String
});

ticketExchangeSchema.statics.addOrder = function addOrder(data){
	var defered = Q.defer();
	// data.eventDate = new Date(data.eventDate);
	var newOrder = mongoose.model('TicketExchageModel');
	var Order  = new newOrder(data);
	Order.save(function (err,event){
		if(err){
			console.log(err);
			defered.reject(err);
		}else{
			delete event.__v;
			defered.resolve(event);
		}
	});
	return defered.promise;
}

ticketExchangeSchema.statics.getExchangeEvent = function getExchangeEvent (userid){
	var defered = Q.defer();
	this.find({'user_id' : userid },{"__v":0}).sort().exec(function (err,result){
		if(err){
			defered.reject(err);
		}else{
			defered.resolve(result);
		}
	})
	return defered.promise;
}   

ticketExchangeSchema.statics.getAllExchangeEvent = function getAllExchangeEvent (){
	var defered = Q.defer();
	this.find({},{"__v":0}).sort().exec(function (err,result){
		if(err){
			defered.reject(err);
		}else{
			defered.resolve(result);
		}
	})
	return defered.promise;
} 

var ticketExchageModel = mongoose.model('TicketExchageModel', ticketExchangeSchema);
module.exports = ticketExchageModel;