
    angular.module('mps.user')
    .controller('ProfileController', [
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
            $scope.provinces = null;
            $scope.goToEmailUpdate = function(){
                $location.path('/profile/update_email');
            };
            $scope.countrySelected = function() {
                if($scope.user && $scope.user.address && $scope.user.address.countryIsoCode !== ''){
                    var item = $scope.countries.filter(function(item) { return item.code === $scope.user.address.countryIsoCode; });
                    $scope.user.address.country = item[0].name;
                    $scope.provinces = item[0].provinces;
                }
            };

            $scope.configure = {
                actions:{
                    translate:{
                        abandonRequest:'USER_PROFILE_MAN.COMMON.BTN_DISCARD_CHANGES',
                        submit: 'USER_PROFILE_MAN.COMMON.BTN_SAVE'
                    },
                    submit: function(){
                        UserService.updateProfile($rootScope.currentUser.email, $scope.user);
                    }
                }
            };

            var promiseUser = $rootScope.currentUser.deferred;
            var countryPromise = $q.defer();
            var userPreference = $q.defer();

            $q.all([countryPromise.promise, promiseUser.promise, userPreference.promise]).then(function(){
                $scope.user = angular.copy($scope.tempUser);
                if($scope.user.address.countryIsoCode === null){
                    $scope.user.address.countryIsoCode = '';
                }
                if(!$scope.provinces || $scope.provinces.length === 0){
                    $scope.user.address.stateCode = '';
                }
                $scope.countrySelected();
                $scope.h1TranslatedValues = {userFullName: Formatter.getFullName($scope.user.firstName,$scope.user.lastName) };
            });

            Country.get().then(function(){
                $scope.countries = Country.data;
                countryPromise.resolve();
            });
            UserPreferences.get().then(function(data){
                $scope.userPreferences = data;
                userPreference.resolve();
            });
            promiseUser.promise.then(function(){
                UserService.getProfile($rootScope.currentUser.email).then(function(profile){
                    $scope.tempUser = profile;
                    if($scope.tempUser && !$scope.tempUser.address){
                        $scope.tempUser.address = {};
                    }
                    promiseUser.resolve();
                });
            });
        }
    ]);
