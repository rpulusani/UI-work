
angular.module('mps.user')
.controller('ManageUserPreferenceController', [
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
        $scope.showUserUpdatedMessage = false;
        var redirect_to_list = function() {
           $location.path('/');
        };
        User.getLoggedInUserInfo().then(function() {
            $scope.user = User.item;
            $scope.userName = $scope.user.firstName + ' ' + $scope.user.lastName;
            var contact12 =  $scope.user._links.contact.href;
        });
        $scope.userPreference = true;
        $scope.isLoading = false;
        $scope.languageOptions = UserAdminstration.languageOptions($translate);

        $scope.updateEmail = function(){
            $location.path('/user_update_email');
        }
        $scope.resetPassword = function(){
            $location.path('/user_reset_password');
        }
        $scope.saveUserInfo = function(){
            $scope.isLoading = true;
            $scope.user.postURL = UserAdminstration.url + '/' + $scope.user.userId;
            UserAdminstration.setItem($scope.user);
            UserAdminstration.item.postURL = UserAdminstration.url + '/' + $scope.user.userId;
            var options = {
                preventDefaultParams: true
            }
            var deferred = UserAdminstration.put({
                item:  {
                    _links: $scope.user._links,
                    postURL: $scope.user.postURL,
                    ldapId: $scope.user.ldapId,
                    contactId: $scope.user.contactId,
                    idpId: $scope.user.idpId,
                    type: $scope.user.type,
                    active: $scope.user.active,
                    firstName: $scope.user.firstName,
                    lastName: $scope.user.lastName,
                    password: $scope.user.password,
                    email: $scope.user.email,
                    userId: $scope.user.userId,
                    workPhone: $scope.user.workPhone,
                    address: $scope.user.address,
                    preferredLanguage: $scope.user.preferredLanguage,
                    resetPassword: $scope.user.resetPassword
                }
            }, options);

            deferred.then(function(result){
                $scope.isLoading = false;
                $scope.showUserUpdatedMessage = true;
                $translate.use(result.data.preferredLanguage);
                $('.site-content').scrollTop(0,0);
            }, function(reason){
                NREUM.noticeError('Failed to update user because: ' + reason);
            });
        }
        $scope.configure = {
            actions:{
                translate:{
                    submit: 'USER_PROFILE_MAN.COMMON.BTN_SAVE',
                    abandonRequest: 'USER_PROFILE_MAN.COMMON.BTN_DISCARD_CHANGES'
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
                returnPath: '/'
            },
            breadcrumbs: {
                1:{
                    value: 'USER_PROFILE_MAN.COMMON.TAB_INFORMATION'
                }
            }
        };
    }
]);


