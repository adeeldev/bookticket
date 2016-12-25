var promotionModel = require('../models/promotionModel');
		express = require('express'),
		router = express.Router(),
		fs = require('fs'),
		moment = require('moment'),
		mongoose = require('mongoose'),
		multipart = require('connect-multiparty'),
		multipartMiddleware = multipart(),
		path = require('path'),
		helperFunc = require('../lib/helperFunc'),
		nodemailer = require('nodemailer');

router.get('/allPromotions',function (request,response){
	var date = Date.now();
	promotionModel.find({},{'__v' : 0}).sort({date : '-1'}).exec(function	(err,result){
		if(err){
			console.log(err);
			return response.status(500).send({"message" : "Internal server error.","code": "PE-ALL","err" : err}).end();
		}
		if(result.length==0){
			return response.status(200).send({"message" : "No data found."}).end();
		}
		response.status(200).send(result).end();
	})
})

router.get('/allEvents',function (request,response){
	var date = Date.now();
	promotionModel.find({},{'__v' : 0}).sort({date : '-1'}).exec(function	(err,result){
		if(err){
			console.log(err);
			return response.status(500).send({"message" : "Internal server error.","code": "PE-ALL","err" : err}).end();
		}
		if(result.length==0){
			return response.status(200).send({"message" : "No data found."}).end();
		}
		response.status(200).send(result).end();
	})
})

router.get('/allPromotion',function (request,response){
	var date = Date.now();
	promotionModel.find({},{'__v' : 0}).sort({date : '-1'}).exec(function	(err,result){
		if(err){
			console.log(err);
			return response.status(500).send({"message" : "Internal server error.","code": "PE-ALL","err" : err}).end();
		}
		if(result.length==0){
			return response.status(200).send({"message" : "No data found."}).end();
		}
		response.status(200).send(result).end();
	})
})

router.get('/:id', function(request,response){
	var id = request.params.id;
	if(id == '' || null){
		return response.status(400).send({"message" : "Parameter missing"}).end();
	}
	promotionModel.find({"event_category" : id},{'__v': 0},function (err,promotion){
		if(err){
			return response.status(500).send({"message" : "Internal server error.","code": "PE-One", "err" : err}).end();
		}
		if(promotion == null){
			return response.status(200).send({"message" : "No data found."}).end();
		}
		response.status(200).send(promotion).end();
	})
})

router.post('/getPromotionById', function(request,response){
	var id = request.body.promotionId;
	if(id == '' || null){
		return response.status(400).send({"message" : "Parameter missing"}).end();
	}
	promotionModel.find({"_id" : id},{'__v': 0},function (err,promotion){
		if(err){
			return response.status(500).send({"message" : "Internal server error.","code": "PE-One", "err" : err}).end();
		}
		if(promotion == null){
			return response.status(200).send({"message" : "No data found."}).end();
		}
		response.status(200).send(promotion).end();
	})
})

router.post('/getPromotionByIdAdmin', function(request,response){
	var userid = request.body.uid;
	var type = request.body.type;
	if(userid == '' || null){
		return response.status(400).send({"message" : "Parameter missing"}).end();
	}
	if(type == 'admin'){
		promotionModel.find({},{'__v' : 0}).sort({date : '-1'}).exec(function	(err,result){
			if(err){
				console.log(err);
				return response.status(500).send({"message" : "Internal server error.","code": "PE-ALL","err" : err}).end();
			}
			if(result.length==0){
				return response.status(200).send({"message" : "No data found."}).end();
			}
			return response.status(200).send(result).end();
		})
	}
	if(type == 'sAdmin'){
		promotionModel.find({"owner_Id" : userid},{'__v': 0},function (err,promotion){
			if(err){
				return response.status(500).send({"message" : "Internal server error.","code": "PE-One", "err" : err}).end();
			}
			if(promotion == null){
				return response.status(200).send({"message" : "No data found."}).end();
			}
			response.status(200).send(promotion).end();
		})
	}
})

