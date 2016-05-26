

angular.module('mps.pageCount')
.factory('PageCountService', ['serviceUrl', '$translate', 'HATEOASFactory', 'FormatterService',
    function(serviceUrl, $translate, HATEOASFactory, formatter) {
        var PageCountService = {
                serviceName: 'meter-reads',
                embeddedName: 'assetMeterReads', //get away from embedded name and move to a function to convert url name to javascript name
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [
                        {'name': 'id', 'field': 'assetId', visible:false, 'notSearchable': true},
                        {'name': $translate.instant('DEVICE_MGT.SERIAL_NO'), 'field':'serialNumber',
                          'cellTemplate':'<div>' +
                                        '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                        '>{{row.entity.serialNumber}}</a>' +
                                    '</div>'
                        },
                        {'name': $translate.instant('DEVICE_MAN.COMMON.TXT_DEVICE_TAG'), 'field':'assetTag'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE.TXT_PRODUCT_MODEL'), 'field': 'productModel'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_IP_ADDR'), 'field':'ipAddress'},
                        {'name': $translate.instant('DEVICE_MAN.MANAGE_DEVICE_OVERVIEW.TXT_HOSTNAME'), 'field':'hostName'},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_LAST_READ_DATE'), 'field': 'getFormattedLastReadDate()', 'notSearchable': true},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_CURRENT_READ_DATE'), 'field': 'getFormattedTodaysDate()', 'notSearchable': true,
                        'cellTemplate': '<div class="ui-grid-cell-contents">' +
                            '<input datepicker max="grid.appScope.getTodaysDate()" min="row.entity.lastReadDate" type="text" ng-model="row.entity.currentReadDate" date-val="row.entity.currentReadDate" time="true" time-interval="60"/> ' +
                        '</div>',
                        enableCellEdit: true,
                        width: '150',
                        enableCellEditOnFocus: true
                        },
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_PRIOR_LIFETIME_PAGE_COUNT'), 'field':'ltpcValue', 'notSearchable': true, width: '100',},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_NEW_LIFETIME_PAGE_COUNT'), 'field':'status', 'notSearchable': true,
                        'cellTemplate':'<div>' +
                                        '<input type="number" ng-model="row.entity.newLtpcCount" ' +
                                        '/>' +
                                    '</div>',
                        width: '150',
                        enableCellEdit: true,
                        enableCellEditOnFocus: true},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_PRIOR_COLOR_COUNT'), 'field':'colorValue', 'notSearchable': true},
                        {'name': $translate.instant('DEVICE_MAN.DEVICE_PAGE_COUNTS.TXT_PAGE_COUNT_NEW_COLOR_COUNT'), 'field':'', 'notSearchable': true,
                         'cellTemplate':'<div ng-if="row.entity.colorMeterReadId">' +
                                        '<input type="number" ng-model="row.entity.newColorCount" ' +
                                        '/>' +
                                    '</div>',
                        enableCellEdit: true,
                        width: '150',
                        enableCellEditOnFocus: true
                        },
                        {'name': 'Save', 'field': 'assetId',
                         'cellTemplate':'<div>' +
                                '<a href="" ng-click="grid.appScope.save(row.entity);" ' +
                            '>Save</a>' +
                        '</div>', 'notSearchable': true}
                    ],
                },
                functionArray: [
                    {
                        name: 'getFormattedLastReadDate',
                        functionDef: function(){
                            return formatter.formatDate(this.lastReadDate);
                        }
                    },
                    {
                        name: 'getFormattedTodaysDate',
                        functionDef: function(){
                            return formatter.formatDate(new Date);
                        }
                    }
                ],
                url: serviceUrl + 'meter-reads',
                route: '/page_count'
        };

    return  new HATEOASFactory(PageCountService);
}]);
angular.module('mps.pageCount')
.factory('PageCountHelper', function() {
		return{
			validatePageCount: function(params,$translate) {
				 var result={
					ltpc:{},
					color:{}
				};

				if (!this.isDigitPageCount(params.newLTPC) || (params.isColorCapable && !this.isDigitPageCount(params.newColor))){                    
					result.ltpc.msg=$translate.instant('PAGE_COUNTS.ERROR.VALID_PAGECOUNT');
					result.ltpc.msgNotUpdate='';
					result.ltpc.status='REJECTED';
					result.color.msg='';
					result.color.status='REJECTED';
					return result;
				}
				result.ltpc=this.checkForLTPCCountDifference(params,$translate);
				if (params.isColorCapable){
					result.color=this.checkForColorCountDifference(params,$translate);                
				}
				return result;
			},
			checkForColorCountDifference:function(pageCountParams,$translate){				
					var diff=(pageCountParams.newColor - pageCountParams.oldColor),
					daysDiff=30,
					msgNotUpdate='',
					status='ACCEPTED',msgColor='';
					
					if (diff < 0){
						msgColor = $translate.instant('PAGE_COUNTS.ERROR.COLOR_READ_LESS');
						msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED');
						status = 'REJECTED';
					} else if ( diff > (pageCountParams.newLTPC - pageCountParams.oldLTPC)){
						msgColor = $translate.instant('PAGE_COUNTS.ERROR.COLOR_READ_DIFFERENCE');
						msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED');
						status = 'REJECTED';
					} else if (diff > 50000){
						msgColor = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_COLOR_READHIGH');
						msgNotUpdate = 'PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED';
						status = 'DEFERRED';
					} else if (diff < 10){
						msgColor = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_COLOR_READLOW');
						msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED');
						status = 'DEFERRED';
					} else if (diff > (daysDiff * 2000)){
						msgColor = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_COLOR_READHIGH');
						msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED');
						status = 'DEFERRED';
					}
					
					return {
						msg:msgColor,
						msgNotUpdate:msgNotUpdate,
						status:status                
					}
			},
			checkForLTPCCountDifference: function(pageCountParams,$translate){
					var diff=(pageCountParams.newLTPC - pageCountParams.oldLTPC),
					daysDiff=30,
					msg='',msgNotUpdate='',status='ACCEPTED';
					if (diff < 0){
						msg = $translate.instant('PAGE_COUNTS.ERROR.LTPC_VALUE_LESS');
						msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED');
						status = 'REJECTED';
					} else if (diff > 50000){
						msg = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_LTPC_HIGH');
						msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED');
						status = 'DEFERRED';
					} else if (diff < 10){
						msg = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_LTPC_LOW');
						msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED');
						status = 'DEFERRED';
					} else if (diff > (daysDiff * 2000)){
						msg = $translate.instant('PAGE_COUNTS.ERROR.UNREASONABLE_LTPC_HIGH');
						msgNotUpdate = $translate.instant('PAGE_COUNTS.ERROR.NOT_UPDATED_DEFERRED');
						status = 'DEFERRED';
					}                
					return {
						msg:msg,
						msgNotUpdate:msgNotUpdate,
						status:status                    
					}
			},
			isDigitPageCount: function (s){ 
				var patrn=/^[0-9]{1,20}$/; 
				if (!patrn.exec(s)) 
					return false; 
				return true; 
			}
			
				
		};
});

 
