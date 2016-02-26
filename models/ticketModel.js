var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var moment = require('moment');
var ticketSchema = new Schema({
	category_name :  String,
	qty : String,
	delivery_method : String,
	owner_id : String,
	user_id : String,
	user_address : String,
	user_phone_no : String,
	user_name : String,
	status: {
		type: String,
		default: 'pending'
	}
});

ticketSchema.statics.addOrder = function addOrder(data){
	var defered = Q.defer();
	// data.eventDate = new Date(data.eventDate);
	var newOrder = mongoose.model('TicketModel');
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

ticketSchema.statics.getUserOrder = function getUserOrder (userid){
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
ticketSchema.statics.getAdminUserOrder = function getAdminUserOrder (userid){
	var defered = Q.defer();
	this.find({'owner_id' : userid },{"__v":0}).sort().exec(function (err,result){
		if(err){
			defered.reject(err);
		}else{
			defered.resolve(result);
		}
	})
	return defered.promise;
}

ticketSchema.statics.getOrders = function getOrders (){
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

var ticketModel = mongoose.model('TicketModel', ticketSchema);
module.exports = ticketModel;