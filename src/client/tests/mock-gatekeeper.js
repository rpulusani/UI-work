window.config = {portal: {serviceUrl: ''}, idp: {}};
angular.module('angular-gatekeeper', [])
.provider('Gatekeeper', function(){
   return {
        configure: jasmine.createSpy(),
        protect: jasmine.createSpy(),
        $get: function() {
            return {tokenInfo: {}, user: {id: 1}};
        }
    };
});
