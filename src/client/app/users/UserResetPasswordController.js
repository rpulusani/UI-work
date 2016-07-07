
angular.module('mps.user')
.controller('UserResetPasswordController', [
    '$http',
    '$rootScope',
    '$scope',
    '$location',
    '$routeParams',
    'BlankCheck',
    'UserAdminstration',
    'Roles',
    'AccountService',
    'UserService',
    'FormatterService',
    'PersonalizationServiceFactory',
    'SecurityHelper',
    '$q',
    'AllAccounts',
    '$translate',
    function(
        $http,
        $rootScope,
        $scope,
        $location,
        $routeParams,
        BlankCheck,
        UserAdminstration,
        Roles,
        Account,
        User,
        FormatterService,
        Personalize,
        SecurityHelper,
        $q,
        AllAccounts,
        $translate
        ) {
        
        var redirect_to_preference = function() {
           $location.path('/user_preference');
        };
        if(User.item === null){
            User.getLoggedInUserInfo().then(function() {
                $scope.user = User.item;
            });
        }
        else{
            $scope.user = User.item;
        }
        $scope.showUserUpdatedMessage = false;
        
        $scope.saveUserInfo = function(){
            $scope.user.password = $scope.new_Password;
            UserAdminstration.setItem($scope.user);
            UserAdminstration.item.postURL = UserAdminstration.url + '/' + $scope.user.userId;
            var options = {
                preventDefaultParams: true
            }
            var deferred = UserAdminstration.put({
                item:  $scope.user
            }, options);

            deferred.then(function(result){
                $scope.new_Password = $scope.confirm_Password = '';
                $('form').removeClass('ng-submitted');
                $scope.showUserUpdatedMessage = true;
                $('.site-content').scrollTop(0,0);
            }, function(reason){
                NREUM.noticeError('Failed to update user because: ' + reason);
            });
        }
        $scope.configure = {
            actions:{
                translate:{
                    submit: 'USER_PROFILE_MAN.RESET_PASSWORD.BTN_SAVE',
                    abandonRequest: 'USER_PROFILE_MAN.RESET_PASSWORD.BTN_DISCARD_CHANGES'
                },
                abandonRequest : $scope.abandonRequest,
                submit : $scope.saveUserInfo 
            },
            modal: {
                translate: {
                    abandonTitle: 'USER_PROFILE_MAN.COMMON.TITLE_ABANDON_MODAL',
                    abandonBody: 'USER_PROFILE_MAN.COMMON.BODY_ABANDON_MODAL',
                    abandonCancel:'USER_PROFILE_MAN.COMMON.ABANDON_MODAL_CANCEL',
                    abandonConfirm: 'USER_PROFILE_MAN.COMMON.ABANDON_MODAL_CONFIRM'
                },
                returnPath: '/user_preference'
            },
            breadcrumbs: {
                1:{
                    value: 'USER_PROFILE_MAN.RESET_PASSWORD.TXT_RESET_PASSWORD'
                }
            }
        };
    }
]);