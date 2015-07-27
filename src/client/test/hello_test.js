/* global describe it beforeEach inject expect */

describe('customer-portal.hello module', function() {

  beforeEach(module('customer-portal.hello'));

  describe('hello controller', function(){
    var scope, ctrl;

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        ctrl = $controller('HelloCtrl', {$scope: scope});
    }));

    it('is defined', function() {
      expect(ctrl).toBeDefined();
    });

    it('has a name', function() {
        expect(scope.name).toBeDefined();
    });

  });
});