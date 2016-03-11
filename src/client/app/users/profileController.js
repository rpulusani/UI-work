define(['angular'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('ProfileController', [
        '$scope',
        '$location',
        'UserService',
        '$rootScope',
        'Country',
        'UserPreferences',
        '$timeout',
        function(
        $scope,
        $location,
        UserService,
        $rootScope,
        Country,
        UserPreferences,
        $timeout
        ) {
            $scope.goToEmailUpdate = function(){
                $location.path('/profile/update_email');
            };

            $scope.preferedLanguageSelected = function(language) {
                $scope.user.language = language;
            };
            $scope.countrySelected = function(country) {
              $scope.user.address.country = country;
            };

            $scope.configure = {
                actions:{
                    translate:{
                        abandonRequest:'USER_PROFILE_MAN.COMMON.BTN_DISCARD_CHANGES',
                        submit: 'USER_PROFILE_MAN.COMMON.BTN_SAVE'
                    },
                    submit: function(){
                        console.log($scope.language);
                    }
                }
            };

            var promise = $rootScope.currentUser.deferred.promise;
            promise.then(function(){
                UserService.getProfile($rootScope.currentUser.email).then(function(profile){
                    $scope.user = profile;
                    if($scope.user && !$scope.user.address){
                        $scope.user.address = {};
                    }
                    Country.get().then(function(){
                        $scope.countries = Country.data;
                        $timeout(function(){
                            var item = $scope.countries.filter(function(item) { return item.code === 'US'; });
                            $scope.country = item[0];
                            $('#country select').val(item[0].code).selectric('refresh').change();
                            $scope.countrySelected(item[0].code);
                        },0);
                    });
                    UserPreferences.get().then(function(data){
                        $scope.userPreferences = data;
                        if(!$scope.user.language && !$scope.language){
                            $timeout(function(){
                                var item = $scope.userPreferences.filter(function(item) { return item.localeCode === 'EN'; });
                                $('#language select').val('EN').selectric('refresh').change();
                                $scope.user.language = 'EN';
                                $scope.preferedLanguageSelected('EN');
                            },0);
                        }
                    });
                });
            });
        }
    ]);
});
