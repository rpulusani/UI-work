define(['angular', 'translation', 'hateoasFactory.serviceFactory', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.translation')
    .factory('Translations', ['adminUrl', '$translate', 'HATEOASFactory', 'FormatterService', '$http',
        function(adminUrl, $translate, HATEOASFactory, formatter, $http) {
            var Translations = {
                    serviceName: 'translations',
                    embeddedName: 'contents', //get away from embedded name and move to a function to convert url name to javascript name
                    columns: 'defaultSet',
                    url: adminUrl + 'translations',
                    columnDefs: {
                        defaultSet: [
                            {'name': 'ID', 'field': 'contentKey', 'notSearchable': true},
                            {'name': $translate.instant('PORTAL_ADMIN.CATEGORY'), 'field': 'contentType', 'notSearchable': true},
                            {'name': $translate.instant('PORTAL_ADMIN.VALUE'), 'field': 'actualValue',
                            'cellTemplate':'<div>' +
                                            '<a href="#" ng-click="grid.appScope.view(row.entity);" ' +
                                            '>{{row.entity.actualValue}}</a>' +
                                        '</div>',
                            'notSearchable': true
                            },
                            {'name': $translate.instant('LANGUAGES.ENGLISH'), 'field': 'EN', 
                             'cellTemplate':'<div ng-bind="row.entity.defaultText"></div>'},
                            {'name': $translate.instant('LANGUAGES.SPANISH'), 'field': 'ES', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'ES\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.GERMAN'), 'field': 'DE', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'DE\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.FRENCH'), 'field': 'FR', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'FR\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.CHINESE_SIMPLIFIED'), 'field': 'ZH_CN', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'ZH_CN\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.CHINESE_TRADITIONAL'), 'field': 'ZH_TW', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'ZH_TW\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.PORTUGUESE_BRAZIL'), 'field': 'PT_BR', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'PT_BR\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.PORTUGUESE_PORTUGAL'), 'field': 'PT_PT', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'PT_PT\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.ITALIAN'), 'field': 'IT', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'IT\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.KOREAN'), 'field': 'KO', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'KO\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.JAPANESE'), 'field': 'JA', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'JA\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.RUSSIAN'), 'field': 'RU', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'RU\')"></div>'},
                            {'name': $translate.instant('LANGUAGES.TURKISH'), 'field': 'TR', 
                             'cellTemplate':'<div ng-bind="row.entity.getTextForLang(\'TR\')"></div>'}
                        ]
                    },
                    exportFile: function(ctrlScope) {
                        var self = this,
                        url = adminUrl + '/localizations/export',
                        fileExt = '.xlf',
                        fileName;

                         if (!ctrlScope.exportFor) {
                            ctrlScope.exportFor === 'review';
                         }
                   
                        if (ctrlScope.exportFor === 'review') {
                            url += '/xls';

                            fileExt = '.xls';

                            if (ctrlScope.stringVal !== 'all') {
                                if (ctrlScope.stringVal && ctrlScope.stringVal === 'missing') {
                                    url += '?missing=' + ctrlScope.exportedFileLanguage;
                                }

                                if (ctrlScope.currentCategories) {
                                    if (url.indexOf('?') !== -1) {
                                        url += '&category=' + ctrlScope.currentCategories.toString();
                                    } else {
                                         url += '?category=' + ctrlScope.currentCategories.toString();
                                    }
                                }
                            }
                        } else {
                            url += '/xliff';
                        }

                        return $http({ 
                            method: 'GET',
                            url: url
                        }).success(function(res) {
                            var anchor = angular.element('<a/>');
                            anchor.css({display: 'none'});
                            angular.element(document.body).append(anchor);
                            
                            if (!ctrlScope.exportedFileLanguage) {
                                ctrlScope.exportedFileLanguage = 'translations'
                            
                            }

                            anchor.attr({
                                 href: 'data:attachment/csv;charset=utf-8,' + encodeURI(res),
                                 target: '_blank',
                                 download: ctrlScope.exportedFileLanguage + fileExt
                             })[0].click();
                        });
                    },
                    importFile: function(language, file) {
                        var self = this,
                        fd = new FormData();

                        fd.append('file', file);
                        // dont think we need $http but using it to mock attachments which works

                        return $http({ 
                            headers: {'Content-Type': undefined},
                            method: 'POST',
                            url: adminUrl + '/localizations/import/' + language,
                            data: fd
                        });
                    },
                    getLocales: function() {
                        var self = this;
                        return self.get({
                            url: adminUrl + '/localizations/locales'
                        });
                    },
                    functionArray: [
                        {
                            name: 'getTextForLang',
                            functionDef: function(lang){
                                var translationList = this.translations;
                                for (var i=0;i<translationList.length;i++) {
                                    if (translationList[i].languageCode === lang) {
                                        return translationList[i].translatedText;
                                    }
                                }
                            }
                        }
                    ],

                    route: '/translations'
            };

        return  new HATEOASFactory(Translations);
    }]);
});
