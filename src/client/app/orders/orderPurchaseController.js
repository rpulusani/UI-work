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
        'Devices',
        '$timeout',
        'Contacts',
        'BlankCheck',
        'FormatterService',
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
            $translate,
            Devices,
            $timeout,
            Contacts,
            BlankCheck,
            FormatterService) {

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

            if (Devices.item === null) {
                $scope.redirectToList();
            } else{
                $rootScope.device = Devices.item;
                 if (!BlankCheck.isNull(Devices.item['contact'])) {
                    $scope.device.primaryContact = $scope.device['contact']['item'];
                }else{

                }
            }

            $scope.setupSR(ServiceRequest, configureSR);
            $scope.setupTemplates(configureTemplates, configureReceiptTemplate, configureReviewTemplate );
            if($rootScope.device){
                $scope.getRequestor(ServiceRequest, Contacts);
            }

            function configureReviewTemplate(){
                configureTemplates();
                $timeout(function(){
                OrderItems.columns = 'pruchaseSet';
                    $scope.$broadcast('OrderContentRefresh', {
                        'OrderItems': OrderItems // send whatever you want
                    });
                }, 50);
                $scope.configure.actions.translate.submit = 'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_SUPPLIES';
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
                if($scope.device){
                     $scope.configure = {
                        header: {
                            translate:{
                                h1: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_SUPPLIES',
                                h1Values:{ productModel: Devices.item.productModel},
                                body: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_REVIEW_SUPPLIES_PAR',
                                bodyValues: '',
                                readMore: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.LNK_LEARN_MORE'
                            },
                            readMoreUrl: '#'
                        },
                        order:{
                            details:{
                                translate:{
                                    title:'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_DETAILS',
                                    action:'ORDER_MAN.SUPPLY_ORDER_REVIEW.LNK_CHANGE'
                                },
                                actionLink:{}

                            }
                        },
                        contact:{
                            translate: {
                                title: 'ORDER_MAN.COMMON.TXT_ORDER_CONTACTS',
                                requestedByTitle: 'ORDER_MAN.COMMON.TXT_ORDER_CREATED_BY',
                                primaryTitle: 'SERVICE_REQUEST.PRIMARY_CONTACT',
                                changePrimary: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_CHANGE_CONTACT'
                            },
                            show:{
                                primaryAction : true
                            },
                            source: 'OrderPurchase'
                        },
                        detail:{
                            translate:{
                                title: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ADDL_DETAILS',
                                referenceId: 'SERVICE_REQUEST.INTERNAL_REFERENCE_ID',
                                costCenter: 'SERVICE_REQUEST.REQUEST_COST_CENTER',
                                comments: 'LABEL.COMMENTS',
                                attachments: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ATTACHMENTS_SIZE',
                                attachmentMessage: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.TXT_ORDER_ATTACH_FILE_FORMATS',
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
                                abandonRequest:'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_ABANDON_SUPPLIES',
                                submit: 'ORDER_MAN.SUPPLY_ORDER_REVIEW.BTN_ORDER_SUBMINT_SUPPLIES'
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

             if (!BlankCheck.isNull($scope.device.primaryContact)){
                    $scope.formattedPrimaryContact = FormatterService.formatContact($scope.device.primaryContact);

            }
        }
    ]);
});
