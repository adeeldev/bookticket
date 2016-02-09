angular.module('TurkishApp')
	.controller('questionController',['$rootScope','$scope','$location','questionService','$uibModal','$interval', function ($rootScope,$scope,$location,questionService,$uibModal,$interval){
//====================================================================================
//							VariableDeclaration - Section
//====================================================================================
		$scope.message = "Questions";
		$scope.Questions = [];
		$scope.Users = [];
		$scope.remainingTime = false;
		$scope.errorMessage = "";
		$scope.liveQuestion = {};
		$scope.isLived = false;
		$scope.animationsEnabled = true;
		$scope.fields = ["Question","correctAnswer","expireDate","status","Winner","agencyCode","ViewParticipation"];
		var liveTimer;
//====================================================================================
//							Public Function - Section
//====================================================================================
		$scope.sort = function(field){
			$scope.sort.field = field;
			$scope.sort.order = !$scope.sort.order;
		}
		$scope.sort.field = "expireDate"
		$scope.sort.order = true;
		$scope.hasWinner = function(queObj){
			if(queObj.winner == null || ''){
				return false;
			}
			return true;
		}
		$scope.addWinner = function(que){
			var modalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : '/views/addWinnerModalView.html',
				controller : 'addWinnerModalController',
				size : 'lg',
				resolve : {
					users : function(){
						return $scope.Users;
					}
				}
			});
			modalInstance.result
			.then(function (user){
				var ques = que;
				ques.winner = user;
				console.log(que);
				return questionService.closeQuestion(ques);
			})
			.then(function (response){
				if(response.status == 200){
					console.log("Winner Added.");
				}
				return questionService.getQuestions();
			})
			.then(function (response){
				console.log(response);
				$scope.Questions =	response.data;
			})
			.catch(function (problem){
				console.log(problem);
			})
		}
		$scope.queDetail = function(que){
			$rootScope.Question = que;
			$location.path('/question/'+que._id);
			console.log($scope.Questions);
		}
		$scope.openNew = function(size){
			var modalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : '/views/addQueModalView.html',
				controller : 'addQueModalController',
				size : size,
				resolve : {
					events : function (){
						return Event;
					}
				}
			})
			modalInstance.result
			.then(function (Question) {
				return questionService.addQue(Question);
		    })
			.then(function (result){
				$scope.isLived = true;
				liveTimer = $interval(getRemainTime,1000);
				return questionService.getLiveQuestion();
			})
			.then(function (response){
				$scope.liveQuestion = response.data;
				return questionService.getQuestions();
			})
			.then(function (response){
				$scope.Questions = response.data;
			})
			.catch(function (problem){
				console.log(problem);
			})
		}
		$scope.openLive = function(size){
			var data = {};
			if($scope.isLived){
				data.que = $scope.liveQuestion;
			}else{
				data.que = null;
			}
			var modalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : '/views/liveQueModal.html',
				controller : 'liveQueModalController',
				size : size,
				resolve : {
					Package : function (){
						return data;
					}
				}
			})
			modalInstance.result
			.then(function (data) {
				console.log(data);
			})
			.catch(function (problem){
				console.log(problem);
				// alert(problem.err);
			})
		}
getData();
//====================================================================================
//							Private Function - Section
//====================================================================================
		function getData(){
			questionService.getQuestions()
			.then(function (questions){
				$scope.Questions =	questions.data;
				return questionService.getLiveQuestion();

			})
			.then(function (response){
				if(response.status == 200 && response.data.message != 'No Live Question'){
					$scope.liveQuestion = response.data;
					$scope.isLived = true;
					startTimer();
				}else{
					$scope.isLived = false;
				}
				return questionService.getUsers();
			})
			.then(function (user){
				$scope.Users = user.data;
			})
			.catch(function (error){
				console.log(error);
			})
		}
		function startTimer(){
			liveTimer = $interval(getRemainTime,1000);
		}
		function getRemainTime(){
			$scope.remainTime = moment($scope.liveQuestion.endTime).fromNow();
			if($scope.remainTime.indexOf('ago') == -1){
				$scope.remainTime = $scope.remainTime.replace('in','For');
				$scope.remainTime = '(' + $scope.remainTime +'.)';
			}else{
				$scope.remainTime = '';
				$scope.isLived = false;
				$interval.cancel(liveTimer);
			}
		}
	}])