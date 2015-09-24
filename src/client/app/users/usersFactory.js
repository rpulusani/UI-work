define(['angular', 'user'], function(angular) {
	'use strict';
	angular.module('mps.user')
	.factory('UserService', ['$resource', 'serviceUrl',
	    function($resource, serviceUrl, halInterceptor) {
	        var url = serviceUrl + '/users/:userId';
	        return $resource(url, {userId: '@userId',type: '@type'}, {});
	    }
	]);
});
