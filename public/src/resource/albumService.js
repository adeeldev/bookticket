angular.module('TurkishApp')
	.service('albumService',['$http','$location',function ($http,$location){
		var URL = "http://" + $location.host() + ":" + $location.port() + "/gallery/";
		var req = {};

		this.getImages = function (id){
			req = {
				'method' : 'GET',
				'url' : URL + id
			}
			return $http(req);
		}
		this.addImages = function(data){}
	}])