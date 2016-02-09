angular.module('TurkishApp')
	.controller('liveQueModalController',['$scope','$uibModalInstance','Package', function ($scope,$uibModalInstance,Package){
		$scope.que = Package.que;
		console.log(typeof(Package.que));
		if($scope.que != null){
			$scope.isLive = true;
		}else{
			$scope.isLive = false;
		}
		$scope.save = function(){
			$uibModalInstance.close('ok');
		}
		$scope.cancel = function(){
			$uibModalInstance.dismiss('close');
		}
	}])