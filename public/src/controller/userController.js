angular.module('TurkishApp')
	.controller('UserController',['$scope','$rootScope','$location','userService', function ($scope,$rootScope,$location,userService){
		$scope.users = [];
		$scope.message = 'Hello world';
		$scope.fields = ["name","email","username","telephone","city","joinOn"];
		userService.getAllUser()
		.then(function (success){
			$scope.users = success.data;
		}).catch(function (err){
			console.log(err);
		})

		$scope.getInfo = function (userObj){
			$rootScope.User = userObj;
			$location.path('user/participation/' + userObj._id);
		}
		$scope.sort = function (field){
			$scope.sort.field = field;
			$scope.sort.order = !$scope.sort.order;
		}
		$scope.sort.field = 'name';
		$scope.sort.order = false;
	}])