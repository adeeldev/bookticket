angular.module('TurkishApp')
	.service('userParticipationService',['$http','$location',function ($http,$location){
		var URL = 'http://' + $location.host() + ":" + $location.port() + "/user";
		var req = {};

		this.getUserParticiapation = function (userID){
			req = {
				'method' : 'GET',
				'url' : URL + '/participation/' + userID
			};
			return $http(req);
		}
	}])