angular.module('TurkishApp')
	.service('galleryService',['$http','$location',function ($http,$location){
		var URL = "http://" + $location.host() + ":" + $location.port() + "/gallery";
		var req = {};

		this.getGallery = function(){
			req = {
				'method' : 'GET',
				'url' : URL
			}
			return $http(req);
		}
		this.addAlbum = function (galleryData){
			req = {
				method : "POST",
				url : URL + '/addAlbumAdmin',
				header : {
					"Content-Type" : "application/json"
				},
				data : galleryData
			}
			return $http(req);			
		}

		this.addImages = function (data){
			req = {
				method : "POST",
				url : URL + '/addImagesAdmin',
				header : {
					"Content-Type" : "application/json"
				},
				data : data
			}
			return $http(req);			
		}	

		this.addSliderImages = function(sliderData){
			req = {
				method : "POST",
				url : URL + '/addSliderImages',
				header : {
					"Content-Type" : "application/json"
				},
				data : sliderData
			}
			return $http(req);
		}	

		
	}])