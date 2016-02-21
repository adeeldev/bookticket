angular.module('TurkishApp')
	.controller('HomeController',['$scope','$cookies','$cookies',function ($scope,$cookies,$cookies){
		$scope.message = "Book Ticket";
		$scope.uid = $cookies.get('user');
		$scope.type = $cookies.get('type');
		console.log($scope.type);
		console.log($scope.uid); 
	}])