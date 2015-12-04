define(['angular', 'report'], function(angular) {
    'use strict';
    angular.module('mps.report')
    .factory('Reports', ['$translate', 'HATEOASFactory',
        function($translate, HATEOASFactory) {
            var Report = {
                params: {page: 0, size: 20, sort: ''},
                serviceName: 'reports',
                embeddedName: 'reportTypes',
                columns: 'defaultSet',
                columnDefs: {
                    defaultSet: [],
                    /* Asset Register */
                    mp9058sp: [
                        {'name': $translate.instant('REPORTING.REPORTING_HIERARCHY'), 'field': 'chl', minWidth: 420},
                        {'name': $translate.instant('REPORTING.ADDRESS_NAME'), 'field': 'addressName', minWidth: 240},
                        {'name': $translate.instant('REPORTING.DEVICE'), 'field': 'device', minWidth: 120},
                        {'name': $translate.instant('REPORTING.SERIAL_NUMBER'), 'field': 'serialNumber', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ASSET_TAG'), 'field': 'assetTag', minWidth: 150},
                        {'name': $translate.instant('REPORTING.DEVICE_TAG_CUSTOMER'), 'field': 'deviceTagCustomer', minWidth: 240},
                        {'name': $translate.instant('REPORTING.DEVICE_STATUS'), 'field': 'deviceStatus', minWidth: 150},
                        {'name': $translate.instant('REPORTING.LAST_LTPC'), 'field': 'lastLtpc', minWidth: 120},
                        {'name': $translate.instant('REPORTING.LAST_LTPC_DATE'), 'field': 'lastLtpcDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150 },
                        {'name': $translate.instant('REPORTING.IP_ADDRESS'), 'field': 'ipAddress', minWidth: 150},
                        {'name': $translate.instant('REPORTING.HOST_NAME'), 'field': 'hostName', minWidth: 150},
                        {'name': $translate.instant('REPORTING.MAC_ADDRESS'), 'field': 'macAddress', minWidth: 150},
                        {'name': $translate.instant('REPORTING.DIVISION'), 'field': 'division', minWidth: 150},
                        {'name': $translate.instant('REPORTING.LIFE_CYCLE'), 'field': 'lifeCycle', minWidth: 150},
                        {'name': $translate.instant('REPORTING.STORE_FRONT_NAME'), 'field': 'storeFrontName', minWidth: 210},
                        {'name': $translate.instant('REPORTING.COST_CENTER'), 'field': 'costCenter', minWidth: 150},
                        {'name': $translate.instant('REPORTING.DEPT_NUMBER'), 'field': 'departNumber', minWidth: 180},
                        {'name': $translate.instant('REPORTING.DEPT_NAME'), 'field': 'departmentName', minWidth: 180},
                        {'name': $translate.instant('REPORTING.INSTALL_DATE'), 'field': 'installDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150},
                        {'name': $translate.instant('REPORTING.TERM_START_DATE'), 'field': 'termStartDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150},
                        {'name': $translate.instant('REPORTING.TERM_END_DATE'), 'field': 'termEndDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150},
                        {'name': $translate.instant('REPORTING.TERMS'), 'field': 'terms', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ADDRESS'), 'field': 'address', minWidth: 240},
                        {'name': $translate.instant('REPORTING.CITY'), 'field': 'city', minWidth: 150},
                        {'name': $translate.instant('REPORTING.STATE'), 'field': 'state', minWidth: 150},
                        {'name': $translate.instant('REPORTING.PROVINCE'), 'field': 'province', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ZIPCODE'), 'field': 'zipcode', minWidth: 150},
                        {'name': $translate.instant('REPORTING.COUNTY'), 'field': 'county', minWidth: 150},
                        {'name': $translate.instant('REPORTING.COUNTRY'), 'field': 'country', minWidth: 150},
                        {'name': $translate.instant('REPORTING.PHYSICAL_LOC_1'), 'field': 'phyLoc1', minWidth: 240},
                        {'name': $translate.instant('REPORTING.PHYSICAL_LOC_2'), 'field': 'phyLoc2', minWidth: 240},
                        {'name': $translate.instant('REPORTING.PHYSICAL_LOC_3'), 'field': 'phyLoc3', minWidth: 240},
                        {'name': $translate.instant('REPORTING.AGREEMENT'), 'field': 'agreement', minWidth: 150}
                    ],
                    /* MADC */
                    mp9073: [
                        {'name': $translate.instant('REPORTING.ACCOUNT_NAME'), 'field': 'accountName', minWidth: 250},
                        {'name': $translate.instant('REPORTING.ASSET_TAG'), 'field': 'assetTag', minWidth: 150},
                        {'name': $translate.instant('REPORTING.COUNTRY'), 'field': 'country', minWidth: 150},
                        {'name': $translate.instant('REPORTING.DEVICE'), 'field': 'device', minWidth: 150},
                        {'name': $translate.instant('REPORTING.EVENT_DATE'), 'field': 'eventDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150},
                        {'name': $translate.instant('REPORTING.EVENT_TYPE'), 'field': 'type', minWidth: 150},
                        {'name': $translate.instant('REPORTING.GEO'), 'field': 'geo', minWidth: 150},
                        {'name': $translate.instant('REPORTING.MANUFACTURER'), 'field': 'manufacturer', minWidth: 150},
                        {'name': $translate.instant('REPORTING.NEW_ADDRESS_NAME'), 'field': 'newAddress', minWidth: 240},
                        {'name': $translate.instant('REPORTING.NEW_ASSET_SERIAL_NUMBER'), 'field': 'newSerialNumber', minWidth: 240},
                        {'name': $translate.instant('REPORTING.NEW_IP_ADDRESS'), 'field': 'newIp', minWidth: 150},
                        {'name': $translate.instant('REPORTING.NEW_REPORTING_HIERARCHY'), 'field': 'newChl', minWidth: 240},
                        {'name': $translate.instant('REPORTING.OLD_ADDRESS_NAME'), 'field': 'oldAddress', minWidth: 240},
                        {'name': $translate.instant('REPORTING.OLD_IP_ADDRESS'), 'field': 'oldIp', minWidth: 150},
                        {'name': $translate.instant('REPORTING.OLD_REPORTING_HIERARCHY'), 'field': 'oldChl', minWidth: 240},
                        {'name': $translate.instant('REPORTING.SERIAL_NUMBER'), 'field':'origSerialNumber', minWidth: 150}
                    ],
                    /* Missing Meter Reads */
                    mp0075: [],
                    /* Consumables Orders */
                    mp0021: [],
                    /* Hardware Orders */
                    hw0008: [
                        {'name': $translate.instant('REPORTING.ACCOUNT'), 'field': 'account', minWidth: 240},
                        {'name': $translate.instant('REPORTING.AREA'), 'field': 'srArea', minWidth: 150},
                        {'name': $translate.instant('REPORTING.BILLING_MODEL'), 'field': 'billingModel', minWidth: 150},
                        {'name': $translate.instant('REPORTING.CARRIER'), 'field': 'carrier', minWidth: 150},
                        {'name': $translate.instant('REPORTING.COMMENTS'), 'field': 'comments', minWidth: 150},
                        {'name': $translate.instant('REPORTING.CUSTOMER_PO_NUMBER'), 'field': 'customerPo', minWidth: 210},
                        {'name': $translate.instant('REPORTING.CUSTOMER_REQUESTED_DATE'), 'field': 'customerRequestedDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 210},
                        {'name': $translate.instant('REPORTING.DELIVERED_DATE'), 'field': 'deliveredDate', minWidth: 150},
                        {'name': $translate.instant('REPORTING.DELIVERY_CONTACT_EMAIL_ADDRESS'), 'field': 'deliveryContactEmail', minWidth: 270},
                        {'name': $translate.instant('REPORTING.DELIVERY_CONTACT_NAME'), 'field': 'deliveryContactName', minWidth: 210},
                        {'name': $translate.instant('REPORTING.DELIVERY_CONTACT_PHONE_NUMBER'), 'field': 'deliveryContactPhoneNumber', minWidth: 270},
                        {'name': $translate.instant('REPORTING.DELIVERY_INSTRUCTIONS'), 'field': 'deliveryInstructions', minWidth: 210},
                        {'name': $translate.instant('REPORTING.EAI_SYNC_STATUS'), 'field': 'eaiSyncStatus', minWidth: 150},
                        {'name': $translate.instant('REPORTING.EXPEDITE'), 'field': 'expedite', minWidth: 150},
                        {'name': $translate.instant('REPORTING.EXTERNAL_ORDER_NUMBER'), 'field': 'externalOrderNumber', minWidth: 210},
                        {'name': $translate.instant('REPORTING.FREIGHT_FORWARDER_NUMBER'), 'field': 'freightForwaderNumber', minWidth: 210},
                        {'name': $translate.instant('REPORTING.FULFILLED_QUANTITY'), 'field': 'fullfillQty', minWidth: 210},
                        {'name': $translate.instant('REPORTING.FULFILLMENT_TYPE'), 'field': 'fufillmentType', minWidth: 150},
                        {'name': $translate.instant('REPORTING.HELP_DESK_REFERENCE_NUMBER'), 'field': 'helpDeskRefNumber', minWidth: 240},
                        {'name': $translate.instant('REPORTING.HARDWARE_CONFIG_ID'), 'field': 'hwConfigId', minWidth: 180},
                        {'name': $translate.instant('REPORTING.INVENTORY_PARTNER_ADDRESS'), 'field': 'inventoryPartnerAddress', minWidth: 210},
                        {'name': $translate.instant('REPORTING.INVENTORY_PARTNER_FLAG'), 'field': 'inventoryPartnerFlag', minWidth: 210},
                        {'name': $translate.instant('REPORTING.INVENTORY_PARTNER_SHIP_TO'), 'field': 'inventoryPartnerShipTo', minWidth: 210},
                        {'name': $translate.instant('REPORTING.LINE_NUMBER'), 'field': 'lineNumber', minWidth: 150},
                        {'name': $translate.instant('REPORTING.LINE_TYPE'), 'field': 'lineType', minWidth: 150},
                        {'name': $translate.instant('REPORTING.MODEL'), 'field': 'model', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ORDER_DATE'), 'field': 'orderDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ORDER_HEADER_STATUS'), 'field': 'orderHeaderStatus', minWidth: 210},
                        {'name': $translate.instant('REPORTING.ORDER_LINE_STATUS'), 'field': 'lineStatus', minWidth: 210},
                        {'name': $translate.instant('REPORTING.ORDER_NUMBER'), 'field': 'orderNumber', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ORDER_TYPE'), 'field': 'orderType', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ORDERED_AS'), 'field': 'orderedAs', minWidth: 150},
                        {'name': $translate.instant('REPORTING.ORDERED_PRODUCT'), 'field': 'orderedProduct', minWidth: 150},
                        {'name': $translate.instant('REPORTING.PARENT_CONFIG_ID'), 'field': 'parentConfigId', minWidth: 150},
                        {'name': $translate.instant('REPORTING.PAYMENT_METHOD'), 'field': 'paymentMethod', minWidth: 210},
                        {'name': $translate.instant('REPORTING.PRODUCT'), 'field': 'product', minWidth: 150},
                        {'name': $translate.instant('REPORTING.PRODUCT_DESCRIPTION'), 'field': 'productDescription', minWidth: 210},
                        {'name': $translate.instant('REPORTING.PROJECT'), 'field': 'project', minWidth: 150},
                        {'name': $translate.instant('REPORTING.PROJECT_PHASE'), 'field': 'projectPhase', minWidth: 150},
                        {'name': $translate.instant('REPORTING.QUANTITY_REQUESTED'), 'field': 'qtyRequested', minWidth: 210},
                        {'name': $translate.instant('REPORTING.REQUESTED_SHIP_DATE'), 'field': 'requestedShipDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 210},
                        {'name': $translate.instant('REPORTING.SAP_CONTRACT_NUMBER'), 'field': 'sapContractNumber', minWidth: 210},
                        {'name': $translate.instant('REPORTING.SERIAL_NUMBER'), 'field': 'serialNumber', minWidth: 150},
                        {'name': $translate.instant('REPORTING.SERVICE_ADDRESS'), 'field': 'serviceAddress', minWidth: 150},
                        {'name': $translate.instant('REPORTING.SHIPMENT_METHOD'), 'field': 'shipmentMethod', minWidth: 210},
                        {'name': $translate.instant('REPORTING.SHIPPED_DATE'), 'field': 'shippedDate', 'cellFilter': 'date:\'yyyy-MM-dd\'', minWidth: 150},
                        {'name': $translate.instant('REPORTING.SHIPPING_METHOD'), 'field': 'shippingMethod', minWidth: 210},
                        {'name': $translate.instant('REPORTING.SOLD_TO_NUMBER'), 'field': 'soldToNumber', minWidth: 150},
                        {'name': $translate.instant('REPORTING.SOLUTION_LINE_NUMBER'), 'field': 'solutionLineNumber', minWidth: 210},
                        {'name': $translate.instant('REPORTING.SOURCE_LOCATION'), 'field': 'sourceLocation', minWidth: 150},
                        {'name': $translate.instant('REPORTING.SR_CONTACT_EMAIL_ADDRESS'), 'field': 'srContactEmail', minWidth: 240},
                        {'name': $translate.instant('REPORTING.SR_CONTACT_NAME'), 'field': 'srContactName', minWidth: 210},
                        {'name': $translate.instant('REPORTING.SR_CONTACT_WORK_PHONE_NUMBER'), 'field': 'srContactPhoneNumber', minWidth: 270},
                        {'name': $translate.instant('REPORTING.SR_NUMBER'), 'field': 'srNumber', minWidth: 150},
                        {'name': $translate.instant('REPORTING.SR_TYPE'), 'field': 'srType', minWidth: 150},
                        {'name': $translate.instant('REPORTING.SUB_AREA'), 'field': 'srSubArea', minWidth: 150},
                        {'name': $translate.instant('REPORTING.TRACKING_NUMBER'), 'field': 'trackingNumber', minWidth: 180},
                        {'name': $translate.instant('REPORTING.WHITE_GLOVE'), 'field': 'whiteGlove', minWidth: 150}
                    ],
                    /* Pages Billed */
                    pb0001: [],
                    /* Hardware Installation Requests */
                    hw0015: [],
                    /* Service Detail Report */
                    sd0101: []
                },    
                route: '/reporting',
                finder: {
                    dateFrom: '',
                    dateTo: '',
                    eventType: '',
                    eventTypes: [{value: 'Installs'}, {value: 'MC'}, {value: 'Remove - Account'}, {value: 'Manual Swaps'}]
                }
            };

            return new HATEOASFactory(Report);
        }
    ]);
});
