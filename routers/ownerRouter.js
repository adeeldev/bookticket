var express = require('express');
var router = express.Router();
var moment = require('moment');
var ownerModel = require('../models/ownerModel');
var helperFunc = require('../lib/helperFunc');
var gcm = require('node-gcm');
router

	.get('', function (request, response){
		var userid = request.params.userid;
		ownerModel.getAllOwner(userid)
		.then(function (result){
			if(result == ""){
			response.status(404).send({'msg':'no owner found'});
			}
			response.status(200).send(result);
		}).catch(function (err){
			console.log("Error : " + err);
			response.status(500).send({"code":"ET:Ye","message" : "An error has Occured while retrieving event data.", "err" : err}).end();
		})
	})
	.get('/:userid', function (request, response){
		var userid = request.params.userid;
		ownerModel.getOwner(userid)
		.then(function (result){
			if(result == ""){
			response.status(404).send({'msg':'no owner found'});
			}
			response.status(200).send(result);
		}).catch(function (err){
			console.log("Error : " + err);
			response.status(500).send({"code":"ET:Ye","message" : "An error has Occured while retrieving event data.", "err" : err}).end();
		})
	})
	.post('/addOwner', function (request, response){

		var newOwner = {
			"owner_name" : request.body.owner_name,
			"owner_email" : request.body.owner_email,
			"owner_password" : request.body.owner_password,
			"organization_name" : request.body.organization_name
		};

		ownerModel.addOwner(newOwner)
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