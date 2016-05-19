

angular.module('mps.orders')
.factory('SuppliesCatalogFactory', [
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
        var OrderTypes = {
            serviceName: 'supply-catalog',
            embeddedName: 'orderParts',
             columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'itemNumber', visible:false, 'notSearchable': true,  enableCellEdit:false},
                        {'name': 'image', displayName:'',
                            'field':'', enableCellEdit:false, width: '8%',
                            'cellTemplate': '<img src="{{row.entity.imageUrl}}" style="width:80px; height:80px;" />'
                        },
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_TYPE'),
                            'field':'type', enableCellEdit:false, width:'20%'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PART_NUM'),
                            'field':'displayItemNumber', enableCellEdit:false, width:'12%',
                             'cellTemplate': '<span>{{row.entity.displayItemNumber}}</span>'+
                             '<ul ng-if="row.entity.childItems && row.entity.childItems.length > 0"> Hi </ul>'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_SUPPLIES_DESC'),
                            'field':'description', enableCellEdit:false, width:'27%', cellClass:'long-text-wrap'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.TXT_GRID_ORDER_PRICE'),
                            'field':'priceCurrencyFormat()', enableCellEdit:false, width: '8%', cellClass:'long-text-wrap', isPrice: true},

                        {'name': 'actions', displayName: '',
                            'field':'',
                            'cellTemplate':'<div>' +
                                '<button ng-if="!grid.appScope.isAdded(row.entity)" type="button" class="push btn btn--default"'+
                                'ng-click="grid.appScope.addToOrder(row.entity); grid.appScope.selectRow(row);"' +
                                'translate="DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.BTN_GRID_SUPPLIES_ADD"></button>' +
                                '<button ng-if="grid.appScope.isAdded(row.entity)" type="button" class="push btn btn--secondary"' +
                                'ng-click="grid.appScope.removeFromOrder(row.entity); grid.appScope.deSelectRow(row);"' +
                                'translate="DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.BTN_GRID_SUPPLIES_REMOVE"></button>',
                            width: '25%',
                            enableCellEdit:false
                        }
                    ]
                },

                functionArray: [
                    {
                        name: 'priceCurrencyFormat',
                        functionDef: function(){
                            if(this.billingModel === 'USAGE_BASED_BILLING'){
                                return $translate.instant('ORDER_MAN.COMMON.TEXT_INCLUDED_IN_LEASE');
                            }else{
                                return formatter.formatCurrency(this.price);
                            }
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
            route: ''
        };

    return new HATEOASFactory(OrderTypes);
}]);

