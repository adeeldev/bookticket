var presentationModel = require('../models/presentationModel'),
	express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	path = require('path'),
	multipart = require('connect-multiparty'),
	multipartMiddleware = multipart(),
	Q = require('q'),
	fs = require('graceful-fs'),
	helperFunc = require('../lib/helperFunc');


router
	.get('',function (request,response){
		presentationModel.find({},{"__v" : 0},function (err,files){
			if(err){
				return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
			}

			response.status(200).send(files).end();
		})
	})
	.get('/allVideos',function (request,response){
		presentationModel.find({'type':'vid'},{"__v" : 0},function (err,files){
			if(err){
				return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
			}

			response.status(200).send(files).end();
		})
	})		
	.get('/allPresentations',function (request,response){
		presentationModel.find({'type':'ppt'},{"__v" : 0},function (err,files){
			if(err){
				return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
			}

			response.status(200).send(files).end();
		})
	})	
	.post('/addPresData',multipartMiddleware, function (request,response){
		var data = request.body;
		var newPresentation = new presentationModel({
					"title" : data[2].title,
					"url" : data[0].url,
					"thumbnail" : data[1].thumbnail,
					"type":"ppt",
					"date" : Date.now()
				});
				newPresentation.save(function (err,result){
					if(err){
						return response.status(500).send({"message" : "Internal Server error","err" : err});
					}
					var message = newPresentation.title + ": is added.";					
					helperFunc.sendNotification('presentation',message,function (error,result){
						if(error){
							console.log(error);
						}else{
							console.log("Notification is send");
						}
					})				

			})
	})
	.post('/addVideoData',multipartMiddleware, function (request,response){
		var data = request.body;
		
		var newPresentation = new presentationModel({
					"title" : data[2].title,
					"url" : data[0].url,
					"thumbnail" : data[1].thumbnail,
					"type":"vid",
					"date" : Date.now()
				});
				newPresentation.save(function (err,result){
					if(err){
						return response.status(500).send({"message" : "Internal Server error","err" : err});
					}
					var message = newPresentation.title + ": is added.";					
					helperFunc.sendNotification('video',message,function (error,result){
						if(error){
							console.log(error);
						}else{
							console.log("Notification is send");
						}
					})	
					response.status(200).send({"msg":"ok"}).end();
		})
	})		
	// .post('/addPresentation',multipartMiddleware, function (request,response){
	// 	// files = request.files.file_1,
	// 	var title = request.body.title_1,
	// 		files = request.files.file_1,
	// 		thumb = request.files.thumb_1;
	// 	if((files == null || "") || (title == null || "") || (thumb == null || "")){
	// 		return response.status(400).send({"message" : "Invalid Parameters"}).end();
	// 	}
	// 	var dest = path.resolve(path.join(__dirname,"../public/presentation"));
	// 	var id = mongoose.Types.ObjectId();
	// 	var fileData = helperFunc.getFileProp(id, "presentations" , files);
	// 	var thumbData = helperFunc.getFileProp(id, "thumbnail-ppt" , thumb);
	// 	console.log(fileData);
	// 	console.log(thumbData);
	// 	var prom_1 = writeFile(files.path,dest, fileData);
	// 	var prom_2 = writeFile(thumb.path, dest, thumbData);
	// 	Q.all([prom_1,prom_2]).then(function (urls){
	// 		var newPresentation = new presentationModel({
	// 			"_id" : id,
	// 			"title" : title,
	// 			"url" : urls[0],
	// 			"thumbnail" : urls[1],
	// 			"type":"ppt",
	// 			"date" : Date.now()
	// 		});
	// 		newPresentation.save(function (err,result){
	// 			if(err){
	// 				return response.status(500).send({"message" : "Internal Server error","err" : err});
	// 			}
	// 		})
	// 			response.status(200).send(result).end();
	// 		})
	// 	}).catch(function(err){
	// 		return response.status(500).send({"message" : "Internal Server error","err" : err});
	// 	})
	// })
	.post('/removePresentation',function (request,response){
		var id = request.body.id;
		if(id == '' || null){
			return response.status(400).send({"message" : "Parameter missing"}).end();
		}
		presentationModel.findOneAndRemove({'_id' : id},function (err,result){
			if(err){
				return response.status(500).send({"message" : "Internal server error.","code": "PE-PS-DEL","err" : err}).end();
			}
			response.status(200).send({"message" : "ok"}).end();
		})
	});
	// .post('/updatePresentaion', function (request,response){});

function writeFile(src,dest,fileData){
	console.log("src");
	console.log(src);
	console.log("dest");
	console.log(dest);
	var defered = Q.defer();
	if(!fs.existsSync(dest)){
		fs.mkdirSync(dest);
	}
	dest = dest + "/" + fileData.filename;
	fs.createReadStream(src)
	.pipe(fs.createWriteStream(dest)
		.on("close",function(){
			var url = helperFunc.serverBaseURL() + fileData.dbPath;
			defered.resolve(url);
		}).on("error",function(err){
			defered.reject(err);
		}))
	return defered.promise;
}

module.exports = router;

