angular.module('TurkishApp')
	.controller('addModalController',['$scope','$rootScope','$uibModalInstance', 'Flash', '$timeout','Flash', function ($scope, $rootScope, $uibModalInstance, Flash , $timeout, Flash){
		var tz = jstz.determine();
		$scope.Event = {};
		$scope.Errors = [];
		$scope.timezone = tz.name();
		$scope.minDate = moment();
		$scope.maxDate = moment.tz($scope.timezone).add(4, 'd').hour(12).startOf('h');
		// $scope.Event.eventDate = moment();
		$scope.ok = function (form){

			if(form.owner_name.$error.required && form.owner_name.$error.required){
				$scope.errCheck = true;
				var message = '<strong>Warning</strong> Username is Missing.';
		        Flash.create('danger', message);
			}else if(form.owner_email.$error.required){
				$scope.errCheck = true;
				var message = '<strong>Warning</strong> Email is Missing.';
		        Flash.create('danger', message);
			}else if(form.owner_password.$error.required){
				$scope.errCheck = true;
				var message = '<strong>Warning</strong> Password is Missing.';
	        	Flash.create('danger', message);
			}else if(form.organization_name.$error.required){
				$scope.errCheck = true;
				var message = '<strong>Warning</strong> Organization Name is Missing.';
	        	Flash.create('danger', message);
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
