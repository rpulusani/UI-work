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

    it('has a name in contact', function() {
       expect(scope.contact.name).toBeDefined();
    });

    it('has a phoneNumber in contact', function() {
       expect(scope.contact.phoneNumber).toBeDefined();
    });

    it('has a emailAddress in contact', function() {
       expect(scope.contact.emailAddress).toBeDefined();
    });

    describe('when test data is loaded', function(){
       beforeEach(function() { scope.loadTestData(); });

       it('has Vickers PetsAtHome as name in contact', function() {
         expect(scope.contact.name).toBe('Vickers PetsAtHome');
       });

       it('has 9992882222 as phoneNumber in contact', function() {
         expect(scope.contact.phoneNumber).toBe('9992882222');
       });

       it('has vickerspets@test.com as emailAddress in contact', function() {
         expect(scope.contact.emailAddress).toBe('vickerspets@test.com');
       });
    });

    describe('when saved', function() {
       it('returns true', function() {
          expect(scope.save()).toBe(true);
       });
    });

    describe('when backed up', function() {
      it('returns false', function(){
         expect(scope.back()).toBe(false);
      });
    });

    describe('when cancelled', function() {
       it('returns false', function(){
         expect(scope.back()).toBe(false);
      });
    });

    describe('when taggled', function() {
       describe('with attachmentIsShown was originally true', function() {
          it('should set attachmentIsShown to be false', function() {
             scope.attachmentIsShown = true;
             scope.attachmentToggle();
             expect(scope.attachmentIsShown).toBe(false);
          });
       });

       describe('with attachmentIsShown was originally false', function() {
          it('should set attachmentIsShown to be true', function() {
             scope.attachmentIsShown = false;
             scope.attachmentToggle();
             expect(scope.attachmentIsShown).toBe(true);
          });
       });
    });

  });
});