define(['angular', 'chartjs', 'chart'], function(angular, ChartJs) {
    'use strict';
    angular.module('mps.chart')
    .controller('ChartController', ['$scope', '$element', '$attrs',
        function($scope, $element, $attrs) {
            var node = $element[0],
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            data = [
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
            ],
            chart;

            if (data.length > 0) {
                node.appendChild(canvas);
                chart = new ChartJs(ctx);

                console.log($attrs.draw.toLowerCase())

                switch ($attrs.draw.toLowerCase()) {
                    case 'piechart':
                        chart.Pie(data);
                        break;
                    case 'doughnutchart':
                        chart.Doughnut(data);
                        break;
                    case 'barchart':
                        chart.Bar(data);
                        break;
                    default: chart.Bar(data);
                }
            }
        }
    ]);
});
