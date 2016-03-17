angular.module('mps.utility')
.factory('DTMUpdator', ['UserService', '$rootScope', function(Users, $rootScope) {
    var DTM = function() {

    };

    DTM.prototype.update = function() {
        var metaTagArr = angular.element('[data-dtm]'),
        tag, // current meta tag reference, used in loop
        i;

        for (i; i < metaTagArr.length; i += 1) {
            tag = metaTagArr[i];

            console.log(tag)
        }
    };

    return new DTM();
}]);

