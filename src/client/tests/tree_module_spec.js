define([
    'angular',
    'angular-mocks',
    'tree',
    'tree.treeItemsService',
    'tree.treeController',
    'tree.treeItemController',
    'tree.directives'
], function(angular, mocks, tree){
    'use strict';

    describe('Tree Module', function() {
        beforeEach(module('mps'));

        describe('TreeController', function(){
            var scope, ctrl;

            beforeEach(inject(function($rootScope, $controller){
                scope = $rootScope.$new();
                ctrl = $controller('TreeController', {$scope: scope});
                spyOn(scope, '$broadcast');
            }));

            /*commenting as bulk action should not happen now*/
            /*describe('Bulk Action', function(){
                it('Should broadcast an event', function(){
                    var test = 'test';
                    scope.bulkAction(test);
                    expect(scope.$broadcast).toHaveBeenCalledWith(test);
                });
            });*/
        });

        describe("Tree Item Controller", function(){
            var scope, ctrl, compile;

            beforeEach(inject(function($rootScope, $controller){
                scope = $rootScope.$new();
                ctrl = $controller('TreeItemController', {$scope: scope});
                spyOn(scope, '$broadcast');
                scope.item = {
                    "accountId": "item1",
                    "name": "Item 1",
                    "items": [
                        {
                            "accountId": "item1.1",
                            "name": "Item 1.1"
                        },
                        {
                            "accountId": "item1.2",
                            "name": "Item 1.2"
                        }
                    ]
                };
            }));

            /*Commenting test as this functionality needs to be revisited*/
            describe("When an item is selected", function(){
                it("if action is selectLevel then set the value object based on the selected item", function(){
                    scope.action = 'selectLevel';
                    scope.value = {};
                    scope.item.selected = true;
                    scope.toggleChildren(scope.item);
                    expect(scope.value.id).toEqual('item1');
                    expect(scope.value.name).toEqual('Item 1');
                });
                it("if action is selectLevel then set the value object based on the selected item", function(){
                    scope.treeType = 'chl';
                    scope.selectedItems = [];
                    scope.filterChl = function(item) {
                        item.name = 'abc';
                    };
                    scope.item.selected = true;
                    scope.toggleChildren(scope.item);
                    expect(scope.value.id).toEqual('item1');
                    expect(scope.value.name).toEqual('Item 1');
                });
            });

            describe('expandCall', function(){
                it('Should broadcast an event and toggle the value for expanded flag', function(){
                    scope.item.expanded = true;
                    scope.expandCall();
                    expect(scope.$broadcast).toHaveBeenCalledWith('expanded');
                    expect(scope.item.expanded).toEqual(false);
                });
            });

            /*Commenting test as this functionality needs to be revisited*/
            /*describe("When an item is not selected", function(){
                it("should enable all of it's children", function(){
                    var limit = scope.item.items ? scope.item.items.length : 0;

                    scope.item.selected = false;
                    scope.toggleChildren(scope.item);

                    for(var i=0;i<limit;i++){
                        expect(scope.item.items[i].disabled).toEqual(false);
                    }
                });
            });*/
        });
    });
});
