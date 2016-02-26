angular.module('TurkishApp')
	.controller('UserController',['$scope','$rootScope','$location','userService','$uibModal','$cookies', function ($scope,$rootScope,$location,userService,$uibModal,$cookies){
		$scope.users = [];
		$scope.message = 'Hello world';
		$scope.type = $cookies.get('type');
		if($scope.type == 'admin'){
		$scope.fields = ["Username","Eamil","Oranization Name", "Type","joinOn","Delete"];
		}else{
		$scope.fields = ["Username","Eamil","Oranization Name","Type","joinOn"];
		}
		userService.allUser()
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

		$scope.deleteUser = function(userId){
			console.log(userId);

			userService.removeUser(userId)
			.then(function (success){
				if(success){
					$scope.deleted = 1;
				userService.allUser()
		.then(function (success){
			$scope.users = success.data;
		}).catch(function (err){
			console.log(err);
		})
				}
			}).catch(function(err){
				console.log(err);
			})
		}

		$scope.openNew = function(size){
			var modalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : '/views/addEventModal.html',
				controller : 'addModalController',
				size : size,
				resolve : {
					events : function (){
						return Event;
					}
				}
			})
			modalInstance.result
			.then(function (admin) {
				console.log(admin);
				return userService.addAdmin(admin);
		    })
			.then(function (result){
				return userService.allUser();
			})
			.then(function (allEvent){
				console.log(allEvent);
				$scope.noEvent = false;
				$scope.Events = allEvent.data;
			})
		}

	}])