window.config = {portal: {serviceUrl: ''}, idp: {}};
angular.module('gatekeeper', [])
.provider('Gatekeeper', function(){
   return {
        configure: jasmine.createSpy(),
        protect: jasmine.createSpy(),
        $get: function() {
            return {tokenInfo: {}, user: {id: 1}};
        }
    };
});
