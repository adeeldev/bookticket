angular.module('TurkishApp')
	.service('promotionService',['$http','$location',function ($http,$location){

		var URL = "http://" + $location.host() + ':' + $location.port() + "/event";
		var req = {};
		this.getAllPromotions = function(){
			req = {
				'method' : 'GET',
				'url' : URL+"/allPromotions",
			}
			return $http(req);
		}

		this.addPromotion = function(data){
			req = {
				method : "POST",
				url : URL + '/addPromotionAdmin',
				header : {
					"Content-Type" : "application/json"
				},
				data : data
			}
			return $http(req);
		}	

		this.getPromotion = function(promotionId){
			var id = {'promotionId' : promotionId};
			req = {
				method : "POST",
				url : URL + '/getPromotionById',
				header : {
					"Content-Type" : "application/json"
				},
				data : id
			}
			return $http(req);
		}
		
		this.deletePromotion = function(data){
			req = {
				method : "POST",
				url : URL + '/removePromotion',
				header : {
					"Content-Type" : "application/json"
				},
				data : data
			}
			return $http(req);
		}			

	}])