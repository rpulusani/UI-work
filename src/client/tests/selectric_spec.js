define(['angular','angular-mocks', 'lxk.fef', 'jquery'],
function(angular, mocks, fef, $) {
  describe('selectric directive', function() {
      var $compile, $rootScope, el;
      beforeEach(module('mps'));
      beforeEach(inject(function(_$compile_, _$rootScope_, $httpBackend) {
        $httpBackend.when('GET', '/etc/resources/i18n/en.json').respond({it: 'works'});
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        el = $compile('<div selectric model="model" placeholder="place" options="options" value="value" label="label"></div>')($rootScope);
        $rootScope.options = [
            {value: '1', label: 'a'},
            {value: '2', label: 'b'},
            {value: '3', label: 'c'},
            {value: '4', label: 'd'}
        ];
        $rootScope.$digest();
      }));
      it('loads', function () {
        expect(el.html()).toContain('option');
      });
      it('has placeholder as first option', function () {
        expect($(el[0]).find('li:first-child').text()).toBe('place');
      });
      it('selects on click', function () {
        $(el[0]).find('li:last-child').click();
        expect($rootScope.model).toBe('4');
      });
      it('removes options when removed', function () {
        expect($(el[0]).find('li').length).toBe(5);
        $rootScope.options = [];
        $rootScope.$digest();
        expect($(el[0]).find('li').length).toBe(1);
      });
      it('changes selection with binding', function () {
        $rootScope.model = '3';
        $rootScope.$digest();
        expect($(el[0]).find('li[class=selected]').text()).toBe('c');
      });
  });
});
