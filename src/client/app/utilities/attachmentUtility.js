

angular.module('mps.utility')
.factory('Attachment', ['serviceUrl', '$translate', 'HATEOASFactory', function(serviceUrl, $translate, HATEOASFactory) {
    var Attachment =  {
        'serviceName': 'attachments',
        'embeddedName': 'attachments'
    };

    return new HATEOASFactory(Attachment);
}]);

