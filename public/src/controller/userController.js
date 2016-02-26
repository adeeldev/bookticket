angular.module('TurkishApp')
	.controller('UserController',['$scope','$rootScope','$location','userService','$uibModal','$cookies', 'Flash', '$timeout', function ($scope,$rootScope,$location,userService,$uibModal,$cookies, Flash, $timeout){
		$scope.users = [];
		$scope.message = 'Hello world';
		$scope.type = $cookies.get('type');
		if($scope.type == 'admin'){
		$scope.fields = ["Username","Eamil","Oranization Name", "Type","joinOn","Delete"];
		}else{
		$scope.fields = ["Username","Eamil","Oranization Name","Type","joinOn"];
		}

	    $scope.success = function () {
	        var message = '<strong>Well done!</strong> You successfully read this important alert message.';
	        Flash.create('success', message);
	    };

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

		userService.removeUser(userId)
			.then(function (success){
				if(success){
					$scope.deleted = 1;
		        var message = '<strong>User Deleted Successfully!';
		        Flash.create('success', message);
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
				return userService.addAdmin(admin);
		    })
			.then(function (result){
				return userService.allUser()
			})
			.then(function (allEvent){
				$scope.noEvent = false;
				var message = '<strong>User Added Successfully!';
		        Flash.create('success', message);
				$scope.users = allEvent.data;
			})
		}

	}])