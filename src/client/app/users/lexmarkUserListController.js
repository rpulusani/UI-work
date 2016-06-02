

angular.module('mps.user')
.controller('LexmarkUserListController', ['$scope', '$location', '$translate', 'grid', '$routeParams', '$rootScope', 'BlankCheck', 'LexmarkUser',
    'PersonalizationServiceFactory','FilterSearchService', 'FormatterService', 'UserAdminstration',
    function($scope, $location, $translate, GridService, $routeParams, $rootScope, BlankCheck, LexmarkUser,
        Personalize, FilterSearchService, formatter, UserAdminstration) {
        
        var personal = new Personalize($location.url(), $rootScope.idpUser.id),
        filterSearchService = new FilterSearchService(LexmarkUser, $scope, $rootScope, personal,'defaultSet');
        LexmarkUser.setParamsToNull();
        
        $rootScope.mandatSearchGridContent = angular.element("div[class='grid-content']");
        
        if($routeParams.searchOn === undefined) {
            $rootScope.mandatSearchGridContent.hide();
        }  

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

        filterSearchService.addBasicFilter('USER_MAN.MANAGE_USERS.TXT_FILTER_ALL_USERS', undefined, undefined,
            function() {
                $scope.$broadcast('setupPrintAndExport', $scope);                          
            }
        );

        $scope.view = function(user){
            UserAdminstration.setItem(user);
            $location.path(UserAdminstration.route + '/' + user.userId + '/lexmark-review');
        };
    }
]);

