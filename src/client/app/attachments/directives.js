
angular.module('mps.attachments')
  .directive('attachments', ['serviceUrl', function(serviceUrl) {
return {
    restrict: 'A',
    templateUrl: '/app/attachments/templates/attachments.html',
    controller:  [ '$scope',
          '$rootScope',
          '$http',
          '$log',
          '$translate',
          function($scope, $rootScope, $http, $log, $translate){
            $scope.files = [];
            $scope.files_complete = [];
            $scope.files_error = [];
            $scope.sourcefeature = "";

            if($rootScope.sourcefeature && $rootScope.sourcefeature.length > 0) {
                $scope.sourcefeature = $rootScope.sourcefeature;
                $rootScope.sourcefeature = "";
            }

            function ifData(d) {
              if(d.data) {
                return d.data;
              }
            }

            $scope.change = function(files) {              
             	$scope.files = files;
	            $scope.error = false;
	            for(var i = 0; i < $scope.files.length; i++) {
                     $scope.checkFileType($scope.files[i]);
                     if(!$scope.error){
	                     $scope.upload($scope.files[i]);
                     }
	            }
	            $scope.$apply();
	        };

            // TODO - this belongs in a service
            $scope.upload = function(file) {
              $log.debug('  uploading ' + file);

              var fd = new FormData();
              fd.append('file', file);

              var req = {
                method: 'POST',
                transformRequest: angular.identity,
                headers: {
                  'Content-Type' : undefined
                },
                url: serviceUrl + 'attachments',
                data: fd
              };
              $http(req).then($scope.uploadComplete, $scope.uploadError);
            };

            $scope.uploadComplete = function(response) {
              $log.debug('uploadComplete', response);
              if(response.status === 201){
            	  $scope.error = false;
            	  response.data.size = parseInt(response.data.size) /1000000;
                 
            	  $scope.files_complete.push(ifData(response));
                  for(var i =0; i < $scope.files.length; i++) {
                    if($scope.files[i].name === response.data.filename) {
                      $scope.files[i].complete = true;
                    }
                  }  
              }else{
            	  $scope.error = true;
            	  $scope.errorMessage = response.data.message;
              }
                           
              
            };

            $scope.uploadError = function(response) {
              $log.debug('uploadError', response);
              $scope.files_error.push(response);
            };

            $scope.removeAttachment = function(file){
            	var i=0;
            	for(;i<$scope.files_complete.length;i++){
            		if($scope.files_complete[i].filename === file.filename){
            			$scope.files_complete.splice(i,1);
            		}
            	}
            	$scope.files=[];            
            };

            $scope.checkFileType = function(file){
              var tmp = file.name;
              var l = tmp.split('.').pop();
              $scope.error = false;

              switch($scope.sourcefeature) {
                  case 'translation':
                      $scope.fileExtToCheck = ["xliff", "xlf"]; 
                      if($scope.fileExtToCheck.indexOf(l.toLowerCase()) < 0) {
                        $scope.error = true;
                        $scope.errorMessage = $translate.instant('PORTAL_ADMIN_SECTION.MANAGE_TRANSLATION.TXT_UNSUPPORTED_FILE_TYPE_ERROR') + " - " + l;
                      }
                      break;                  
                  default:
                      break;
              }
            };

            // Service code //

          }
        ]
  };
}]);
