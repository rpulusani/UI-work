'use strict';
angular.module('mps.utility')
.factory('DTMUpdater', ['$rootScope', '$http', function($rootScope, $http) {
    var DTM = function() {};

    DTM.prototype.update = function() {
        var metaTagArr = angular.element('[data-dtm]'),
        tag, // current meta tag reference, used in loop
        i = 0;

        for (i; i < metaTagArr.length; i += 1) {
            tag = metaTagArr[i];

            switch (tag.name) {
                case 'company-name':
                    if ($rootScope.currentAccount) {
                        tag.content = $rootScope.currentAccount.name;
                    }
                case 'company-level':
                    if ($rootScope.currentAccount) {
                        tag.content = $rootScope.currentAccount.accountLevel;
                    }
                case 'account-name':
                    if ($rootScope.currentAccount) {
                        tag.content = $rootScope.currentAccount.name;
                    }
                case 'account-id':
                    if ($rootScope.currentAccount) {
                        tag.content = $rootScope.currentAccount.accountId;
                    }
                case 'account-geo':
                    tag.content = $rootScope.currentUser.address.countryIsoCode;
                case 'account-country':
                    tag.content =  (function() {
                        if ($rootScope.currentUser.address.country) {
                            return $rootScope.currentUser.address.country;
                        } else {
                            return $rootScope.currentUser.address.countryIsoCode;
                        }
                    }());
                case 'account-region':
                    tag.content = (function() {
                        if (!$rootScope.currentUser.address.region) {
                            return $rootScope.currentUser.address.state;
                        } else {
                            return $rootScope.currentUser.address.region;
                        }
                    }());
                case 'account-city':
                    tag.content = $rootScope.currentUser.address.city;
                case 'user-name':
                    tag.content = $rootScope.currentUser.userId;
                case 'user-shortname':
                    tag.content = $rootScope.currentUser.shortName;
                case 'user-role':
                    tag.content = $rootScope.currentUser.firstName;
                case 'user-level':
                    if ($rootScope.currentAccount) {
                        tag.content = $rootScope.currentAccount.accountLevel;
                    }
                default:
                    break;
            }
        }
    };

    DTM.prototype.getTag = function(tagName) {
       return angular.element('[name=' + tagName + ']')[0].content;
    };

    DTM.prototype.setTag = function(tagName, newValue) {
        angular.element('[name=' + tagName + ']')[0].content = newValue;
    };

    return new DTM();
}]);

