var express = require('express');
var router = express.Router();
var moment = require('moment');
var exchangeModel = require('../models/ticketExchageModel');
var helperFunc = require('../lib/helperFunc');
var gcm = require('node-gcm');
router
	.get('', function (request, response){
		exchangeModel.getAllExchangeEvent()
		.then(function (result){
			if(result == ""){
			response.status(404).send({'msg':'no order found'});
			}
			response.status(200).send(result);
		}).catch(function (err){
			console.log("Error : " + err);
			response.status(500).send({"code":"ET:Ye","message" : "An error has Occured while retrieving event data.", "err" : err}).end();
		})
	})
	.get('/:userid', function (request, response){
		var userid = request.params.userid;
		exchangeModel.getExchangeEvent(userid)
		.then(function (result){
			if(result == ""){
			response.status(404).send({'msg':'no order found'});
			}
			response.status(200).send(result);
		}).catch(function (err){
			console.log("Error : " + err);
			response.status(500).send({"code":"ET:Ye","message" : "An error has Occured while retrieving event data.", "err" : err}).end();
		})
	})
	.post('/eventExchange', function (request, response){
		var newExchangeEvent = {
			"event_name" : request.body.event_name,
			"user_id" : request.body.user_id,
			"event_description" : request.body.event_description,
			"event_date" : request.body.event_date,
			"event_start_time" : request.body.event_start_time,
			"event_end_time" : request.body.event_end_time,
			"price" : request.body.price,
			"event_address" : request.body.event_address,
			"phone": request.body.phone,
			"qty" : request.body.qty

		};

		if((newExchangeEvent.user_id == null || "") || (newExchangeEvent.event_date == null || "") || (newExchangeEvent.event_start_time == null || "") || (newExchangeEvent.price == null || "") || (newExchangeEvent.qty == null || "")){
			return response.status(400).send({"message" : "Invalid Parameters OR Parameters are missing."}).end();
		}
		exchangeModel.addOrder(newExchangeEvent)
		.then(function (event){
			if(event == null){
				response.status(400).send({"code":"NE-Dup","message" : "Duplicate Order"}).end();
			}else{
				response.status(200).send({"data" : event}).end();
			}
		})
		.catch(function (err){
			console.log("Server error : " + err);
			response.status(500).send({"code": "NE-Se","message" : "Server Error. Please try agin later.", "err" : err}).end();
		})
	})

module.exports = router;
