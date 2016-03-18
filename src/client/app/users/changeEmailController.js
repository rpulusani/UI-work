angular.module('mps.user')
.controller('ChangeEmailController', [
    '$scope',
    '$location',
    'UserService',
    '$rootScope',
    'Country',
    'UserPreferences',
    '$timeout',
    '$q',
    'FormatterService',
    function(
    $scope,
    $location,
    UserService,
    $rootScope,
    Country,
    UserPreferences,
    $timeout,
    $q,
    Formatter
    ) {
        $scope.configure = {
            actions:{
                translate:{
                    abandonRequest:'USER_PROFILE_MAN.UPDATE_EMAIL.BTN_DISCARD_CHANGES',
                    submit: 'USER_PROFILE_MAN.UPDATE_EMAIL.BTN_SAVE'
                },
                submit: function(){
                    if($scope.newEmail){
                        $scope.user.email = $scope.newEmail;
                        UserService.updateProfile($rootScope.currentUser.email, $scope.user);
                        $rootScope.logout();
                    }
                }
            }
        };
        var promiseUser = $rootScope.currentUser.deferred;
          promiseUser.promise.then(function(){
            UserService.getProfile($rootScope.currentUser.email).then(function(profile){
                $scope.user = profile;
                promiseUser.resolve();
            });
        });

        $q.all([promiseUser.promise]).then(function(){
        });
    }
]);
