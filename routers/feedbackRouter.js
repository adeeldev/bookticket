var express = require('express'),
	router = express.Router(),
	feedbackModel = require('../models/feedbackModel'),
	helperFun = require('../lib/helperFunc');

router
	.post('/addFeedback',function (request,response){
		var data = request.body;
		var adminEmail = 'ruhmarketing@thy.com'; 
		if((data.name == null || "") || (data.username == null) ||  (data.message == null || "")){
			return response.status(400).send({"message" : "Invalid Parameters OR Parameters are missing."}).end();
		}
		var feedback = new feedbackModel({
					"name" : data.name,
					"username" : data.username,
					"message": data.message,
					"date" : Date.now()
		});
		feedback.save(function (err,result){
			if(err){
				return response.status(500).send({"message" : "Internal Server error","err" : err});
			}
			var message = "Username: " +" "+data.username+"\n"+
						  "Name: "+data.name+"\n"+
						  "Message: "+data.message,
				subject = "Tukey Application Feedback";
			response.status(200).send({"message" : "added"}).end();
			return helperFun.emailSender(adminEmail, message, subject);
		})
	})



module.exports = router;