router.post('/addPromotionAdmin',multipartMiddleware,function (request,response){
	var event_name 				=  request.body.event_name,
      event_description 		=  request.body.event_description,
      banner_Image_url 			=  request.body.banner_Image_url,
      event_start_time 			=  request.body.event_start_time,
      event_end_time 				=  request.body.event_end_time,
      total_tickets 				=  request.body.total_tickets,
      remaining_tickets 		=  request.body.total_tickets,
      owner_Id 							=  request.body.owner_Id,
      event_address 				=  request.body.event_address,
      event_category 				=  request.body.event_category,
      location_latituude 		=  request.body.location_latituude,
      location_longitude 		=  request.body.location_longitude,
      seating_plan_doc_url 	=  request.body.seating_plan_doc_url,
      price									=  request.body.price,
			is_electronic					=  request.body.type,
			event_date 				=  Date.now();
	if((event_name == "" || null)  || (owner_Id == "" || null)){
		return response.status(400).send({"message" : "Parameter Missing"});
	}else{
	var newProm = new promotionModel({
		'event_name'		: event_name,
    'event_description'	: event_description,
    'banner_Image_url'	: banner_Image_url,
    'event_start_time'	: event_start_time,
    'event_end_time'	: event_end_time,
    'total_tickets'		: total_tickets,
    'remaining_tickets' : remaining_tickets,
    'owner_Id'			: owner_Id,
    'event_address'		: event_address,
    'event_category'	:event_category,
    'location_latituude': location_latituude,
    'location_longitude': location_longitude,
    'seating_plan_doc_url' : seating_plan_doc_url,
		'event_date' 		: event_date,
		'price'      		: price,
		'is_electronic' : is_electronic
	});
	console.log();
	newProm.save(function (error,result){
		if (error) {
			return response.status(500).send({"message" : "Internal Server error. Please try again later.", "err" : error}).end();
		}
		// var message = 'Test message';
		// helperFunc.emailSender('promotion',message,function (err,solution){
		// 	if(err){
		// 		console.log(err);
		// 	}else{
		// 		console.log("Message Sent!!.");
		// 	}
		// })
		response.status(200).send(result).end();
		})
	}
})

router.post('/addPromotion',multipartMiddleware,function (request,response){
		var description = request.body.description,
			title = request.body.title,
			expireDate = helperFunc.getDateFunction(request.body.expireDate),
			date = helperFunc.getDateFunction(request.body.date),
			file = request.files.file_0;
		if((title == "" || null) ||(expireDate == "Invalid Date") || (date == "Invalid Date") || (file == null) || (description == "" || null)){
			return response.status(400).send({"message" : "Parameter Missing"});
		}else{
			var id = mongoose.Types.ObjectId(),
				fileData = helperFunc.getFileProp(id,"promotions",file);
			try{
				if(!fs.existsSync(fileData.destPath)){
				fs.mkdirSync(fileData.destPath);
			}
			var des = path.resolve(path.join(fileData.destPath,fileData.filename));
			fs.createReadStream(file.path)
				.pipe(fs.createWriteStream(des).on('close', function (err,result){
					if(err){
						return response.status(500).send({"message" : "Internal Server error. Please try again later.", "err" : err}).end();
					}
					var newProm = new promotionModel({
						"_id" : id,
						"title" : title,
						"description" : description,
						"expireDate" : expireDate,
						"date" : date,
						"url" : helperFunc.serverBaseURL() + fileData.dbPath
					});
					newProm.save(function (error,result){
						if (error) {
							return response.status(500).send({"message" : "Internal Server error. Please try again later.", "err" : error}).end();
						}
						response.status(200).send(result).end();
					})
				}))
			}catch(err){
				console.log(err);
				return response.status(500).send({"message" : "Internal Server error. Please try again later.","err" : err}).end();
			}
		}
})

router.post('/removePromotion',function (request,response){
	var id = request.body.id;
	if(id == '' || null){
		return response.status(400).send({"message" : "Parameter missing"}).end();
	}
	promotionModel.findOneAndRemove({'_id' : id},function (err,result){
		if(err){
			return response.status(500).send({"message" : "Internal server error.","code": "PE-PS-DEL","err" : err}).end();
		}
		response.status(200).send({"message" : "ok"}).end();
	})
})

router.post('/updatePromotion',function (request,response){
	var id 										=  request.body.id,
			event_name 						=  request.body.event_name,
      event_description 		=  request.body.event_description,
      banner_Image_url 			=  request.body.banner_Image_url,
      event_start_time 			=  request.body.event_start_time,
      event_end_time 				=  request.body.event_end_time,
      total_tickets 				=  request.body.total_tickets,
      event_address 				=  request.body.event_address,
      event_category 				=  request.body.event_category,
      seating_plan_doc_url 	=  request.body.seating_plan_doc_url,
      price									=  request.body.price,
			is_electronic					=  request.body.type;

	if(id == null || ""){
		return response.status(400).send({"message" : "Id is Missing"});
	}
	var updateDate = {
		'event_name' 				: event_name,
		'event_description' : event_description,
		'event_start_time'	: event_start_time,
		'event_end_time'		: event_end_time,
		'total_tickets' 		: total_tickets,
		'event_address' 		: event_address,
		'event_category' 		: event_category,
		'price'							: price,
		'is_electronic'			: is_electronic
	}
	if(banner_Image_url){
		updateDate.banner_Image_url = banner_Image_url;
	}
	if(seating_plan_doc_url){
		updateDate.seating_plan_doc_url = seating_plan_doc_url;
	}
	promotionModel.findOneAndUpdate({'_id' : id},updateDate,function (err,promotion){
		console.log(promotion);
		if(err){
			return response.status(500).send({"message" : "Internal server error.","code": "PE-PS-UP","err" : err}).end();
		}
		response.status(200).send(promotion).end();
	})
})

module.exports = router;
