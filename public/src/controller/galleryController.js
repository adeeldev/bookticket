angular.module('TurkishApp')
	.controller('galleryController',['$scope','$location','$rootScope','galleryService','FileUploader',function ($scope,$location,$rootScope,galleryService,FileUploader){
		$rootScope.album = '';
		$scope.gallery = [];
		$scope.newAlbum = {};
		$scope.album_image = '';
		$scope.invalid_image = false;
	    $scope.image_selected = false;
	    $scope.show_choose = true;
	    $scope.url = $location.host();
		$scope.port = $location.port();
	    $scope.base_url = 'http://'+$scope.url+':'+$scope.port+'/images/';
		
		var pathArray = $location.url().split('/') ;
    	$scope.albumId = pathArray[2];	
		$scope.getAlbums = function(){
			galleryService.getGallery()
			.then(function (response){
				console.log("albums");
				console.log(response.data);
				console.log(response.data.data);
				$scope.gallery = response.data.data;
			})
		}
		$scope.getAlbums();
		$scope.viewAlbum = function(albumID){
			$rootScope.album = albumID;
			$location.path('/gallery/' + albumID);
		}

		$scope.addAlbum = function(albumName){
			console.log(albumName);
			var str = $scope.album_image.replace(/\s+/g, '_');			
			var data = {
				'name': albumName,
				'albumImage': $scope.base_url+str
			}
			galleryService.addAlbum(data)
			.then(function (res){
				$scope.albumId = res.data._id;
				$location.path('/addImages/' + $scope.albumId);
			})
		}

		$scope.addGallery = function(){

			$scope.images = [];
			angular.forEach($scope.uploader.queue, function(value, key) {
					var filename = value.file.name.replace(/\s+/g, '_');
					$scope.image = $scope.base_url+filename;
					$scope.images.push({'url':$scope.image});
			});	
			var data = {
				'images': $scope.images,
				'albumId': $scope.albumId
			}
			galleryService.addImages(data)
			.then(function (res){
				if(res.status == 200){
					$location.path('/gallery');
				}
			})
		}


		$scope.addSlider = function(a){
			$scope.sliderImages = [];
			angular.forEach($scope.uploader.queue, function(value, key) {
				$scope.files = value.file.name;
				var filename = $scope.files.replace(/\s+/g, '_');			
				$scope.image = $scope.base_url+filename;			
				$scope.sliderImages.push({'url':$scope.image,"title":value.title});
			});	
			galleryService.addSliderImages($scope.sliderImages)
			.then(function (res){
				console.log(res.status);
				if(res.status == 200){
					console.log('dssddssd');
					window.location.reload();
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
            $scope.album_image = fileItem.file.name;

            
        };
        $scope.uploader.onCompleteAll = function() {
            console.info('uploader', $scope.uploader.queue);
        };	
	}])