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
		// this.test = function(){
		// 	return 'oyeee ki  eee';
		// }
	}]);