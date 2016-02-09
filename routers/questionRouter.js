var express = require('express');
var router = express.Router();
var questionModel = require('../models/questionModel');
var userModel = require('../models/userModel');
var users = require('../models/userModel');
var helperFun = require('../lib/helperFunc');
var moment = require('moment');
router
	.get('', function (request, response){
		questionModel.findOne({'isExpired' : false},function (err,result){
			if(err){
				return response.status(500).send({'message' : "Internal Server Error", "err" : err}).end();
			}
			if(result == null){
				return response.status(200).send({'message' : "No Live Question"}).end();
			}
			response.status(200).send(result).end();
		})
	})
	.get('/allQuestion', function (request, response){
		questionModel.find({}).sort({'endTime' : -1}).exec(function (err,result){
			if(err){
				return response.status(500).send({'message' : "Internal Server Error", "err" : err})
			}
			response.status(200).send(result).end();
		})
	})
	.post('/addQuestion', function (request, response){
		var toLocalTime = function(time) {
			var d = new Date(time);
			var offset = (new Date().getTimezoneOffset() / 60);
			var n = new Date(d.getTime() + offset);
			return n;
		};
		console.log(request.body.endTime);
		var newQuestion = {
			"question": request.body.question,
			"options": request.body.options,
			"correctAnswer": request.body.correctAnswer,
			"userAnswer" : [],
			"startTime" : toLocalTime(request.body.startTime),
			"endTime" : toLocalTime(request.body.endTime),
			'winner' : {},
			"isExpired" : false
		};
		if((newQuestion.correctAnswer == "" || null) || (newQuestion.question == "" || null) || (newQuestion.options == "" || null)){
			return response.status(400).send({"message" : "Invalid Parameters OR Parameters are missing."}).end();
		}
		questionModel.addQuestion(newQuestion)
		.then(function (event){
			if(event == null){
				response.status(405).send({"code":"NQ-Dup","message" : "Duplicate Event"}).end();
			}else{

				var message = "Answer a simple question and win a surprise Gift!";
				helperFunc.sendNotification('question',message,function (error,result){
					if(error){
						console.log(error);
					}else{
						console.log("Notification is send");
					}
				})
				response.status(200).send({"data" : event}).end();				
			}
		})
		.catch(function (err){
			console.log("Server error : " + err);
			response.status(500).send({"code": "NQ-Se","message" : "Server Error. Please try agin later.", "err" : err}).end();
		})
	})
	.post('/viewQuestion', function (request, response){
		console.log(request.body.questionId);
		questionModel.findOne({"_id" : request.body.questionId},function (err, Question){
			if(err){
				return response.status(500).send({"message" : "Internal server Error", "err" : err}).end();
			}
			response.status(200).send({"data" : Question}).end();

		})
	})
	.post('/questionAnswer' , function (request,response){
		console.log(request.body);
		var id = request.body.questionId;
		var user_id = request.body.user_id;
		var answer = request.body.answer;
		if((id == null || "") || (user_id == null || "")){
			return response.status(400).send("Parameters Are missing").end();
		}
		questionModel.findOne({"_id" : id},function (err, Question){
			if(err){
				return response.status(500).send({"message" : "Internal server Error", "err" : err}).end();
			}
			console.log(Question);
			userModel.findOne({'_id' : user_id},function (prob,user){
				var isAnswered = false;
				if(prob){
					return response.status(500).send({'message' :"Internal server Error",'err':prob}).end();
				}
				if(user == null){
					return response.status(400).send("Invalid User ID").end();
				}
				for(var i = 0; i<Question.userAnswer.length; i++){
					if(Question.userAnswer[i].user.email === user.email){
						isAnswered = true;
						break;
					}
				}
				if(isAnswered){
					return response.status(200).send({"message" : "You have Already answered this question."});
				}
				var newAnswer = {
					'user' : user,
					'answer' : answer,
					'date' : moment().format('MM-DD-YYYY hh:mm a')
				}
				Question.userAnswer.push(newAnswer);
				Question.save(function (error, result){
					if(error){
						return response.status(500).send({"message" : "Internal server Error", "err" : error}).end();
					}
					response.status(200).send({"message" : "Your answer submitted successfully."}).end();
				})
			})
		})
	})
	.get('/expireQuestion',function (request,response){
		questionModel.find({},function (error, questions){
			if(error){
				return response.status(500).send({"message" : "Internal Server Error. Please try again.", "err" : error});
			}
			var date = moment();
			date = moment(date,'MM-DD-YYYY h:mm a');
			for(var i = 0; i < questions.length; i++){
				// if(date > questions[i].endTime){
					questions[i].isExpired = true;
					questions[i].save();
				// }
			}
			response.status(200).send({"message" : "Job is done"});
		})
	})
	.get('/winner', function (request,response){
		
		questionModel.find({},{'_id' : 1, 'winner' : 1,'question' : 1, 'correctAnswer' : 1},function (error,questions){
			if(error){
				return response.status(500).send({'message' : 'Internal Server error. Please try agin later.', 'err': error});
			}
			if(questions.length == 0){
				return response.status(200).send({"message" : "No Question found."}).end();
			}
			// var winners = [];
			// for(var i = 0; i < questions.length; i++){
			// 	var sortedArray = questions[i].userAnswer.sort(compare);
			// 	for(var j = 0; j < sortedArray.length; j++){
			// 		if(questions[i].correctAnswer == sortedArray[j].answer){
			// 			var obj = {
			// 				"Question" : questions[i].question,
			// 				"username" : sortedArray[j].username,
			// 				"Answer" : sortedArray[j].answer,
			// 				"AnswerTime" : sortedArray[j].answerTime
			// 			};
			// 			winners.push(obj);
			// 			break;
			// 		}
			// 	}
			// }
			response.status(200).send({"winners" : questions}).end();
		})
	})
	.post('/addWinner' ,function (request,response){
		console.log(request.body);
		var closeQue = request.body.question;
		if((closeQue == null || '')){
			return response.status(400).send({"message" : "Parameters are missing."}).end();
		}
		questionModel.findOne({"_id" : closeQue._id},function (error,question){
			if(error){
				return response.status(500).send({"message" : "Internal Server Error.", "err" : error});
			}
			if(question == null){
				return response.status(400).send({"message" : "Invalid Question ID."});	
			}
			question.winner = closeQue.winner;
			question.save(function (err,res){
				if(err){
					return response.status(500).send({"message" : "Internal Server Error.", "err" : err});
				}
				response.status(200).send({"message" : "Winner Added."}).end();
			})
		})

	})
	.post('/updateQue', function (request,response){
		var editedQue = request.body.question;
		if(editedQue == null){
			return response.status(400).send({"message" : "Parameters are missing."}).end();	
		}
		questionModel.findOne({'_id' : editedQue._id},function (err,question){
			if(err){
				return response.status(500).send({"message" : "Internal Server Error.", "err" : err});	
			}
			question = editedQue;
			question.save(function (error, result){
				if(error){
					return response.status(500).send({"message" : "Internal Server Error.", "err" : error});	
				}
				response.status(200).send({'message' : 'Edited successfully.'}).end();
			})
		})
	});

function compare(userA, userB){
	
	return userA.answerTime - userB.answerTime;
}


module.exports = router;