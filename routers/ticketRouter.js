var express = require('express');
var router = express.Router();
var moment = require('moment');
var ticketModel = require('../models/ticketModel');
var helperFunc = require('../lib/helperFunc');
var gcm = require('node-gcm');
router
	.get('/:userid', function (request, response){
		var userid = request.params.userid;
		ticketModel.getUserOrder(userid)
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
	.post('/addOrder', function (request, response){

		var newOrder = {
			"category_name" : request.body.category_name,
			"qty" : request.body.qty,
			"delivery_method" : request.body.delivery_method,
			"owner_id" : request.body.owner_id,
			"user_id" : request.body.user_id,
			"user_address" : request.body.user_address,
			"user_phone_no" : request.body.user_phone_no,
			"user_name" : request.body.user_name,
		};

		if((newOrder.category_name == null || "") || (newOrder.qty == null || "") || (newOrder.owner_id == null || "") || (newOrder.user_id == null || "") || (newOrder.user_name == null || "")){
			return response.status(400).send({"message" : "Invalid Parameters OR Parameters are missing."}).end();
		}
		ticketModel.addOrder(newOrder)
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