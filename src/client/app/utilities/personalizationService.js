'use strict';
angular.module('mps.utility')
.factory('PersonalizationServiceFactory', ['$http', '$q', '$rootScope', 'serviceUrl', 'UserService', function($http, $q, $rootScope, serviceUrl, Users) {
    var PersonalizationServiceFactory = function(currentPageUri, userId) {
        this.url = serviceUrl + 'user-preferences/';
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
                url: self.url + email
            }).then(function(res) {
                $rootScope.$broadcast('personalizationGetAll');

                return deferred.resolve(res);
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
                return deferred.resolve(res);
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

                return deferred.resolve(res);
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

                return deferred.resolve(res);
            });
        });

        return deferred.promise;
    };

    return PersonalizationServiceFactory;
}]);

