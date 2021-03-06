angular.module('TurkishApp')
	.controller('promotionController',['$scope','$uibModal', 'promotionService' , 'eventService', 'FileUploader' , '$location','$cookies', function ($scope, $uibModal, promotionService, eventService,  FileUploader, $location,$cookies){
		$scope.user = JSON.parse($cookies.get('data'));
		// console.log($scope.user);
		if(!$scope.user._id){
			$location.path('/');
		}
		$scope.message = "Events";
		$scope.animationsEnabled = true;
		$scope.promotion_image = '';
    $scope.url = $location.host();
    $scope.port = $location.port();
    $scope.base_url = 'http://'+$scope.url+':'+$scope.port+'/images/';
		$scope.surl = 'http://'+$scope.url+':'+$scope.port;
    $scope.uid = $cookies.get('user');
    $scope.type = $cookies.get('type');
	$scope.getPromotions = function(){
    var data = {
            'uid' : $scope.uid,
            'type' : $scope.type
    }
		promotionService.getUserPromotions(data)
		.then(function (result){
			if(result.data.message == "No data found."){
				$scope.promotions = [];
			}else{
				$scope.promotions = result.data;
				// console.log($scope.promotions);
			}
		})
		.catch(function (err){
			if(err.status == 500){
				$scope.serverError = true;
			}
		})
	}

    $scope.addPromotion = function(data, date, endDate){

      $scope.image1 = {};
      $scope.image2 = {};
      $scope.image2 = '';
      $scope.promotions = '';
      angular.forEach($scope.uploader.queue, function(value, key) {
					var file = value.file.name;
					$scope.image = file.replace(/\s+/g, '_');
          $scope.res = $scope.image.split('.');
          if($scope.res[1] == 'png' || $scope.res[1] == 'jpg' || $scope.res[1] == 'jpeg' || $scope.res[1] == 'JPEG' || $scope.res[1] == 'gif' ){
             $scope.image1 =  $scope.base_url+$scope.image;
          }
          if($scope.res[1] == 'pdf'){
              $scope.image2 =  $scope.base_url+$scope.image;
          }
      });
			var video = $scope.video;
			var video_url = video.replace(/\s+/g, '_');
        var promotionData = {
            event_name            : data.event_name,
            event_description     : data.event_description,
            banner_Image_url      : $scope.image1,
						video_url							: $scope.surl+'/videos/'+video_url,
            event_start_time      : date._d,
            event_end_time        : endDate._d,
            total_tickets         : data.total_tickets,
            owner_Id              : $scope.uid,
            event_address         : data.event_address.formatted_address,
						share_percentage			: $scope.user.share,
						is_electronic					: data.is_electronic,
            event_category        : data.event_category,
            seating_plan_doc_url  : $scope.image2,
            price                 : data.price,
        }
        promotionService.addPromotion(promotionData)
        .then(function (promotionResult){
            if(promotionResult.data.length == 0){
                $scope.promotionResult = true;
            }else{
                $scope.getPromotions();
                $scope.promotionResult = promotionResult.data;
              	$location.path("/event");
            }
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;
            }
        })

    }

    $scope.updatePromotion = function(promotionId){
			// console.log(promotionId);
      promotionService.getPromotion(promotionId)
      .then(function (result){
        if(result.data.message == "No data found."){
        }else{
          $scope.events = result.data;
          // console.log($scope.promotions);
        }
      })
      .catch(function (err){
        if(err.status == 500){
          $scope.serverError = true;
        }
      })

    }

		$scope.updateEvent = function(){
			var url = $location.path().split("/");
			var eventId = url[2];
      promotionService.getPromotion(eventId)
      .then(function (result){
        if(result.data.message == "No data found."){
        }else{
          $scope.events = result.data;
          // console.log($scope.promotions);
        }
      })
      .catch(function (err){
        if(err.status == 500){
          $scope.serverError = true;
        }
      })

    }

		$scope.update = function(data, date, endDate){

			$scope.image1 = {};
      $scope.image2 = {};
			$scope.image1 = '';
      $scope.image2 = '';
      $scope.promotions = '';
      angular.forEach($scope.uploader.queue, function(value, key) {
					var file = value.file.name;
					$scope.image = file.replace(/\s+/g, '_');
          $scope.res = $scope.image.split('.');
          if($scope.res[1] == 'png' || $scope.res[1] == 'jpg' || $scope.res[1] == 'jpeg' || $scope.res[1] == 'JPEG' || $scope.res[1] == 'gif' ){
             $scope.image1 =  $scope.base_url+$scope.image;
          }
          if($scope.res[1] == 'pdf'){
              $scope.image2 =  $scope.base_url+$scope.image;
          }
      });

      var updateData = {
					id 										: data._id,
          event_name            : data.event_name,
          event_description     : data.event_description,
          banner_Image_url      : $scope.image1,
          event_start_time      : date._d,
          event_end_time        : endDate._d,
          total_tickets         : data.total_tickets,
          owner_Id              : $scope.uid,
          event_address         : data.event_address.formatted_address,
          event_category        : data.event_category,
          seating_plan_doc_url  : $scope.image2,
          price                 : data.price,
					type									: data.is_electronic
      }
			if($scope.video){
				var video = $scope.video;
				var video_url = video.replace(/\s+/g, '_');
				updateData.video_url							= $scope.surl+'/videos/'+video_url
			}
			// console.log(updateData);
      promotionService.updatePromotion(updateData)
      .then(function (result){
        if(result.data.message == "No data found."){
        }else{
          $scope.promotions = result.data;
          $location.path("/event");
        }
      })
      .catch(function (err){
        if(err.status == 500){
          $scope.serverError = true;
        }
      })

    }

    $scope.deletePromotion = function(promotionId){
        // console.log(promotionId);
        var id = {'id' : promotionId}
        promotionService.deletePromotion(id)
        .then(function (promotionResult){
            if(promotionResult.data.length == 0){
                $scope.promotionResult = true;
            }else{
              $scope.getPromotions();
                $scope.promotionResult = promotionResult.data;
            }
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;
            }
        })
    }


    $scope.openEdit = function(size,Promotion){
        // console.log(Promotion);
        $scope.Event = Promotion;

        var modalInstance = $uibModal.open({
          animation : $scope.animationsEnabled,
          templateUrl : '/views/editEventModal.html',
          controller : 'editModalController',
          size : size,
          resolve : {
            events : function (){
              return Promotion;
            }
          }
        })
        // modalInstance.result
        // .then(function (editEvent) {
        //     return promotionService.updatePromotion(editEvent);
        //   })
        //   .then(function (result){
        //     return promotionService.getPromotions();
        //   })
        //   .then(function (final){
        //     $scope.Events = final.data;
        //   })
        //   .catch(function (Err){
        //     console.log('close');
        // })
    }


	/*********************************************************************/
	/*               Angular file uploading code                         */
	/*********************************************************************/
    $scope.uploader = new FileUploader({
        url: 'http://'+$scope.url+':'+$scope.port+'/upload/uploads'
    });
    // FILTERS
    $scope.uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 150;
        }
    });
        // CALLBACKS
        $scope.remove_image = function(){
            $scope.image_selected = false;
            $scope.show_choose = true;
            $scope.uploader.clearQueue();
            $scope.image_url = '/images/upload.png';
            jQuery('#file').val('');    //empty the input file value so next time if same file selects then it works
        };

        $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
		//console.info('onWhenAddingFileFailed', item, filter, options);
        };
        $scope.uploader.onAfterAddingFile = function(fileItem) {
		//console.info('onAfterAddingFile', fileItem);
            $scope.show_choose = false;
            if(!fileItem.file.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|mp3|mp4|pdf)$/)){
                alert('Selected file is not a valid image');
                $scope.invalid_image = true;
            }else{
                $scope.invalid_image = false;
            }
        };
        $scope.uploader.onAfterAddingAll = function(addedFileItems) {
		//console.info('onAfterAddingAll', addedFileItems);
        };
        $scope.uploader.onBeforeUploadItem = function(item) {
		//console.info('onBeforeUploadItem', item);
        };
        $scope.uploader.onProgressItem = function(fileItem, progress) {
		//console.info('onProgressItem', fileItem, progress);
        };
        $scope.uploader.onProgressAll = function(progress) {
		//console.info('onProgressAll', progress);
        };
        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
		//console.info('onSuccessItem', fileItem, response, status, headers);
        };
        $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
		//console.info('onErrorItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCancelItem = function(fileItem, response, status, headers) {
		//console.info('onCancelItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            $scope.image_selected = true;
		//console.info('onCompleteItem', fileItem, response, status, headers);
            $scope.image_url = '../uploads/images/'+fileItem.file.name;
            $scope.promotion_image = fileItem.file.name;

        };
        $scope.uploader.onCompleteAll = function() {
            console.info('uploader', $scope.uploader.queue);
        };

				/*********************************************************************/
				/*               Angular file uploading code  video                        */
				/*********************************************************************/
			    $scope.uploader1 = new FileUploader({
			        url: 'http://'+$scope.url+':'+$scope.port+'/upload/uploads'
			    });
			    // FILTERS
			    $scope.uploader1.filters.push({
			        name: 'customFilter',
			        fn: function(item /*{File|FileLikeObject}*/, options) {
			            return this.queue.length < 150;
			        }
			    });
			        // CALLBACKS
			        $scope.remove_image = function(){
			            $scope.image_selected = false;
			            $scope.show_choose = true;
			            $scope.uploader.clearQueue();
			            $scope.image_url = '/images/upload.png';
			            jQuery('#file').val('');    //empty the input file value so next time if same file selects then it works
			        };

			        $scope.uploader1.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
					//console.info('onWhenAddingFileFailed', item, filter, options);
			        };
			        $scope.uploader1.onAfterAddingFile = function(fileItem) {
					//console.info('onAfterAddingFile', fileItem);
			            $scope.show_choose = false;
			            if(!fileItem.file.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|mp3|mp4|pdf)$/)){
			                alert('Selected file is not a valid image');
			                $scope.invalid_image = true;
			            }else{
			                $scope.invalid_image = false;
			            }
			        };
			        $scope.uploader1.onAfterAddingAll = function(addedFileItems) {
					//console.info('onAfterAddingAll', addedFileItems);
			        };
			        $scope.uploader1.onBeforeUploadItem = function(item) {
					//console.info('onBeforeUploadItem', item);
			        };
			        $scope.uploader1.onProgressItem = function(fileItem, progress) {
					//console.info('onProgressItem', fileItem, progress);
			        };
			        $scope.uploader1.onProgressAll = function(progress) {
					//console.info('onProgressAll', progress);
			        };
			        $scope.uploader1.onSuccessItem = function(fileItem, response, status, headers) {
					//console.info('onSuccessItem', fileItem, response, status, headers);
			        };
			        $scope.uploader1.onErrorItem = function(fileItem, response, status, headers) {
					//console.info('onErrorItem', fileItem, response, status, headers);
			        };
			        $scope.uploader1.onCancelItem = function(fileItem, response, status, headers) {
					//console.info('onCancelItem', fileItem, response, status, headers);
			        };
			        $scope.uploader1.onCompleteItem = function(fileItem, response, status, headers) {
			            $scope.image_selected = true;
					//console.info('onCompleteItem', fileItem, response, status, headers);
			            $scope.image_url = '../uploads/images/'+fileItem.file.name;
			            $scope.video = fileItem.file.name;
									console.log($scope.video);
			        };
      $scope.uploader1.onCompleteAll = function() {
          console.info('uploader1', $scope.uploader.queue);
      };





    $scope.dates = {
        today: moment.tz('UTC').hour(12).startOf('h'),
        end: moment.tz('UTC').hour(12).startOf('h'), //12:00 UTC, today.
        minDate: moment.tz('UTC').add(-4, 'd').hour(12).startOf('h'), //12:00 UTC, four days ago.
        maxDate: moment.tz('UTC').add(4, 'd').hour(12).startOf('h'), //12:00 UTC, in four days.
    };
      $scope.options = {
        view: 'date',
        format: 'lll',
        maxView: false,
        minView: 'hours',
    };
      $scope.minDate = $scope.dates.minDate;
      $scope.maxDate = $scope.dates.maxDate;
      $scope.formats = [
         "MMMM YYYY",
         "DD MMM YYYY",
         "ddd MMM DD YYYY",
         "D MMM YYYY HH:mm",
         "lll",
         "MM-DD-YYYY hh:mm a",
      ];
      $scope.timezones = [
        ['London, UK', 'Europe/London'],
        ['Hong Kong, China', 'Asia/Hong_Kong'],
        ['Vancouver, Canada', 'America/Vancouver'],
      ];
      $scope.views = ['year', 'month', 'date', 'hours', 'minutes'];
      $scope.callbackState = 'Callback: Not fired';
      $scope.changeDate = function (modelName, newDate) {
        console.log(modelName + ' has had a date change. New value is ' + newDate.format());
        $scope.callbackState = 'Callback: Fired';
      }
      $scope.changeMinMax = function (modelName, newValue) {
        //minDate or maxDate updated. Generate events to update relevant pickers
        var values = {
          minDate: false,
          maxDate: false,
        }
        if (modelName === 'dates.minDate') {
          values.minDate = newValue;
          $scope.$broadcast('pickerUpdate', ['pickerMinDate', 'pickerMinDateDiv', 'pickerMaxSelector'], values);
          values.maxDate = $scope.dates.maxDate;
        } else if (modelName === 'dates.maxDate') {
          values.maxDate = newValue;
          $scope.$broadcast('pickerUpdate', ['pickerMaxDate', 'pickerMaxDateDiv', 'pickerMinSelector'], values);
          values.minDate = $scope.dates.minDate;
        }
        //For either min/max update, update the pickers which use both.
        $scope.$broadcast('pickerUpdate', ['pickerBothDates', 'pickerBothDatesDiv'], values);
      }
      $scope.changeData = function (type) {
        var values = {},
            pickersToUpdate = ['pickerMinDate', 'pickerMaxDate', 'pickerBothDates', 'pickerMinDateDiv', 'pickerMaxDateDiv', 'pickerBothDatesDiv', 'pickerRange'];
        switch (type) {
          case 'view':
            values.view = $scope.options.view;
            break;
          case 'minView':
            values.minView = $scope.options.minView;
            break;
          case 'maxView':
            values.maxView = $scope.options.maxView;
            break;
          case 'format':
            values.format = $scope.options.format;
            break;
        }
        if (values) {
          $scope.$broadcast('pickerUpdate', pickersToUpdate, values);
        }
      }
	}])
