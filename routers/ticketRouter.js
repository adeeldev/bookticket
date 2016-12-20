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
	.post('/getUserOrders', function (request, response){
		var userid = request.body.uid;
		var type = request.body.type;
		console.log(type);
		if(type == 'admin'){
			ticketModel.getOrders()
			.then(function (result){
				console.log(result);
				if(result == ""){
				return response.status(404).send(result);
				}
				response.status(200).send(result);
			}).catch(function (err){
				console.log("Error : " + err);
				return response.status(500).send({"code":"ET:Ye","message" : "An error has Occured while retrieving event data.", "err" : err}).end();
			})
		}
		if(type == 'sAdmin'){
			ticketModel.getAdminUserOrder(userid)
			.then(function (result){
				if(result == ""){
				response.status(404).send({'msg':'no order found'});
				}
				response.status(200).send(result);
			}).catch(function (err){
				console.log("Error : " + err);
				response.status(500).send({"code":"ET:Ye","message" : "An error has Occured while retrieving event data.", "err" : err}).end();
			})
		}
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
			"payment_type" : request.body.payment_type,
			"order_id" : request.body.order_id,
			"event_id" : request.body.event_id,
			"event_name" : request.body.event_name,
			"status" : 'pending'
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
	.post('/verifyOrder', function (request, response){
		var orderId  = request.body.id;
		var status = request.body.status;
		if(status == 'verified'){
			var newStatus = 'pending';
		}else{
			var newStatus = 'verified';
		}
		if((orderId == null || "") ){
			response.status(400).send({"message" : "Parameters are missing."}).end();
		}else{
		ticketModel.findOne({"_id" : orderId},function (err, order){
			if(err){
				return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
			}
			if(order == null){
				return response.status(400).send({"message" : "Invalid Email OR Code"}).end();
			}
			order.status = newStatus;
			order.save(function (error,result){
				if(error){
					return response.status(500).send({"message" : "Internal Server Error", "err" : error}).end();
				}

				
				var message = "Your User name is updated.Your new Username is ";
				var subject = "Order Updated";
				// helperFun.emailSender(result.email, message, subject)
				// 	.then(function (result){
				// 		console.log("Email is sent.");
				// 	})
				// 	.catch(function (error){
				// 		console.log(error);
				// 	})
				delete result.__v;
				response.status(200).send(result).end();
			})
		})
		}
	})
	.get('/user/orders/:uid', function (request, response){
		var userId = request.params.uid;
			ticketModel.getAdminUserOrder(userId)
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

module.exports = router;
