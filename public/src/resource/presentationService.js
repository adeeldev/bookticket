angular.module('TurkishApp')
	.service('presentationService',['$http','$location',function ($http,$location){

		var URL = "http://" + $location.host() + ':' + $location.port() + "/presentation";
		var req = {};
		this.getAllPresentations = function(){
			req = {
				'method' : 'GET',
				'url' : URL,
			}
			return $http(req);
		}

		this.addPresentation = function(data){
			req = {
				method : "POST",
				url : URL + '/addPresData',
				header : {
					"Content-Type" : "application/json"
				},
				data : data
			}
			return $http(req);
		}

		
		this.deletePresentation = function(data){
			req = {
				method : "POST",
				url : URL + '/removePresentation',
				header : {
					"Content-Type" : "application/json"
				},
				data : data
			}
			return $http(req);
		}  

		this.addVideo = function(data){
			req = {
				method : "POST",
				url : URL + '/addVideoData',
				header : {
					"Content-Type" : "application/json"
				},
				data : data
			}
			return $http(req);
		} 		


	}])