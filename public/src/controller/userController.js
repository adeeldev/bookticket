angular.module('TurkishApp')
	.controller('UserController',['$scope','$rootScope','$location','userService','$uibModal','$cookies', 'Flash', '$timeout', function ($scope,$rootScope,$location,userService,$uibModal,$cookies, Flash, $timeout){
		$scope.user = JSON.parse($cookies.get('data'));
		if(!$scope.user._id){
			$location.path('/');
		}
		$scope.users = [];
		$scope.message = 'Hello world';
		$scope.uid = $cookies.get('user');
		$scope.type = $cookies.get('type');
		if($scope.type == 'admin'){
		$scope.fields = ["Username","Eamil","Oranization Name", "Type", "Status", "joinOn", "Update", "Delete"];
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


		$scope.getUser = function(userId) {
			var id = {'userId': userId}
			userService.userById(id)
			.then(function (success){
				$scope.userData = success.data;
			}).catch(function (err){
				console.log(err);
			})
		}

		$scope.updateUser = function(user) {
			console.log(user);
			var data = {
				organization_name 	: user.organization_name,
				owner_name 					:	user.owner_name,
				owner_password 			:	user.owner_password,
				share 							:	user.share,
				courier_charges 		:	user.courier_charges,
				distance_ranges			:	user.distance_ranges,
				type 								:	user.type,
				fixed_price					: user.fixed_price,
				location						: user.location,
				_id									: user._id,
				type								: user.type
			}
			userService.findAndUpdateById(user)
			.then(function (success){
				$scope.userData = success.data;
				window.location.reload();
			}).catch(function (err){
				console.log(err);
			})
		}








	}])
