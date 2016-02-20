define(['angular', 'translation', 'hateoasFactory.serviceFactory', 'utility.formatters'], function(angular) {
    'use strict';
    angular.module('mps.translation')
    .factory('Translations', ['adminUrl', '$translate', 'HATEOASFactory', 'FormatterService',
        function(adminUrl, $translate, HATEOASFactory, formatter) {
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
