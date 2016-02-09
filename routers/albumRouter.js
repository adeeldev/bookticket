var albumModel = require('../models/albumModel');
var sliderModel = require('../models/sliderModel');
var express = require('express');
var router = express.Router();
var fs = require('graceful-fs');
var mongoose = require('mongoose');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path');
var helperFunc = require('../lib/helperFunc');
var Q = require('q');

function moveFile(src, dstDir, fileName, title, id) {

	var defered = Q.defer();
	var filePath = path.join(dstDir, fileName);
	fs.createReadStream(src)
	.pipe(fs.createWriteStream(filePath))
	.on('close', function() {
		var imageData = {
			"title"  : title,
			"url" : helperFunc.serverBaseURL() + "images/"+ id +"/" + fileName
		}
		albumModel.addImageToAlbum(id,imageData)
		.then(function (album){
			defered.resolve(album);
		}).catch(function (err){
			defered.reject(err);
		})
	})
	.on('error',function(err){
		defered.reject(err);
	})
	return defered.promise;
}

router
	.get('',function (request,response){
		albumModel.getGallery()
		.then(function (gallery){
			if(gallery.code == "GE:Err"){
				return response.status(200).send({"code":gallery.code, "message":"No Gallery found"}).end();
			}
			response.status(200).send({"data" : gallery}).end();
		})
		.catch(function (error){
			console.log("Error in getting Gallery. : " + error.err);
			response.status(500).send({"code":"GE:Err","message" : "Internal Server Error..Please try later..", "err" : error});
		})
	})
	.get('/:albumID',function (request,response){
		var albumID = request.params.albumID;
		console.log("here");
		if(albumID == null || ""){
			return response.status(400).send({"message" : "Invalid Parameters."}).end();
		}else{
			albumModel.getAlbum(albumID)
			.then(function (album){
				if(album.code == "NA:Err"){
					return response.status(500).send({"code" : album.code, "message" : "No Image found in the album."})
					.end();
				}
				response.status(200).send(album).end();
			})
			.catch(function (error){
				response.status(500).send({"code":"NA:Err","message":"Internal Server error. Please try again later", "err" : error});
			})
		}
	})
	.post('/addAlbumAdmin',multipartMiddleware, function (request,response){
		var data = request.body;
		console.log(data);
		var album = new albumModel({
					"albumName" : data.name,
					"url" : data.albumImage
				});
				album.save(function (err,result){
					if(err){
						return response.status(500).send({"message" : "Internal Server error","err" : err});
					}
					var message = 'New Album added.'
					helperFunc.sendNotification('album',message, function (error,solution){
						if(error) {console.log(error)}
						else{console.log("Notification Sent.")}
					})
					response.status(200).send(result).end();
		})
	})
	.post('/addAlbum',multipartMiddleware,function (request,response){
		var newAlbum = request.body.Album;
		var file = request.files.albumFile;
		if ((newAlbum == null || "" ) || file == null ) {
			return response.status(400).send({"message" : "Parameters are missing."}).end();
		}else{
			var albumId = mongoose.Types.ObjectId();
			var albumDir = path.resolve(path.join(__dirname, '../public/images', albumId.toString()));
			if (!fs.existsSync(albumDir)){
				try {
					fs.mkdirSync(albumDir);
					var fileName = 'album_img' + file.name.substring(file.name.lastIndexOf('.') , file.name.length);
					var dstPath = path.resolve(path.join(albumDir , fileName));
					fs.createReadStream(file.path)
					.pipe(fs.createWriteStream(dstPath)
					.on('close', function() {
						console.log('File Saved. Path: ', dstPath);
						var album = new albumModel({
							_id: albumId,
							albumName: newAlbum,
							url: helperFunc.serverBaseURL() + 'images/' + albumId + '/' + fileName,
							images: []
						});
						album.save(function(err, album) {
							if (err) {
								return response.status(500).send({'message' :'Internal server error.',"err" : err});
							}
							delete album.__v;
							response.status(200).send(album).end();
						})
					}))
					
				} catch (ex) {
					console.log(ex);
					response.status(500).json({'message': 'Internal server error.',"err" : ex});
				}
			}
		}
		// console.log(typeof(request.file));
	})
	.post('/addImage',multipartMiddleware,function (request,response){
		var id = request.body.id;
		var files = request.files;
		if((id == null || "") || (files == null)){
			return response.status(400).send({"message":"Parameters missing."}).end();
		}
		var promises = [];
		var dst = path.resolve(path.join(__dirname, '../public/images/' + id));
		
		for (var file in files) {
			var nameWithEx = path.parse(files[file].path);
				nameWithEx = nameWithEx.base;
			var NAME = path.parse(files[file].path);
				NAME = NAME.name;
			var src = files[file].path;
			if (NAME && src) {
				promises.push(moveFile(src, dst, nameWithEx,NAME,id));
			}
		}
		console.log(promises);
		Q.all(promises).then(function (result){
			delete result[result.length-1].__v;
			delete result[result.length-1].state;
			response.status(200).send(result[result.length-1]).end();
		}).catch(function(err){
			response.status(500).send({"message" : "Internal server error", "err" : err}).end();
		})
	})
	.post('/addImagesAdmin',multipartMiddleware,function (request,response){
		var albumData = request.body;
		var albumId = albumData.albumId;
		var images = albumData.images;
		if((albumId == null || "") || (images == null)){
			return response.status(400).send({"message":"Parameters missing."}).end();
		}
		albumModel.addImagesData(albumId, images)
		.then(function (album){
			if(album.code == "NA:Err"){
				return response.status(500).send({"code" : album.code, "message" : "No Image found in the album."})
				.end();
			}
			response.status(200).send(album).end();
		})
		.catch(function (error){
			response.status(500).send({"code":"NA:Err","message":"Internal Server error. Please try again later", "err" : error});
		})

	})
 
	.post('/addSliderImages',multipartMiddleware,function (request,response){
		console.log('in slider data');
		var sliderData = request.body;
		console.log(sliderData);
		if(sliderData.length <= 0){
			return response.status(400).send({"message":"Parameters missing."}).end();
		}
		for (var i = 0; i <= sliderData.length - 1; i++) {		
		var slider = new sliderModel({
					"title" : sliderData[i].title,
					"url" : sliderData[i].url
				});
				slider.save(function (err,result){
					if(err){
						return response.status(500).send({"message" : "Internal Server error","err" : err});
					}
					console.log('uploading...');
		})
		}
		var msg = {"msg":"ok"}
		response.status(200).send(msg).end();

	})	



module.exports = router;