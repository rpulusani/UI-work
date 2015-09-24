define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .constant('UrlHelper', {
        template: function(module, template) {
            return ['/app/', module, '/templates/', template, '.html'].join('');
        },
        user_template: function(template) {
            return ['/app/users/templates/', template, '.html'].join('');
        }
    });
});
