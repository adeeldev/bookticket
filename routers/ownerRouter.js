var express = require('express');
var router = express.Router();
var moment = require('moment');
var ownerModel = require('../models/ownerModel');
var helperFunc = require('../lib/helperFunc');
var gcm = require('node-gcm');
var NodeGeocoder = require('node-geocoder');
var options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: 'AIzaSyCDKm-dvw_vxm3P00MCX0BH4VGWVxOCroM',
	formatter: null
};
var geocoder = NodeGeocoder(options);


	router.get('', function (request, response){
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
	router.get('/:userid', function (request, response){
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
	router.post('/login',function (request,response){

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
	router.post('/addOwner', function (request, response){

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
	router.post('/addSubAdmin', function (request, response){
		geocoder.geocode(request.body.location.formatted_address, function(err, res) {
			if(err){
				response.status(500).send({"code": "NE-Se","message" : "Server Error. Please try agin later.", "err" : err}).end();
			}
			var newOwner = {
				"owner_name" 				: request.body.owner_name,
				"owner_email" 			: request.body.owner_email,
				"owner_password" 		: request.body.owner_password,
				"organization_name" : request.body.organization_name,
				"type"           		: request.body.type,
				"share" 						: request.body.share,
				"amount"						: request.body.amount,
				"courier_charges"		: request.body.courier_charges,
				"location"					: request.body.location.formatted_address,
				"latitude"					: res[0].latitude,
				"longitude"					: res[0].longitude
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
		});

	})
	router.post('/deleteUser', function (request,response){
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

	router.post('/userById', function (request,response){
		console.log(request.body.userId);
		var id = request.body.userId;
		if(id == null || ""){
			response.status(400).send({"message": "Parameter Missing"}).end();
		}else{
			ownerModel.find({"_id" : id},function (err,result){
				if(err){
					console.log("An Error has occured." + err);
					return response.status(500).send({"message" : "Server Error . Please try Agin Later." , "err" : err}).end();
				}
				response.status(200).send(result).end();
			});
		}
	})

	router.post('/findAndUpdateById', function (request,response){
		console.log(request.body.location);
		if(request.body.location.formatted_address){
			var address = request.body.location.formatted_address;
		}else{
			var address = request.body.location;
		}
		geocoder.geocode(address, function(err, res) {
		if(err){
			response.status(500).send({"code": "NE-Se","message" : "Server Error. Please try agin later.", "err" : err}).end();
		}
		var lat = res[0].latitude;
		var lon = res[0].longitude;
		var data = request.body;
		var organization_name 	= data.organization_name,
				owner_name 					= data.owner_name,
				owner_password 			= data.owner_password,
				share 							= data.share,
				courier_charges 		= data.courier_charges,
				amount 							= data.amount,
				location 						= address,
				latitude 						= lat,
				longitude 					= lon,
				courier_charges 		= data.courier_charges;
				// console.log(data);
		if((data._id == null || "") && (data.email == null || "")){
			response.status(400).send({"message" : "Parameters are missing."}).end();
		}else{
		ownerModel.findOne({"_id" : data._id},function (err,User){
			if(err){
				return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
			}
			if(User == null){
				return response.status(400).send({"message" : "Invalid Email OR Code"}).end();
			}
			User.organization_name 		=  organization_name,
			User.owner_name 					= owner_name,
			User.owner_password 			=  owner_password,
			User.share 								=  share,
			User.courier_charges 			= courier_charges,
			User.amount								= amount;
			User.location 						= location,
			User.latitude 						= latitude,
			User.longitude 						= longitude,
			User.courier_charges 			= courier_charges;
			User.save(function (error,result){
				if(error){
					return response.status(500).send({"message" : "Internal Server Error", "err" : error}).end();
				}
				var message = "Your User name is updated.Your new Username is : " + result.username;
				var subject = "Profile Update";
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
	});
	});


module.exports = router;
