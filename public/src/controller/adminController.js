angular.module('TurkishApp')
	.controller('adminController',['$scope','$location','$uibModal','$rootScope','adminService','$cookies',function ($scope,$location,$uibModal,$rootScope,adminService,$cookies){
		$scope.animationsEnabled = true;
		$scope.error = false;
		$scope.login = function login(){
			adminService.login($scope.Admin)
				.then(function (result){
					console.log(result);
					$cookies.put('user',result.data._id );
					$cookies.put('username',result.data.username );
					$rootScope.loggedIn = true;
					$rootScope.Admin = result.data;
					$rootScope.loggedIn = true;
					$scope.uid = $cookies.get('user');
					console.log($scope.uid);
					$location.path('/home');
				})
				.catch(function (response){
					$scope.error = true;
					$scope.errorMsg = response.data.message;
				})
		}

		$scope.uid = $cookies.get('user');
		console.log($scope.uid);
		$scope.prompt = function(size){
			var data = {
				'admin' : $rootScope.Admin,
				'action' : 'Verification'
			};
			var modalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : '/views/promptModalView.html',
				controller : 'promptModalController',
				size : size,
				resolve : {
					package : function (){
						return data;
					}
				}
			})
			modalInstance.result
			.then(function() {
				console.log("Ok");
		    })
		}

		$scope.logout = function(){
			console.log("here");
			$cookies.remove("user");
			$scope.uid = undefined;
			$location.path('/');

		}		
	}])