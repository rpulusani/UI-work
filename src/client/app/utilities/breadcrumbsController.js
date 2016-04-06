angular.module('mps.utility')
.controller('BreadcrumbsController', ['$scope', '$element', '$attrs', '$translate',
    function(scope, element, attrs, translate) {
        'use strict';

        var node = element[0],
        bcUl = angular.element('<ul class="breadcrumb"></ul>'),
        // default map
        map = {
            1: {
                href: '#parent',
                value: 'Parent'
            },
            2: {
                href: '#child',
                value: 'Child'
            }
        },
        link,
        linkProfile,
        mapCnt = 2,
        cnt = 0; // compared to mapCnt when iterationg through the map object

        if (scope.map) {
            map = scope.map;

            mapCnt = 0;

            for (linkProfile in map) {
                mapCnt += 1;
            }
        }

        // false map means do not display breadcrumbs
        if (scope.map !== false) {
            link = angular.element('<a href="/">' + translate.instant('DASHBOARD.TITLE') + '</a> > ');

            bcUl.append(angular.element('<li></li>')).append(link);

            for (linkProfile in map) {
                cnt += 1;

                linkProfile = map[linkProfile];

                if (cnt != mapCnt) {
                    link = angular.element('<a href="' + linkProfile.href + '"> ' + translate.instant(linkProfile.value) + '</a> > ');
                } else {
                    link = angular.element('<span> ' + translate.instant(linkProfile.value) + '</span>');
                }

                bcUl.append(angular.element('<li></li>')).append(link);
            }

            element.append(bcUl);
        }

    }
]);
