angular.module('TurkishApp')
	.service('questionService',['$http','$location',function($http,$location){
		var URL = "http://" + $location.host() + ':' + $location.port() + "/question";
		var req = {};

		this.addQue = function (data){
			req = {
				'method' : 'POST',
				'url' : URL + '/addQuestion',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}
		this.getLiveQuestion = function(){
			req = {
				'method' : 'GET',
				'url' : URL
			}
			return $http(req);
		}
		this.getQuestions = function (){
			req = {
				'method' : 'GET',
				'url' : URL + '/allQuestion'
			}
			return $http(req);
		}
		this.getUsers = function (){
			req = {
				'method' : 'GET',
				'url' : "http://" + $location.host() + ':' + $location.port() + "/user"
			}
			return $http(req);
		}
		this.closeQuestion = function(question){
			console.log(question);
			var data = {
				'question' : question
			}
			req = {
				'method' : 'POST',
				'url' : URL +'/addWinner',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : data
			}
			return $http(req);
		}
		this.updateQue = function (question){
			req = {
				'method' : 'POST',
				'url' : URL + '/updateQue',
				'header' : {
					"Content-Type" : "application/json"
				},
				'data' : question
			}
			return $http(req);
		}
	}])