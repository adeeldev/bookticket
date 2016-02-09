angular.module('TurkishApp')
	.controller('presentationController',['$scope','presentationService','$uibModal', 'FileUploader' , '$location',function ($scope, presentationService, $uibModal, FileUploader, $location){
		$scope.message = "Presentation & Videos";
		$scope.serverMsg = '';
		$scope.Events = [];
		$scope.noEvent = false;
		$scope.newEvent = {};
		$scope.serverError = false;
		$scope.login = {};
	    $scope.signup = {};
	    $scope.submit = {};
	    $scope.invalid_image = false;
	    $scope.image_selected = false;
	    $scope.show_choose = true;
	    // $scope.image_url = 'modules/testcomics/images/upload.png';		
	$scope.url = $location.host();
	$scope.port = $location.port();
	$scope.base_url = 'http://'+$scope.url+':'+$scope.port+'/images/';
	$scope.pdf_url = 'http://'+$scope.url+':'+$scope.port+'/presentation/';
	console.log($scope.base_url);

	$scope.animationsEnabled = true;
	$scope.presentations = function(){
		console.log('dddd');
		presentationService.getAllPresentations()
		.then(function (result){
			console.log(result.data);
			if(result.data.length == 0){
				$scope.noAlbum = true;
			}else{
				$scope.presentation = result.data;
			}
		})
		.catch(function (err){
			if(err.status == 500){
				$scope.serverError = true;				
			}
		})
	}

	$scope.addVideo = function(presentationData){
		console.log(presentationData);
		$scope.images_data = [];
		angular.forEach($scope.uploader.queue, function(value, key) {
			$scope.files = value.file.name;
			var str = $scope.files.replace(/\s+/g, '_');
			var res = str.split(".");
			console.log(res);
			if(res[1] == 'pdf' || res[1] == 'mp4'){
				$scope.images_data.push({'url':$scope.pdf_url+str});
			}else if(res[1] == 'png' || res[1] == 'jpg' ){
				$scope.images_data.push({'thumbnail':$scope.base_url+str});	
			}else if(res[1] == 'pdf' || res[1] == 'mp4'){
				$scope.images_data.push({'url':$scope.pdf_url+$scope.files});
			}else if(res[1] == 'png' || res[1] == 'jpg'){
				$scope.images_data.push({'thumbnail':$scope.base_url+str});
			}else{
				console.log('no data');
			}

  			
		});
		$scope.images_data.push({'title':presentationData.title});				
		presentationService.addVideo($scope.images_data)
		.then(function (result){
			console.log(result.data);
			if(result.data.length == 0){
				$scope.nullPresentation = false;	
			}else{
				console.log(result.data);
			}
		})
		.catch(function (err){
			if(err.status == 500){
				$scope.serverError = true;
				//$scope.presentations;
			}
		})

	} 

	$scope.save = function(presentationData){
		console.log(presentationData);
		$scope.images_data = [];
		angular.forEach($scope.uploader.queue, function(value, key) {
			$scope.files = value.file.name;
			var str = $scope.files.replace(/\s+/g, '_');
			console.log(str);
			// $scope.file_path = $scope.base_url+$scope.files;
			var res = str.split(".");
			console.log(res);
			if(res[1] == 'pdf' || res[1] == 'mp4'){
				$scope.images_data.push({'url':$scope.pdf_url+str});
			}else if(res[1] == 'png' || res[1] == 'jpg' ){
				$scope.images_data.push({'thumbnail':$scope.base_url+str});	
			}else if(res[1] == 'pdf' || res[1] == 'mp4'){
				$scope.images_data.push({'url':$scope.pdf_url+$scope.files});
			}else if(res[1] == 'png' || res[1] == 'jpg'){
				$scope.images_data.push({'thumbnail':$scope.base_url+str});
			}else{
				console.log('no data');
			}

  			
		});
		$scope.images_data.push({'title':presentationData.title});				
		presentationService.addPresentation($scope.images_data)
		.then(function (result){
			console.log(result.data);
			if(result.data.length == 0){
				$scope.nullPresentation = false;	
			}else{
				console.log(result.data);
			}
		})
		.catch(function (err){
			if(err.status == 500){
				$scope.serverError = true;
				//$scope.presentations;
			}
		})

	} 

    $scope.deletePresentation = function(promotionId){
        var id = {'id' : promotionId}
        presentationService.deletePresentation(id)
        .then(function (deletePresentation){
            console.log(deletePresentation.data);
            if(deletePresentation.data.length == 0){
                $scope.deletePresentation = true;
            }else{
                $scope.promotionResult = deletePresentation.data;
            }
        })
        .catch(function (err){
            if(err.status == 500){
                $scope.serverError = true;              
            }
        })
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
//            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        $scope.uploader.onAfterAddingFile = function(fileItem) {
//            console.info('onAfterAddingFile', fileItem);
            $scope.show_choose = false;
            if(!fileItem.file.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|mp3|mp4|pdf)$/)){
                alert('Selected file is not a valid image');
                $scope.invalid_image = true;
            }else{
                $scope.invalid_image = false;
            }
        };
        $scope.uploader.onAfterAddingAll = function(addedFileItems) {
//            console.info('onAfterAddingAll', addedFileItems);
        };
        $scope.uploader.onBeforeUploadItem = function(item) {
//            console.info('onBeforeUploadItem', item);
        };
        $scope.uploader.onProgressItem = function(fileItem, progress) {
//            console.info('onProgressItem', fileItem, progress);
        };
        $scope.uploader.onProgressAll = function(progress) {
//            console.info('onProgressAll', progress);
        };
        $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
//            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
//            console.info('onErrorItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCancelItem = function(fileItem, response, status, headers) {
//            console.info('onCancelItem', fileItem, response, status, headers);
        };
        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
            $scope.image_selected = true;
//            console.info('onCompleteItem', fileItem, response, status, headers);
            $scope.image_url = '../uploads/images/'+fileItem.file.name;
            $scope.signup.profile_image = fileItem.file.name;
            
        };
        $scope.uploader.onCompleteAll = function() {
            console.info('uploader', $scope.uploader.queue);
        };		


	}])