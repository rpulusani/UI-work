define(['angular', 'raphael', 'raphael-pie-chart', 'chart'], function(angular) {
    'use strict';
    angular.module('mps.chart')
    .controller('ChartController', ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
            var node = $element[0],
            r = Raphael(node),
            radius = 120, // default radius
            xpos = node.clientWidth / 2 - radius,
            ypos = node.clientHeight / 2;

            if ($attrs.radius) {
                radius = $attrs.radius;
            }

            if ($attrs.xpos) {
                xpos = $attrs.xpos;
            }

            if ($attrs.ypos) {
                ypos = $attrs.ypos;
            }

            if ($attrs.draw.indexOf('pie') !== -1) {
                r.piechart(
                    xpos,
                    ypos,
                    radius,
                    [55, 20, 13, 32, 5, 1, 2]
                );
            }
        }
    ]);
});
