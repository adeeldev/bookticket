angular.module('TurkishApp')
	.controller('NavCtrl',['$rootScope','$scope', '$location','$cookies', function ( $rootScope,$scope,$location,$cookies){
		$scope.isActive = function(destination){
			return destination === $location.path;
		}

		$scope.logOut = function(){
			$cookies.remove("user");
			$cookies.remove("type");
			$location.path('/');
			window.location.reload();
		} 
	}])