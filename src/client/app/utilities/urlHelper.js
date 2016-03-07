
'use strict';
angular.module('mps.utility')
.constant('UrlHelper', {
    template: function(module, template) {
        return ['/app/', module, '/templates/', template, '.html'].join('');
    },
    user_template: function(template) {
        return ['/app/users/templates/', template, '.html'].join('');
    },
    report_template: function(template) {
        return ['app/reporting/templates/', template, '.html'].join('');
    }
});

