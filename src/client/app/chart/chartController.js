define(['angular', 'chartjs', 'chart'], function(angular, Chart) {
    'use strict';
    angular.module('mps.chart')
    .controller('ChartController', ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
                console.log(Chart);
            /*
            var data = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
]

            var visual = new Chart($element[0]).Pie(data);

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
            */
        }
    ]);
});
