var mongoose =  require('mongoose'),
	userModel = require('./userModel'),
	Schema = mongoose.Schema,
	objectID = Schema.Types.ObjectId,
	Q = require('q');

var questionSchema = new Schema({
	question :  String,
	options : {
		"A" : String,
		"B" : String,
		"C" : String,
		"D" : String
	},
	correctAnswer : String,
	userAnswer:[{
		'user' : userModel.schema,
		'answer' : String,
		'date' : Date
	}],
	starTime: Date,
	endTime: Date,
	winner : {
		'_id' : Schema.Types.ObjectId,
		'name' : String,
		'username' : String,
		'password' : String,
		'agency' : String,
		'agencyName' : String,
		'email' : String,
		'city' : String,
		'telephone' : String,
		'dateCreated' : Date,
		'isVerified' : Boolean,
		'emailCode' : String,
		'deviceId' : String,
		'deviceName' : String,
		'notify' : Boolean
	},
	isExpired : Boolean
});

questionSchema.statics.addQuestion = function addQuestion(data){
	var defered = Q.defer();

	var newQuestion = mongoose.model('QuestionModel');
	var Question  = new newQuestion(data);
	Question.save(function (err,event){
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

var questionModel = mongoose.model('QuestionModel', questionSchema);
module.exports = questionModel;