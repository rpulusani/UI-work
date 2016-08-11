
angular.module('mps.user')
.controller('UserUpdateEmailController', [
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
        if(User.item === null)
            redirect_to_preference();
        $scope.user = User.item;
        $scope.currentEmail = $scope.user.email;
        $scope.isLoading = false;
        $scope.saveUserInfo = function(){
            $scope.isLoading = true;
            $scope.user.email = $scope.newEmail;
            UserAdminstration.setItem($scope.user);
            UserAdminstration.item.postURL = UserAdminstration.url + '/' + $scope.user.userId;
            var options = {
                preventDefaultParams: true
            }
            var deferred = UserAdminstration.put({
                item:  $scope.user
            }, options);

            deferred.then(function(result){
                $scope.isLoading = false;
                $scope.showUserUpdatedMessage = true;
                $('.site-content').scrollTop(0,0);
                $rootScope.logout();
            }, function(reason){
                NREUM.noticeError('Failed to update user because: ' + reason);
            });
        }

        $scope.configure = {
            actions:{
                translate:{
                    submit: 'USER_PROFILE_MAN.UPDATE_EMAIL.BTN_SAVE',
                    abandonRequest: 'USER_PROFILE_MAN.UPDATE_EMAIL.BTN_DISCARD_CHANGES'
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
                    value: 'USER_PROFILE_MAN.UPDATE_EMAIL.TXT_UPDATE_EMAIL'
                }
            }
        };
    }
]);


