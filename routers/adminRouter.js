var express = require('express'),
	router = express.Router(),
	adminModel = require('../models/adminModel'),
	ownerModel = require('../models/ownerModel'),
	moment = require('moment'),
	helperFun = require('../lib/helperFunc'),
	md5 = require('md5');

router
	.post('/login',function (request,response){
		
		var username = request.body.username;
		var password = md5(request.body.password);
		// var password = request.body.password;
		
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
	.post('/update',function (request,response){
		var adminObj = request.body.admin;
		console.log(adminObj);
		if(adminObj == null){
			return response.status(400).send({'message' : 'Parameters are missing'}).end();	
		}
		adminModel.findOne({"_id" : adminObj._id,'password' : md5(adminObj.password)},function (err,admin){
			if(err){
				return response.status(500).send({'message' : 'Internal Server error. Please try again later','err' :err}).end();
			}
			if(admin == null){
				return response.status(400).send({'message' : 'Invalid Password'}).end();	
			}
			admin.password = md5(adminObj.password);
			admin.username = adminObj.username;
			admin.firstName = adminObj.firstName;
			admin.lastName = adminObj.lastName;
			admin.email = adminObj.email;
			admin.save(function (error,adminNew){
				if(error){
					return response.status(500).send({'message' : 'Internal Server error. Please try again later','err' :err}).end();	
				}
				response.status(200).send(adminNew).end();
			})
		})
	})
	.post('/addAdmin', function (request,response){
		var admin = request.body.admin;
		if(admin == null || ''){
			return response.status(400).send({'message' : 'Parameters are missing'}).end();
		}
		admin.password = md5(admin.password);
		// admin.createdOn = moment().format('MM-DD-YYYY hh:mm a');
		var newAdmin = new adminModel(admin);
		newAdmin.save(function (err,result){
			if(err){
				return response.status(500).send({'message' : 'Internal Server error. Please try again later','err' :err}).end();
			}
			response.status(200).send(result).end();
		});
	})

module.exports = router;