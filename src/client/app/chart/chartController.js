define(['angular', 'chartjs', 'chart'], function(angular, ChartJs) {
    'use strict';
    angular.module('mps.chart')
    .controller('ChartController', ['$scope', '$element', '$attrs',
        function(scope, element, attrs) {
            var node = element[0],
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            chartName,
            chart;

            if (data2.length > 0) {
                node.appendChild(canvas);
                chart = new ChartJs(ctx);

                switch (attrs.draw.toLowerCase()) {
                    case 'barchart':
                        if (!attrs.chartname) {
                            attrs.chartname = 'bardata';
                        }

                        if (scope[attrs.chartname]) {
                            chart.Bar(scope[attrs.chartname], {
                                barShowStroke: false
                            });
                        }
                        break;
                    case 'piechart':
                        if (!attrs.chartname) {
                            attrs.chartname = 'piedata';
                        }

                        if (scope[attrs.chartname]) {
                            chart.Bar(scope[attrs.chartname], {
                                barShowStroke: false
                            });
                        }
                        break;
                    case 'doughnutchart':
                        if (!attrs.chartname) {
                            attrs.chartname = 'doughnutdata';
                        }

                        if (scope[attrs.chartname]) {
                            chart.Bar(scope[attrs.chartname], {
                                barShowStroke: false
                            });
                        }
                        break;
                    default: chart.Bar(bardata);
                }
            }
        }
    ]);
});
