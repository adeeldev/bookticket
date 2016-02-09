angular.module('TurkishApp')
	.controller('HomeController',['$scope','$cookies',function ($scope,$cookies){
		$scope.message = "Book Ticket";
	}])