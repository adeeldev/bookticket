angular.module('TurkishApp')
	.controller('sliderController',['$scope','$location','$rootScope','sliderService','FileUploader',function ($scope,$location,$rootScope,sliderService,FileUploader){
		$rootScope.album = '';
		$scope.getSlider = function(){
			sliderService.getSlider()
			.then(function (response){
				$scope.gallery = response.data;
			})
		}
		$scope.getSlider();
	}])