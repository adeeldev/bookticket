var sliderModel = require('../models/sliderModel'),
	express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	fs = require('fs'),
	multipart = require('connect-multiparty'),
	mulpartMiddleWare = multipart(),
	path = require('path'),
	helperFunc = require('../lib/helperFunc');

router

	.get('/sliderImages', function (request, response){
		sliderModel.find().sort('-_id').select('-__v').exec(function(err, sliderImages) {
			if (err) {
				return response.status(500).send({"message" : "Internal Server Error.", "err" : err}).end();
			} else {
				response.status(200).send(sliderImages).end();
			}
		})
	})
	.get('', function (request, response){
		sliderModel.find().sort('-_id').select('-__v').exec(function(err, sliderImages) {
			if (err) {
				return response.status(500).send({"message" : "Internal Server Error.", "err" : err}).end();
			} else {
				response.status(200).send(sliderImages).end();
			}
		})
	})
	.post('/addHomeImage',mulpartMiddleWare, function (request,response){
		// var utcDate = new Date(Date.UTC(96, 11, 1, 0, 0, 0));

		var file = request.files.file;
		var title = request.body.title;
				if((file == {} || null) || title == "" || null){
					return response.status(400).send({"message" : "Parameter Missing"}).end();
				}
				var homeImagesDir = path.resolve(path.join(__dirname,'../public/images/homeImages'));
				if(!fs.existsSync(homeImagesDir)){
					fs.mkdirSync(homeImagesDir);
				}
				var imageID = mongoose.Types.ObjectId();
				var filename = imageID.toString() + file.name.substring(file.name.lastIndexOf('.') , file.name.length);
				var destPath = path.resolve(path.join(homeImagesDir,filename));
				fs.createReadStream(file.path)
				.pipe(fs.createWriteStream(destPath).on('close', function (){
					console.log("file Saved..");
					var newHomeImage = new sliderModel({
						"_id" : imageID,
						"title" : title,
						"url" : helperFunc.serverBaseURL() + 'images/' + "homeImages" + '/' + filename
					})
					newHomeImage.save(function (err,image){
						if(err){
							console.log("Error has occured ." + err);
							return response.status(500).send({"message" : "Internal Server Error", "err" : err}).end();
						}
						delete image.__v;
						delete image._id;
						response.status(200).send(image).end();
					})
				}))
	})

module.exports = router;


