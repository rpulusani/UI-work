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
                    tag.content = $rootScope.currentUser.firstname + ' ' + $rootScope.currentUser.lastname;
                    break;
                case 'user-shortname':
                    tag.content = $rootScope.currentUser.userid;
                    break;
                case 'user-role':
                    tag.content = $rootScope.currentUser.firstName;
                    break;
                case 'account-level':
                    if ($rootScope.currentAccount) {
                        tag.content = $rootScope.currentAccount.accountLevel;
                    }
                    break;
                default:
                    break;
            }
        }

        s.prop20 = s.eVar20 = document.querySelector('meta[name="company-name"]').getAttribute('content');
        s.prop21 = s.eVar21 = document.querySelector('meta[name="company-level"]').getAttribute('content');
        s.prop28 = s.eVar28 = document.querySelector('meta[name="user-name"]').getAttribute('content');
        s.prop29 = s.eVar29 = document.querySelector('meta[name="user-shortname"]').getAttribute('content');
        s.prop30 = s.eVar30 = document.querySelector('meta[name="user-role"]').getAttribute('content');
        s.prop22 = s.eVar22 = document.querySelector('meta[name="account-name"]').getAttribute('content');
        s.prop23 = s.eVar23 = document.querySelector('meta[name="account-id"]').getAttribute('content');
        s.prop24 = s.eVar24 = document.querySelector('meta[name="account-level"]').getAttribute('content');
        s.prop25 = s.eVar25 = document.querySelector('meta[name="account-country"]').getAttribute('content');
        s.prop26 = s.eVar26 = document.querySelector('meta[name="account-region"]').getAttribute('content');
        s.prop27 = s.eVar27 = document.querySelector('meta[name="account-city"]').getAttribute('content');

        s.t();
    };

    DTM.prototype.getTag = function(tagName) {
       return angular.element('[name=' + tagName + ']')[0].content;
    };

    DTM.prototype.setTag = function(tagName, newValue) {
        angular.element('[name=' + tagName + ']')[0].content = newValue;
    };

    return new DTM();
}]);

