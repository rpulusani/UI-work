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
                    "id": "item1",
                    "title": "Item 1",
                    "items": [
                        {
                            "id": "item1.1",
                            "title": "Item 1.1"
                        },
                        {
                            "id": "item1.2",
                            "title": "Item 1.2"
                        }
                    ]
                };
            }));

            describe("When an item is selected", function(){
                it("all of it's children should be selected", function(){
                    var limit = scope.item.items ? scope.item.items.length : 0;

                    scope.item.selected = true;
                    scope.toggleChildren(scope.item);

                    for(var i=0;i<limit;i++){
                        expect(scope.item.items[i].selected).toEqual(true);
                    }
                });

                it("all of it's children should be disabled", function(){
                    var limit = scope.item.items ? scope.item.items.length : 0;

                    scope.item.selected = true;
                    scope.toggleChildren(scope.item);

                    for(var i=0;i<limit;i++){
                        expect(scope.item.items[i].disabled).toEqual(true);
                    }
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

            describe("When an item is not selected", function(){
                it("should enable all of it's children", function(){
                    var limit = scope.item.items ? scope.item.items.length : 0;

                    scope.item.selected = false;
                    scope.toggleChildren(scope.item);

                    for(var i=0;i<limit;i++){
                        expect(scope.item.items[i].disabled).toEqual(false);
                    }
                });
            });
        });
    });
});
