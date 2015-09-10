'use strict';
angular.module('mps.utility')
.factory('BlankCheck', function() {
    var BlankCheck = function() {

    };

    BlankCheck.prototype.checkNotNullOrUndefined = function(value){
        if (value !== undefined && value !== null){
            return true;
        } else {
            return false;
        }
    }

    BlankCheck.prototype.checkNotBlank = function(value){
        if (value !== undefined && value !== null && value !== ''){
            return true;
        } else {
            return false;
        }
    }

    return new BlankCheck();
});
