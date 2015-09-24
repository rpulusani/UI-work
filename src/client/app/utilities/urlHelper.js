define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('UrlHelper', [function() {
        return {
            template: function(module, template) {
                return ['/app/', module, '/templates/', template, '.html'].join('');
            }
        };
    }]);
});
