angular.module('TurkishApp')
	.service('userService', ['$http','$location',function($http,$location){
		 this.getAllUser = function(){

			var url = "http://" + $location.host() + ":" + $location.port() + '/user';

			var req = {
				method : "get",
				url :  url,
				headers : {
					"Content-Type" : "application/json"
				}
			}
			return $http(req);
		}

		this.userById = function (data){
			var url = "http://" + $location.host() + ":" + $location.port() + '/owner';
			req = {
				'method' : 'POST',
				'url' : url + '/userById',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}

		this.findAndUpdateById = function (data){
			var url = "http://" + $location.host() + ":" + $location.port() + '/owner';
			req = {
				'method' : 'POST',
				'url' : url + '/findAndUpdateById',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}

		this.allUser = function(){

			var url = "http://" + $location.host() + ":" + $location.port() + '/owner';

			var req = {
				method : "get",
				url :  url,
				headers : {
					"Content-Type" : "application/json"
				}
			}
			return $http(req);
		}
		this.addAdmin = function (data){
			var url = "http://" + $location.host() + ":" + $location.port() + '/owner';
			req = {
				'method' : 'POST',
				'url' : url + '/addSubAdmin',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}

		this.removeUser = function(data){
			var data = {'userid':data};
			var url = "http://" + $location.host() + ":" + $location.port() + '/owner';
			req = {
				'method' : 'POST',
				'url' : url + '/deleteUser',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}
	}]);
