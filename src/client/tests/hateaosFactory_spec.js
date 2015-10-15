define(['angular', 'angular-mocks', 'utility.hateaosFactory', 'fixtures'],
    function(angular, mocks) {
        describe('HATEAOSFactory.js', function() {
            var scope,
            httpBackend,
            mockServiceDefinition,
            mockFactory;

            beforeEach(module('mps'));

            beforeEach(inject(function($rootScope, $httpBackend, HATEAOSFactory, $q) {
                var hateaosConfig = {
                    serviceName: 'contacts',
                    columns: [
                        {
                            'name': 'fullname',
                            'field': '',
                            'cellTemplate': 
                                '<div>' +
                                    '<a href="" ng-click="grid.appScope.goToUpdate(row.entity)" ' +
                                    'ng-bind="row.entity.lastName + \', \' +  row.entity.firstName"></a>' +
                                '</div>'
                        },
                        {'name': 'address', 'field': 'address'},
                        {'name': 'work phone', 'field': 'workPhone'},
                        {'name': 'alternate phone', 'field': 'alternatePhone'},
                        {'name': 'email', 'field': 'email'}
                    ],
                    route: '/service_requests/contacts'
                };

                mockFactory = new HATEAOSFactory(hateaosConfig);
            }));

            describe('getApi() -- Initial call', function() {
                //it('getApi() - route to /new', function() {
                    
                //});
            });
        });
    }
);
