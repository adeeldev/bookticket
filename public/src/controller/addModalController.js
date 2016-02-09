angular.module('TurkishApp')
	.controller('addModalController',['$scope','$uibModalInstance',function ($scope, $uibModalInstance){
		var tz = jstz.determine();
		$scope.Event = {};
		$scope.Errors = [];
		$scope.timezone = tz.name();
		$scope.minDate = moment();
		$scope.maxDate = moment.tz($scope.timezone).add(4, 'd').hour(12).startOf('h');
		// $scope.Event.eventDate = moment();
		$scope.ok = function (form){
			if(form.location.$error.required && form.title.$error.required){
				$scope.errCheck = true;
				$scope.Errors.push({text : "Title and Location are required."});
			}else if(form.location.$error.required){
				$scope.errCheck = true;
				$scope.Errors.push({text : "Location is required."});
			}else if(form.title.$error.required){
				$scope.errCheck = true;
				$scope.Errors.push({text : "Title is required."});
			}else{
				if($scope.Event.eventDate == null) {
					var date = Date.now();
					$scope.Event.eventDate = moment(date).toDate().getUTCMilliseconds();
				}
				// var d = new Date($scope.Event.eventDate);
				// d = convertDateToUTC(d);
				$scope.Event.eventDate = moment($scope.Event.eventDate).utc().toDate();
				console.log($scope.timezone);
				$uibModalInstance.close($scope.Event);
			}
		}

		$scope.cancel = function (){
			$uibModalInstance.dismiss('cancel');
		}
	}])
