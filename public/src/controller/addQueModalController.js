angular.module('TurkishApp')
	.controller('addQueModalController',['$scope','$uibModalInstance',function ($scope, $uibModalInstance){
		var tz = jstz.determine();
		$scope.timezone = tz.name();
		$scope.newQue = {
			'question' : '',
			'options' : {
				'A' : '',
				'B' : '',
				'C' : '',
				'D' : ''
			},
			'correctAnswer' : '',
			'startTime' : Date.now(),
			'endTime' : Date.now()
		};

		$scope.error = false;
		$scope.ok = function (form){
			console.log(form);
			if(form.question.$error.required){
				$scope.error = true;
				$scope.errorMsg = "Question is required.";
			}else if(form.optionA.$error.required){
				$scope.error = true;
				$scope.errorMsg = "All Options are required."
			}else if(form.optionB.$error.required){
				$scope.error = true;
				$scope.errorMsg = "All Options are required."
			}else if(form.optionC.$error.required){
				$scope.error = true;
				$scope.errorMsg = "All Options are required."
			}else if(form.optionD.$error.required){
				$scope.error = true;
				$scope.errorMsg = "All Options are required."
			}else if(form.correctAnswer.$error.required){
				$scope.error = true;
				$scope.errorMsg = "Correct answer is required."
			}else{
				if($scope.newQue.startTime == null) {
					var date = Date.now();
					$scope.newQue.startTime = moment(date).toDate().getUTCMilliseconds();
				}
				if($scope.newQue.endTime == null) {
					var date = Date.now();
					$scope.newQue.endTime = moment(date).toDate().getUTCMilliseconds();
				}
				// var d = new Date($scope.newQue.eventDate);
				// d = convertDateToUTC(d);
				$scope.newQue.startTime = moment($scope.newQue.startTime).utc().toDate();
				$scope.newQue.endTime = moment($scope.newQue.endTime).utc().toDate();
				$uibModalInstance.close($scope.newQue);
			}
		}
		$scope.cancel = function(){
			$uibModalInstance.dismiss('cancel');
		}
//====================================================================================
//							Date Picker Code - Section
//====================================================================================
		$scope.maxDate = new Date(2050,12,31);
		$scope.minDate = moment();
		$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		};
		$scope.status = {
		    open1 : false,
		    open2 : false
		};
		$scope.format = 'MM-dd-yyyy';
		$scope.open = function($event,target) {
		    if(target == 'open1'){
		    	$scope.status.open1 = true;
		    }else{
		    	$scope.status.open2 = true;
		    }
		};
	}])