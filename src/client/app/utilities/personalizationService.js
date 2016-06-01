'use strict';
angular.module('mps.utility')
.factory('PersonalizationServiceFactory', ['$http', '$q', '$rootScope', 'serviceUrl', 'UserService', function($http, $q, $rootScope, serviceUrl, Users) {
    var PersonalizationServiceFactory = function(currentPageUri, userId) {
        this.url = 'https://venus-dev.lexmark.com/mps-portal/user-preferences/';
        this.currentPageUri = currentPageUri.replace(/\//g, '_');
        this.userId = userId;
    };

    PersonalizationServiceFactory.prototype.save = function(key, dataObj) {
        var self = this,
        deferred = $q.defer();

        if (!dataObj) {
            dataObj = key;
            key = self.currentPageUri;
        }

        Users.getEmail(function(email) {
            $http({
                method: 'POST',
                url: self.url + email + '/' + key,
                data: dataObj
            }).then(function(res) {
                $rootScope.$broadcast('personalizationSave');

                if (res.status === 200 || res.status === 201) {
                    return deferred.resolve(res.data, res);
                } else if (res.status === 400) {
                    self.update(key, dataObj).then(function(updateRes) {
                         return deferred.resolve(updateRes, res);
                    });
                } else {
                    return deferred.resolve(null, res);
                }

                return deferred.resolve(res);
            });
        });

        return deferred.promise;
    };

    PersonalizationServiceFactory.prototype.getAll = function(targetEmail) {
        var self = this,
        deferred = $q.defer();
        
        Users.getEmail(function(email) {
            if (targetEmail) {
                email = targetEmail;
            }

            $http({
                method: 'GET',
                url: self.url + email + '/'
            }).then(function(res) {
                $rootScope.$broadcast('personalizationGetAll');

                if (res.status === 200 || res.status === 201) {
                    return deferred.resolve(res.data.userPreferences);
                } else {
                    return deferred.resolve([], res);
                }
            });
        });

        return deferred.promise;
    };

    PersonalizationServiceFactory.prototype.get = function(key) {
        var self = this,
        deferred = $q.defer();

        if (!key) {
            key = self.currentPageUri;
        }
        
        Users.getEmail(function(email) {
            $http({
                method: 'GET',
                url: self.url + email + '/' + key
            }).then(function(res) {
                if (res.status === 200 || res.status === 201) {
                    return deferred.resolve(res.data);
                } else {
                    return deferred.resolve(null, res);
                }
            });
        });

        return deferred.promise;
    };

    PersonalizationServiceFactory.prototype.update = function(key, dataObj) {
        var self = this,
        deferred = $q.defer();

        if (!dataObj) {
            dataObj = key;
            key = self.currentPageUri;
        }

        Users.getEmail(function(email) {
            $http({
                method: 'PUT',
                url: self.url + email + '/' + key,
                data: dataObj
            }).then(function(res) {
                $rootScope.$broadcast('personalizationUpdate');
                if (res.status === 200 || res.status === 201) {
                    return deferred.resolve(res.data);
                } else {
                    return deferred.resolve(null, res);
                }
            });
        });

        return deferred.promise;
    };

    PersonalizationServiceFactory.prototype.remove = function(key) {
        var self = this,
        deferred = $q.defer();

        if (!key) {
            key = self.currentPageUri;
        }

        Users.getEmail(function(email) {
            $http({
                method: 'DELETE',
                url: self.url + email + '/' + key,
            }).then(function(res) {
                $rootScope.$broadcast('personalizationRemove');

                if (res.status === 200 || res.status === 201 || res.status === 202) {
                    return deferred.resolve(true, res);
                } else {
                    return deferred.resolve(null, res);
                }
            });
        });

        return deferred.promise;
    };

    return PersonalizationServiceFactory;
}]);

