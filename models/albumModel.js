var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');


var imageSchema = new Schema({
	title : String,
	url : String
});



var albumSchema = new Schema({
	albumName : String,
	url : String,
	images : [imageSchema]
});

albumSchema.statics.getGallery = function getGallery(){
	var defered = Q.defer();
	this.find({},{"images" : 0, "__v" : 0},function (error,gallery){
		if(error){
			defered.reject({"code" : "GE:Err","err" : error})
		}else if(gallery && gallery.length != 0){
			defered.resolve(gallery);
		}else{
			defered.resolve({"code" : "GE:Err"});
		}
	});
	return defered.promise;
}
albumSchema.statics.getAlbum = function getAlbum(id){
	var defered = Q.defer();
	this.findOne({"_id":id},{"images.title" : 0,"images._id" : 0,"albumName" : 0, "url" : 0,"__v" : 0,"_id" : 0},function (error,album){
		if(error){
			console.log(error);
			defered.reject({"code":"NA:Err","err":error});
		}else if(album && album.length == 0){
			console.log("no album");
			defered.resolve({"code":"NA:Err"})
		}else{
			defered.resolve(album);
		}
	});
	return defered.promise;
}
albumSchema.statics.addImageToAlbum = function addImageToAlbum(ID,imageData){
	var defered = Q.defer();
	this.findOne({"_id" : ID},function (err,album){
		if(err){
			defered.resolve(err);
		}else{
			album.images.push(imageData);
			album.save(function (err,result){
				if(err){
					defered.reject(err);
				}else{
					defered.resolve(result);
				}
			})
		}
	})
	return defered.promise;
} 

albumSchema.statics.addImagesData = function addImageToAlbum(albumId,images){
	var defered = Q.defer();
	this.findOne({"_id" : albumId},function (err,album){
		if(err){
			defered.resolve(err);
		}else{
			console.log(images);
			console.log(album);
			for (var i = 0; i <= images.length - 1; i++) {
				
			album.images.push(images[i]);   	
			};
			
			album.save(function(err, res) {
				if (err) defered.reject(err);
				else
					defered.resolve(album);
			});
		}
	})
	return defered.promise;
} 

var albumModel = mongoose.model('AlbumModel',albumSchema);
module.exports = albumModel;