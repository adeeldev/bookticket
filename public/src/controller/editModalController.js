angular.module('TurkishApp')
	.controller('editModalController',['$scope','$uibModalInstance', 'events', 'promotionService', function ($scope, $uibModalInstance, events, promotionService) {
		var tz = jstz.determine();
		$scope.timezone = tz.name();
		$scope.Event = events;
		$scope.minDate = moment();
		$scope.maxDate = moment.tz($scope.timezone).add(4, 'd').hour(12).startOf('h');
		
		$scope.ok = function (){
			$scope.Event.eventDate = moment($scope.Event.eventDate).utc().toDate();
			console.log($scope.Event.eventDate);

			var data = angular.toJson($scope.Event);
			promotionService.updatePromotion(data)
			.then(function (result){
				if(result.data.message == "No data found."){
					$scope.promotions = [];
				}else{
					$scope.promotions = result.data;
				}
			})
			.catch(function (err){
				if(err.status == 500){
					$scope.serverError = true;				
				}
			})


			$uibModalInstance.close($scope.Event);
			console.log($scope.Event);
		}
		$scope.cancel = function (){
			$uibModalInstance.dismiss('cancel');
		}
	}])