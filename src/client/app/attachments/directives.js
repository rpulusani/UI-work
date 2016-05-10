
angular.module('mps.attachments', [])
  .directive('attachments', ['serviceUrl', function(serviceUrl) {
return {
    restrict: 'A',
    templateUrl: '/app/attachments/templates/attachments.html',
    controller:  [ '$scope',
          '$http',
          '$log',
          '$translate',
          function($scope, $http, $log, $translate){
            $scope.files = [];
            $scope.files_complete = [];
            $scope.files_error = [];

            function ifData(d) {
              if(d.data) {
                return d.data;
              }
            }

            $scope.change = function(files) {            	
             	$scope.files = files;
	            $scope.error = false;
	            for(var i = 0; i < $scope.files.length; i++) {
	                   $scope.upload($scope.files[i]);
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
              $scope.files_complete.push(ifData(response));
              for(var i =0; i < $scope.files.length; i++) {
                if($scope.files[i].name === response.data.filename) {
                  $scope.files[i].complete = true;
                }
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
            }

            // Service code //

          }
        ]
  };
}]);
