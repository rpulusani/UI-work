define(['angular', 'utility.blankCheckUtility', 'user', 'user.factory', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.user')
    .controller('LexmarkUserListController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'LexmarkUser',
        'PersonalizationServiceFactory','FilterSearchService', 'FormatterService', 'UserAdminstration',
        function($scope, $location, $translate, Grid, $routeParams, $rootScope, BlankCheck, LexmarkUser,
            Personalize, FilterSearchService, formatter, UserAdminstration) {
            
            LexmarkUser.setParamsToNull();
             if (UserAdminstration.item) {
                $scope.saved = false;
                $scope.invited = false;
                $scope.user = UserAdminstration.item;
                $scope.fullName = formatter.getFullName($scope.user.firstName, $scope.user.lastName);
                if (UserAdminstration.wasSaved) {
                    $scope.saved = true;
                }

                if (UserAdminstration.wasInvited) {
                    $scope.invited = true;
                }
            }
            var personal = new Personalize($location.url(), $rootScope.idpUser.id),
            filterSearchService = new FilterSearchService(LexmarkUser, $scope, $rootScope, personal,'defaultSet');

            filterSearchService.addBasicFilter('USER.ALL_USER', undefined, undefined,
                function() {}
            );

            $scope.view = function(user){
                // UserAdminstration.setItem(user);
                // var options = {
                //     params:{
                //         embed:'roles,accounts'
                //     }
                // };

                // UserAdminstration.item.get(options).then(function(){
                //     console.log(UserAdminstration);
                //     //$location.path(UserAdminstration.route + '/' + user.userId + '/lexmark-review');
                // });

                LexmarkUser.setItem(user);
                UserAdminstration.setItem(user);
                $location.path(UserAdminstration.route + '/' + user.userId + '/lexmark-review');

            };
        }
    ]);
});
