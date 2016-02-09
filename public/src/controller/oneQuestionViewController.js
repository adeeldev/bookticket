angular.module('TurkishApp')
	.controller('oneQuestionViewController',['$rootScope','$scope',function ($rootScope,$scope){
		$scope.que = $rootScope.Question;
		console.log($scope.que);
	}])