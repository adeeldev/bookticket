angular.module('TurkishApp')
	.controller('albumController',['$scope','$location','$rootScope','albumService',function ($scope,$location,$rootScope,albumService){
		$scope.album = {};
		$scope.noAlbum = false;
		$scope.getImage = function(){
			albumService.getImages($rootScope.album)
			.then(function (response){
				$scope.album = response.data;
			})
		}
		
		$scope.getImage();
		$scope.addAlbum = function(){
			console.log('in add album controller');
			var pathArray = $location.url().split('/') ;
	    	$scope.albumId = pathArray[2];
	    	$location.path('/addImages/' + $scope.albumId);
		}
	}])