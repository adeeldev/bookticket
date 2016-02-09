angular.module('TurkishApp')
	.controller('addWinnerModalController',['$scope','$uibModalInstance','users', function ($scope,$uibModalInstance,users){
		$scope.users = users;
		$scope.selectedUser = {};
		$scope.alert = {};
		
		$scope.ok = function(form){
			if(form.winner.$error.required){
				$scope.hasError = true;
				$scope.alert.type = 'danger';
				$scope.alert.msg = 'Winner is Required';
			}else{
				$uibModalInstance.close($scope.selectedUser);
			}
		};
		$scope.closeAlert = function(index) {
			console.log(index);
		}
		$scope.cancel = function(){
			$uibModalInstance.dismiss('cancel');
		};
		$scope.selectUser = function(){
			for(var i = 0; i< $scope.users.length; i++){
				if($scope.winnerEmail == $scope.users[i].email){
					console.log('inside If')
					$scope.selectedUser = $scope.users[i];
					break;
				}
			}
		}

		selectEmail = function(){
			$scope.emails = []
			for(var i = 0; i<$scope.users.length; i++){
				$scope.emails.push($scope.users[i].email);
			}
			console.log($scope.emails);
		}
		selectEmail();
	}])