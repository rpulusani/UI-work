define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.attachments', [])
      .directive('attachments', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/attachments/templates/attachments.html',
        controller:  [ '$scope',
              '$http',
              '$log',
              function($scope, $http, $log){
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
                  $log.debug('change', $scope.files);
                  $scope.$apply();
                  for(var i = 0; i < $scope.files.length; i++) {
                    $scope.upload($scope.files[i]);
                  }
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
                    url: 'https://api.venus-dev.lexmark.com/mps/attachments',
                    data: fd
                  }
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



                // Service code //

              }
            ]
      };
  });
});
