'use strict';
angular.module('mps.utility')
.factory('DTMUpdater', ['$rootScope', function($rootScope) {
    var DTM = function() {};

    DTM.prototype.update = function(currentUser, currentAccount, currentAddress) {
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
                    break;
                case 'company-level':
                    if ($rootScope.currentAccount) {
                        tag.content = $rootScope.currentAccount.accountLevel;
                    }
                    break;
                case 'account-name':
                    if ($rootScope.currentAccount) {
                        tag.content = $rootScope.currentAccount.name;
                    }
                    break;
                case 'account-id':
                    if ($rootScope.currentAccount) {
                        tag.content = $rootScope.currentAccount.accountId;
                    }
                    break;
                case 'account-geo':
                    if ($rootScope.currentUser.address) {
                        tag.content = $rootScope.currentUser.address.countryIsoCode;
                    }
                    break;
                case 'account-country':
                    if ($rootScope.currentUser.address) {
                        if ($rootScope.currentUser.address.country) {
                            tag.content = $rootScope.currentUser.address.country;
                        } else {
                            tag.content = $rootScope.currentUser.address.countryIsoCode;
                        }
                    }
                    break;
                case 'account-region':
                    if ($rootScope.currentUser.address) {
                        if (!$rootScope.currentUser.address.region) {
                            tag.content =  $rootScope.currentUser.address.state;
                        } else {
                            tag.content =  $rootScope.currentUser.address.region;
                        }
                    }
                    break;
                case 'account-city':
                    if ($rootScope.currentUser.address) {
                        tag.content = $rootScope.currentUser.address.city;
                    }
                    break;
                case 'user-name':
                    tag.content = $rootScope.currentUser.userId;
                    break;
                case 'user-shortname':
                    tag.content = $rootScope.currentUser.shortName;
                    break;
                case 'user-role':
                    tag.content = $rootScope.currentUser.firstName;
                    break;
                case 'user-level':
                    if ($rootScope.currentAccount) {
                        tag.content = $rootScope.currentAccount.accountLevel;
                    }
                    break;
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

