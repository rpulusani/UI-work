/* global describe it beforeEach inject expect */

describe('MPS module', function() {

  beforeEach(module('mps'));

  describe('addresses controller', function(){
    var scope, ctrl;

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        ctrl = $controller('AddressesController', {$scope: scope});
    }));

    it('is defined', function() {
      expect(ctrl).toBeDefined();
    });

    it('has a contact', function() {
       expect(scope.contact).toBeDefined();
    });

  });
});