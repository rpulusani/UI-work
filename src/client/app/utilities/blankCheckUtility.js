define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('BlankCheck', function() {
        var BlankCheck = function() {

        };

        BlankCheck.prototype.checkNotNullOrUndefined = function(value){
            return value !== undefined && value !== null;
        };

        BlankCheck.prototype.checkNotBlank = function(value){
            return value !== undefined && value !== null && value !== '';
        };

        BlankCheck.prototype.isNull = function(value) {
            return value === undefined || value === null;
        };
    
        BlankCheck.prototype.isNullOrWhiteSpace = function(value) {
            return value === undefined || value === null || value === '';
        };

        return new BlankCheck();
    });
});
