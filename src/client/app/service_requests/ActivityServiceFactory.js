

angular.module('mps.serviceRequests')
.factory('ActivityService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var Activity = {
        		 serviceName: 'serviceActivityDetails',
        		 embeddedName: 'serviceActivities', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                hideBookmark: true,
                url: serviceUrl + 'service-requests/serviceActivityDetails',
                columnDefs: {
                    defaultSet: [
                        {'name':'Serial Number', 'field':'serialNumber', 'notSearchable': true},
                        {'name': 'Device Type', 'field': 'deviceType', 'notSearchable': true},
                        {'name': 'Activity Number', 'field': 'activityNumber', 'notSearchable': true},
                        {'name': 'Status Detail', 'field' : 'statusDetail', 'notSearchable': true},
                        {'name': 'Building' , 'field' : 'physicalLocation1', 'notSearchable': true},
                        {'name': 'Floor' , 'field' :'physicalLocation2', 'notSearchable': true},
                        {'name': 'Office' , 'field' : 'physicalLocation3', 'notSearchable': true}                        
                    ]             
                
              }
      };

    return  new HATEOASFactory(Activity);
}]);

