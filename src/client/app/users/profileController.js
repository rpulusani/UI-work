
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
            $scope.countrySelected = function() {
              console.log($scope.user.address.country);
              var item = $scope.countries.filter(function(item) { return item.code === $scope.user.address.country; });
              $scope.provinces = item[0].provinces;
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
                            $scope.user.address.country = item[0].code;
                            $scope.countrySelected();
                        },0);
                    });
                    UserPreferences.get().then(function(data){
                        $scope.userPreferences = data;
                        if(!$scope.user.language && !$scope.language){
                            $timeout(function(){
                                $scope.user.language = 'EN';
                            },0);
                        }
                    });
                });
            });
        }
    ]);
