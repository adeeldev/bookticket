var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');
var moment = require('moment');


var ownersSchema = new Schema({
	owner_name				: String,
	owner_email				: String,
	owner_password		: String,
	organization_name	: String,
	type							: String,
	share							: String,
	courier_charges		: String,
	amount    				: Number,
	distance_ranges		: Number,
	location					: String,
	latitude					: Number,
	longitude					: Number,
	isActive					: Boolean,
	created						: { type: Date,default: Date.now}
});

ownersSchema.statics.addOwner = function addOwner(data){
	var defered = Q.defer();
	// data.eventDate = new Date(data.eventDate);
	var newOwner = mongoose.model('OwnersSchema');
	var Owner  = new newOwner(data);
	Owner.save(function (err,event){
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

ownersSchema.statics.getOwner = function getOwner (userid){
	var defered = Q.defer();
	this.find({'_id' : userid },{"__v":0}).sort().exec(function (err,result){
		if(err){
			defered.reject(err);
		}else{
			defered.resolve(result);
		}
	})
	return defered.promise;
}

ownersSchema.statics.getAllOwner = function getAllOwner (){
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

ownersSchema.statics.getSubAdmins = function getSubAdmins (){
	var defered = Q.defer();
	this.find({'type' : 'sAdmin'},{"__v":0}).sort().exec(function (err,result){
		if(err){
			defered.reject(err);
		}else{
			defered.resolve(result);
		}
	})
	return defered.promise;
}

var ownersSchema = mongoose.model('OwnersSchema', ownersSchema);
module.exports = ownersSchema;
