var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var sliderSchema = new Schema({
	url : String,
	title : String,
	date : Date
});


sliderSchema.statics.addSliderImagesData = function addImageToAlbum(sliderData){
	var defered = Q.defer();
	this.findOne({},function (err,slider){
		if(err){
			defered.resolve(err);
		}else{
			console.log(slider);
			for (var i = 0; i <= sliderData.length - 1; i++) {
				
			}
			
			slider.save(function(err, res) {
				if (err) defered.reject(err);
				else
					defered.resolve(album);
			});
		}
	})
	return defered.promise;
} 

var sliderModel = mongoose.model('sliderModel',sliderSchema);
module.exports = sliderModel;