angular.module('mps.utility')
.factory('DTMUpdater', ['$rootScope', function($rootScope) {
    var DTM = function() {};

    DTM.prototype.update = function() {
        var metaTagArr = angular.element('[data-dtm]'),
        tag, // current meta tag reference, used in loop
        i = 0;

        for (i; i < metaTagArr.length; i += 1) {
            tag = metaTagArr[i];

            switch (tag.name) {
                case 'company-name':
                    tag.value = $rootScope.currentUser.firstName;
                case 'company-level':
                    tag.value = $rootScope.currentUser.firstName;
                case 'account-name':
                    tag.value = $rootScope.currentAccount.name;
                case 'account-id':
                    tag.value = $rootScope.currentAccount.accountId;
                case 'account-geo':
                    tag.value = $rootScope.currentUser.firstName;
                case 'account-country':
                    tag.value = $rootScope.currentUser.firstName;
                case 'account-region':
                    tag.value = $rootScope.currentUser.firstName;
                case 'account-city':
                    tag.value = $rootScope.currentUser.firstName;
                case 'user-name':
                    tag.value = $rootScope.currentUser.userId;
                case 'user-shortname':
                    tag.value = $rootScope.currentUser.shortName;
                case 'user-role':
                    tag.value = $rootScope.currentUser.firstName;
                case 'user-level':
                    tag.value = $rootScope.currentAccount.accountLevel;
                default:
                    break;
            }
        }
    };

    DTM.prototype.getTag = function(tagName) {
       return angular.element('[name=' + tagName + ']')[0].value;
    };

    DTM.prototype.setTag = function(tagName, newValue) {
        angular.element('[name=' + tagName + ']')[0].value = newValue;
    };

    return new DTM();
}]);

