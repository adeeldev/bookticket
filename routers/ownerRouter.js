var express = require('express');
var router = express.Router();
var moment = require('moment');
var ownerModel = require('../models/ownerModel');
var helperFunc = require('../lib/helperFunc');
var gcm = require('node-gcm');
router

	.get('', function (request, response){
		ownerModel.getAllOwner()
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
	.post('/login',function (request,response){
		
		var username = request.body.username;
		// var password = md5(request.body.password);
		var password = request.body.password;
		
		if((username == null || '') || (password == '' || null)){
			return response.status(400).send({'message' : 'Parameters are missing'}).end();
		}
		ownerModel.findOne({$and :[{"owner_name":username},{"owner_password":password}]},{'__v' : 0}, function (err,admin){
			console.log(admin);
			if(err){
				return response.status(500).send({'message' : 'Internal Server error. Please try again later','err' :err}).end();
			}
			console.log('admin data ' , admin);
			if(admin == null){
				return response.status(400).send({'message' : 'Invalid Username OR Password'}).end();
			}
			response.status(200).send(admin).end();
		})
	})	
	.post('/addOwner', function (request, response){

		var newOwner = {
			"owner_name" : request.body.owner_name,
			"owner_email" : request.body.owner_email,
			"owner_password" : request.body.owner_password,
			"organization_name" : request.body.organization_name,
			"type"           : 'admin'
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
	.post('/addSubAdmin', function (request, response){
		var newOwner = {
			"owner_name" : request.body.owner_name,
			"owner_email" : request.body.owner_email,
			"owner_password" : request.body.owner_password,
			"organization_name" : request.body.organization_name,
			"type"           : request.body.type
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
	.post('/deleteUser', function (request,response){
		var _id = request.body.userid;
		if(_id == null || ""){
			response.status(400).send({"message": "Parameter Missing"}).end();
		}else{
			ownerModel.findOneAndRemove({"_id" : _id},function (err,result){
				if(err){
					console.log("An Error has occured." + err);
					return response.status(500).send({"message" : "Server Error . Please try Agin Later." , "err" : err}).end();
				}
				response.status(200).send({"message" : "Deleted Successfully."}).end();
			});
		}
	})

module.exports = router;