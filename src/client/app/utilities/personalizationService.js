'use strict';
angular.module('mps.utility')
.factory('PersonalizationServiceFactory', ['$http', '$q', '$rootScope', 'serviceUrl', 'UserService', '$location', function($http, $q, $rootScope, serviceUrl, Users, $location) {
    var PersonalizationServiceFactory = function(currentPageUri, userId) {
        this.url = 'https://venus-dev.lexmark.com/mps-portal/user-preferences/';

        if (currentPageUri) {
            this.currentPageUri = currentPageUri.replace(/\//g, '_').replace(/\/|[?&=]/g, '_');
        } else {
            this.currentPageUri = $location.url().replace(/\//g, '_').replace(/\/|[?&=]/g, '_');
        }
        
        if (userId) {
            this.userId = userId;
        } else {
            this.userId = false;
        }

        this.data;
    };

    PersonalizationServiceFactory.prototype.save = function(key, dataObj) {
        var self = this,
        deferred = $q.defer();

        if (!dataObj) {
            dataObj = key;
            key = self.currentPageUri;
        } else {
            key = key.replace(/\//g, '_').replace(/\/|[?&=]/g, '_');
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

                if (res.data) {
                    self.data = dataObj;
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

                if (res.data) {
                    self.data = res.data;
                }

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
        } else {
            key = key.replace(/\/|[?&=]/g, '_');
        }
        
        Users.getEmail(function(email) {
            $http({
                method: 'GET',
                url: self.url + email + '/' + key
            }).then(function(res) {
                if (res.data) {
                    self.data = res.data;
                }

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
        } else {
            key = key.replace(/\//g, '_').replace(/\/|[?&=]/g, '_');
        }

        Users.getEmail(function(email) {
            $http({
                method: 'PUT',
                url: self.url + email + '/' + key,
                data: dataObj
            }).then(function(res) {
                if (res.data) {
                    self.data = dataObj;
                }

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
        } else {
            key = key.replace(/\//g, '_').replace(/\/|[?&=]/g, '_');
        }

        Users.getEmail(function(email) {
            $http({
                method: 'DELETE',
                url: self.url + email + '/' + key,
            }).then(function(res) {
                $rootScope.$broadcast('personalizationRemove');

                if (res.data) {
                    self.data = null;
                }

                if (res.status === 200 || res.status === 201 || res.status === 202) {
                    return deferred.resolve(true, res);
                } else {
                    return deferred.resolve(null, res);
                }
            });
        });

        return deferred.promise;
    };

    PersonalizationServiceFactory.prototype.getPersonalizedConfiguration = function(keyName) {
        if (this.data) {
            return data[keyName];
        } else {
            return false;
        }
    };

    return PersonalizationServiceFactory;
}]);
