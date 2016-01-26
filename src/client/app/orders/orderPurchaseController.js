define(['angular','order', 'utility.grid'], function(angular) {
    'use strict';
    angular.module('mps.orders')
    .controller('OrderPurchaseController', [
        '$scope',
        '$location',
        '$rootScope',
        'OrderRequest',
        'grid',
        'FilterSearchService',
        'SRControllerHelperService',
        'ServiceRequestService',
        'OrderItems',
        '$translate',
        function(
            $scope,
            $location,
            $rootScope,
            Orders,
            Grid,
            FilterSearchService,
            SRHelper,
            ServiceRequest,
            OrderItems,
            $translate) {

            SRHelper.addMethods(Orders, $scope, $rootScope);
            $scope.editable = false; //make order summary not actionable
            $rootScope.currentRowList = [];

            var configureSR = function(ServiceRequest){
                    ServiceRequest.addField('description', '');
                    ServiceRequest.addRelationship('account', $scope.device);
                    ServiceRequest.addRelationship('asset', $scope.device, 'self');
                    ServiceRequest.addRelationship('primaryContact', $scope.device, 'contact');
                    ServiceRequest.addField('type', 'SUPPLIES_ASSET_REQUEST');
            };


            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
            if($rootScope.device){
                $scope.getRequestor(ServiceRequest, Contacts);
            }

            function configureReviewTemplate(){
                configureTemplates();
                $scope.configure.actions.translate.submit = 'DEVICE_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_SUPPLIES';
                $scope.configure.actions.submit = function(){
                   var deferred = ServiceRequest.post({
                         item:  $scope.sr
                    });

                    deferred.then(function(result){
                        $location.path(Orders.route + '/' + $scope.device.id + '/receipt');
                    }, function(reason){
                        NREUM.noticeError('Failed to create SR because: ' + reason);
                    });

                };
            }

            function configureReceiptTemplate(){
                $scope.configure.header.translate.h1 = "DEVICE_SERVICE_REQUEST.REQUEST_SERVICE_FOR_SUBMITTED";
                $scope.configure.header.translate.body = "DEVICE_SERVICE_REQUEST.REQUEST_SERVICE_SUBMIT_HEADER_BODY";
                $scope.configure.header.translate.bodyValues= {
                    'srNumber': FormatterService.getFormattedSRNumber($scope.sr),
                    'srHours': 24,
                    'deviceManagementUrl': 'device_management/',
                };
                $scope.configure.receipt = {
                    translate:{
                        title:"DEVICE_SERVICE_REQUEST.REQUEST_SERVICE_DETAIL",
                        titleValues: {'srNumber': FormatterService.getFormattedSRNumber($scope.sr) }
                    }
                };
                $scope.configure.contact.show.primaryAction = false;
            }
            function configureTemplates(){
                     $scope.configure = {
                        header: {
                            translate:{
                                h1: 'DEVICE_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_SUPPLIES',
                                h1Values:{},
                                body: 'DEVICE_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_SUPPLIES_PAR',
                                bodyValues: '',
                                readMore: 'DEVICE_MAN.SUPPLY_ORDER_REVIEW.LNK_LEARN_MORE'
                            },
                            readMoreUrl: '#'
                        },
                        contact:{
                            translate: {
                                title: 'SERVICE_REQUEST.CONTACT_INFORMATION',
                                requestedByTitle: 'SERVICE_REQUEST.REQUEST_CREATED_BY',
                                primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                                changePrimary: 'DEVICE_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_CHANGE_CONTACT'
                            },
                            show:{
                                primaryAction : true
                            },
                            source: 'DeviceOrder'
                        },
                        detail:{
                            translate:{
                                title: 'DEVICE_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ADDL_DETAILS',
                                referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                                costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
                                comments: 'LABEL.COMMENTS',
                                attachments: 'DEVICE_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ATTACHMENTS_SIZE',
                                attachmentMessage: 'DEVICE_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ATTACH_FILE_FORMATS',
                                fileList: ''
                            },
                            show:{
                                referenceId: true,
                                costCenter: true,
                                comments: true,
                                attachements: true
                            }
                        },
                        actions:{
                            translate: {
                                abandonRequest:'DEVICE_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_ABANDON_SUPPLIES',
                                submit: 'DEVICE_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_SUPPLIES'
                            },
                            submit: function() {
                                $location.path(Orders.route + '/' + $scope.device.id + '/review');
                            }
                        },
                        modal:{
                            translate:{
                                abandonTitle: 'SERVICE_REQUEST.TITLE_ABANDON_MODAL',
                                abandondBody: 'SERVICE_REQUEST.BODY_ABANDON_MODAL',
                                abandonCancel:'SERVICE_REQUEST.ABANDON_MODAL_CANCEL',
                                abandonConfirm: 'SERVICE_REQUEST.ABANDON_MODAL_CONFIRM',
                            },
                            returnPath: Orders.route + '/'
                        },
                        contactPicker:{
                            translate:{
                                title: 'CONTACT.SELECT_CONTACT',
                                contactSelectText: 'CONTACT.SELECTED_CONTACT_IS',
                            },
                            returnPath: Orders.route + '/' +  '/review' //$scope.device.id +
                        }
                    };
            }
        }
    ]);
});
