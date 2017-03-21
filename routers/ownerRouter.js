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
		var password = request.body.password;
		var langType = request.body.langType;

		if((username == null || '') || (password == '' || null) || (langType == '' || null)){
			return response.status(400).send({'message' : 'Parameters are missing'}).end();
		}
		ownerModel.findOne({$and :[{"owner_name":username},{"owner_password":password}]},function (err,User){
			if(err){
				return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
			}
			if(User == null){
				return response.status(400).send({"message" : "Invalid Email OR Code"}).end();
			}
			ownerModel.findByIdAndUpdate(User._id,{ $set: { langType: langType }}, { new: true }, function (err, Admin) {
			  if (err) return handleError(err);
				response.status(200).send(Admin).end();
			});

		})
	})



	router.post('/addOwner', function (request, response){
		console.log(request.body.langType);
		var newOwner = {
			"owner_name" : request.body.owner_name,
			"owner_email" : request.body.owner_email,
			"owner_password" : request.body.owner_password,
			"organization_name" : request.body.organization_name,
			"langType" : request.body.langType,
			"type"           : 'admin'
		};
		console.log(newOwner);
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
				"distance_ranges"		: request.body.distance_ranges,
				"courier_charges"		: request.body.courier_charges,
				"location"					: request.body.location.formatted_address,
				"fixed_price"				: request.body.fixed_price,
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
			// ownerModel.findOneAndRemove({"_id" : _id},function (err,result){
			// 	if(err){
			// 		console.log("An Error has occured." + err);
			// 		return response.status(500).send({"message" : "Server Error . Please try Agin Later." , "err" : err}).end();
			// 	}
			// 	response.status(200).send({"message" : "Deleted Successfully."}).end();
			// });
			ownerModel.findOne({"_id" : _id},function (err,User){
				if(err){
					return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
				}
				if(User == null){
					return response.status(400).send({"message" : "Invalid Email OR Code"}).end();
				}


				User.isActive 			= true;
				User.save(function (error,result){
					if(error){
						return response.status(500).send({"message" : "Internal Server Error", "err" : error}).end();
					}
					response.status(200).send(result).end();
				})
			})


		}
	})

	router.post('/userById', function (request,response){
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
		if(request.body.location == null || ""){
			var data = request.body;
			var address = request.body.location;
			var organization_name 	= data.organization_name,
					owner_name 					= data.owner_name,
					owner_password 			= data.owner_password,
					share 							= data.share,
					courier_charges 		= data.courier_charges,
					distance_ranges 		= data.distance_ranges,
					type								= data.type,
					courier_charges 		= data.courier_charges;
					fixed_price					= data.fixed_price;
					// console.log(data);
			if((data._id == null || "") && (data.email == null || "")){
				response.status(400).send({"message" : "Parameters are missing."}).end();
			}
			ownerModel.findOne({"_id" : data._id},function (err,User){
				if(err){
					return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
				}
				if(User == null){
					return response.status(400).send({"message" : "Invalid Email OR Code"}).end();
				}
				User.organization_name 		= organization_name,
				User.owner_name 					= owner_name,
				User.owner_password 			= owner_password,
				User.share 								= share,
				User.courier_charges 			= courier_charges,
				User.distance_ranges			= distance_ranges,
				User.type 								= type;
				User.fixed_price					= fixed_price;
				User.save(function (error,result){
					if(error){
						return response.status(500).send({"message" : "Internal Server Error", "err" : error}).end();
					}
					delete result.__v;
					response.status(200).send(result).end();
				})
			})
		}else{
			console.log('in else condition');
			var address = request.body.location;
			geocoder.geocode(address, function(err, res) {
			// if(err){
			// 	response.status(500).send({"code": "NE-Se","message" : "Server Error. Please try agin later.", "err" : err}).end();
			// }
			console.log(err);
			console.log(res);
			if(res){
				var lat = res[0].latitude;
				var lon = res[0].longitude;
			}
			var data = request.body;
			var organization_name 	= data.organization_name,
					owner_name 					= data.owner_name,
					owner_password 			= data.owner_password,
					share 							= data.share,
					courier_charges 		= data.courier_charges,
					distance_ranges 		= data.distance_ranges,
					fixed_price					= data.fixed_price,
					type								= data.type,
					location 						= address,
					latitude 						= lat,
					longitude 					= lon;
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
				User.distance_ranges			= distance_ranges;
				User.type 								= type;
				User.location 						= location,
				User.latitude 						= latitude,
				User.longitude 						= longitude,
				User.courier_charges 			= courier_charges;
				User.fixed_price 					= fixed_price;
				User.save(function (error,result){
					if(error){
						return response.status(500).send({"message" : "Internal Server Error", "err" : error}).end();
					}
					var message = "Your User name is updated.Your new Username is : " + result.username;
					var subject = "Profile Update";
					delete result.__v;
					response.status(200).send(result).end();
				})
			})
			}
		});
		}



	});


module.exports = router;
