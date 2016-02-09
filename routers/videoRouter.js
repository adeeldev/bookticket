var videoModel = require('../models/videoModel'),
	presentationModel = require('../models/presentationModel'),
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
		videoModel.find({"type":"vid"},{"__v" : 0},function (err,videos){
			if(err){
				return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
			}
			response.status(200).send(videos).end();
		})
	})
	.post('/update', function (request,response){})
	.post('/delete', function (request,response){})
	.post('/addVideo',multipartMiddleware, function (request,response){


		var title = request.body.title;
			thumbnail = request.files.thumbnail,
			videoFile = request.files.video;
			console.log(thumbnail);
			console.log(videoFile);
		if((title == null || "") || (thumbnail == null || "") || (videoFile == null || "")){
			return response.status(400).send({"message" : "Parameter Missing."}).end();
		}
		var id = mongoose.Types.ObjectId();
		var thumbData = helperFunc.getFileProp(id,"thumbnail-video",thumbnail);
		var vData = helperFunc.getFileProp(id,"video",videoFile);
		if(!fs.existsSync(vData.destPath)){
			fs.mkdirSync(vData.destPath);
		}
		var thumbDestination = path.resolve(path.join(thumbData.destPath,thumbData.filename));
		var vidFile = path.resolve(path.join(vData.destPath,vData.filename));

		writeThumbnail(thumbnail.path,thumbDestination)
			.then(function(result){
				var dbPath = helperFunc.serverBaseURL() + thumbData.dbPath;
				return writeVideo(videoFile.path,vidFile,dbPath);
			})
			.then(function(tURL){
				var newVideo = new videoModel({
					"title" : title,
					"thumbnail" : tURL,
					"type": "vid",
					"url" : helperFunc.serverBaseURL() + vData.dbPath,
					"date" : Date.now()
				});
				newVideo.save(function (err,newData){
					if(err){
						return response.status(500).send({"message" : "Internal Server Error.", "err" : err}).end();
					}
					response.status(200).send(newData).end();
				})
			})
			.catch(function(err){
				console.log(err);
				response.status(500).send({"message" : "Internal Server Error.", "err" : err}).end();
			})

	})
function writeThumbnail(src,dest){
	var defered = Q.defer();
	fs.createReadStream(src)
	.pipe(fs.createWriteStream(dest)
		.on("close",function(){
			defered.resolve({"message" : "OK"});
		}).on('error',function(err){
			defered.reject(err);
		}))
	return defered.promise;
}
function writeVideo(src,dest,tURL){
	var defered = Q.defer();
	fs.createReadStream(src)
	.pipe(fs.createWriteStream(dest)
		.on("close",function(){
			defered.resolve(tURL);
		}).on("error",function(err){
			defered.reject(err);
		}))
	return defered.promise;
}

module.exports = router;