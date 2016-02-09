angular.module('TurkishApp')
	.service('sliderService',['$http','$location',function ($http,$location){
		var URL = "http://" + $location.host() + ":" + $location.port() + "/home";
		var req = {};

		this.getSlider = function(){
			req = {
				'method' : 'GET',
				'url' : URL
			}
			return $http(req);
		}
		
	}])