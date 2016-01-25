define(['angular', 'order', 'hateoasFactory.serviceFactory', 'utility.formatters', 'utility.imageService'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .factory('AssetPartsFactory', [
        'serviceUrl',
        '$translate',
        'HATEOASFactory',
        'FormatterService',
        '$filter',
        'imageService',
        '$q',
        function(
            serviceUrl,
            $translate,
            HATEOASFactory,
            formatter,
            $filter,
            ImageService,
            $q
            ) {

            var OrderItems = {
                    serviceName: 'orderParts',
                    embeddedName: 'parts', //get away from embedded name and move to a function to convert url name to javascript name
                    columns: 'defaultSet',
                    columnDefs: {
                        defaultSet: [
                            {'name': 'id', 'field': 'itemNumber', visible:false, 'notSearchable': true,  enableCellEdit:false},
                            {'name': 'image', displayName:'',
                                'field':'', enableCellEdit:false, width: '100',
                                'cellTemplate': '<img src="{{row.entity.imageUrl}}" style="width:80px; height:80px;" />'
                            },
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_TYPE'),
                                'field':'type', enableCellEdit:false, width:'250'},
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PART_NUM'),
                                'field':'displayItemNumber', enableCellEdit:false, width:'150'},
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_DESC'),
                                'field':'description', enableCellEdit:false, width:'400'},
                            {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PRICE'),
                                'field':'priceCurrencyFormat()', enableCellEdit:false, width: '100'},

                            {'name': 'actions', displayName: '',
                                'field':'',
                                'cellTemplate':'<div>' +
                                    '<button ng-if="!grid.appScope.isAdded()" type="button" class="push btn btn--default" ng-click="grid.appScope.addToOrder(row.entity)"' +
                                    'translate="DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.BTN_GRID_SUPPLIES_ADD"></button>' +
                                    '<button ng-if="grid.appScope.isAdded()" type="button" class="push btn btn--default" ng-click="grid.appScope.removeFromOrder(row.entity)"' +
                                    'translate="DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.BTN_GRID_SUPPLIES_REMOVE"></button>',
                                width: '300',
                                enableCellEdit:false
                            }
                        ]
                    },

                    functionArray: [
                        {
                            name: 'priceCurrencyFormat',
                            functionDef: function(){
                                return formatter.formatCurrency(this.price);
                            }
                        }
                    ],


                    getSingleThumbnail: function(item){
                        var self = this;
                        var thumbService = ImageService.getPartStandardImageUrl(item.itemNumber);
                        self.thumbnails.push(thumbService);
                        thumbService.then(function(url){
                            item.imageUrl = url;
                        }, function(reason){
                            NREUM.noticeError('Image url was not found reason: ' + reason);
                        });
                    },

                    thumbnails:[],

                    getThumbnails: function(){
                        var self = this;
                        var data = self.data;
                        for(var i = 0; i < data.length; ++i){
                            self.getSingleThumbnail(data[i]);
                        }
                    },

                    route: '/orders',
            };
        return  new HATEOASFactory(OrderItems);
    }]);
});
