angular.module('TurkishApp')
	.controller('HomeController',['$scope','$cookies','$location',function ($scope,$cookies,$location){
		$scope.message = "Book Ticket";
		$scope.uid = $cookies.get('user');
		$scope.type = $cookies.get('type');
		if($scope.uid){
			$scope.user = JSON.parse($cookies.get('data'));
			$scope.username = $scope.user.owner_name;
			$scope.owner_organization = $scope.user.organization_name;
		}else{
			$location.path('/');
		}
	}])
