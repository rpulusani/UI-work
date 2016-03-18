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
            },
            modal: {
                    translate: {
                        abandonTitle: 'USER_PROFILE_MAN.COMMON.TITLE_ABANDON_MODAL',
                        abandonBody: 'USER_PROFILE_MAN.COMMON.BODY_ABANDON_MODAL',
                        abandonCancel:'USER_PROFILE_MAN.COMMON.ABANDON_MODAL_CANCEL',
                        abandonConfirm: 'USER_PROFILE_MAN.COMMON.ABANDON_MODAL_CONFIRM'
                    },
                    returnPath: '/profile'
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
