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
                                        '</div>'
                            
                            },
                            {'name': $translate.instant('LANGUAGES.ENGLISH'), 'field': 'defaultText', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.SPANISH'), 'field': 'getTextForLang("ES")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.GERMAN'), 'field': 'getTextForLang("DE")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.FRENCH'), 'field': 'getTextForLang("FR")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.CHINESE_SIMPLIFIED'), 'field': 'getTextForLang("ZH_CN")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.CHINESE_TRADITIONAL'), 'field': 'getTextForLang("ZH_TW")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.PORTUGUESE_BRAZIL'), 'field': 'getTextForLang("PT_BR")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.PORTUGUESE_PORTUGAL'), 'field': 'getTextForLang("PT_PT")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.ITALIAN'), 'field': 'getTextForLang("IT")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.KOREAN'), 'field': 'getTextForLang("KO")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.JAPANESE'), 'field': 'getTextForLang("JA")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.RUSSIAN'), 'field': 'getTextForLang("RU")', 'notSearchable': true},
                            {'name': $translate.instant('LANGUAGES.TURKISH'), 'field': 'getTextForLang("TR")', 'notSearchable': true}
                        ]
                    },
                    exportFile: function(ctrlScope) {
                        var self = this,
                        url = adminUrl + '/localizations/export',
                        fileExt = '.xliff.xml',
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
                                 href: 'data:attachment/csv;charset=utf-8,' + encodeURI(res.data),
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
