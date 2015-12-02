define(['angular', 'chartjs', 'chart'], function(angular, ChartJs) {
    'use strict';
    angular.module('mps.chart')
    .controller('ChartController', ['$scope', '$element', '$attrs',
        function(scope, element, attrs) {
            var node = element[0],
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            legend,
            chartData,
            centered,
            chart;

            var chartOptions = {};
            chartOptions.responsive = true;
            chartOptions.maintainAspectRatio = false;

            if  (attrs.showlegend === '' || attrs.showlegend) {
                legend = document.createElement('div');
            }

            node.className = 'text--align-center';

            // move to scope.on and broadcast the event
            scope.$watch('data', function() {
                if (scope.data) {
                    chartData = JSON.parse(scope.data);
                } else {
                    chartData = null;
                }

                // if pie/doughnut has more than one value, display segments
                if (attrs.draw.toLowerCase() === 'piechart' || attrs.draw.toLowerCase() === 'doughnutchart') {
                    if (chartData !== null && chartData.length > 1)
                        chartOptions.segmentShowStroke = true;
                    else
                        chartOptions.segmentShowStroke = false;
                };

                if (chartData !== null) {
                    node.appendChild(canvas);
                    chart = new ChartJs(ctx);

                    switch (attrs.draw.toLowerCase()) {
                        case 'barchart':
                            chart = chart.Bar(chartData, chartOptions);
                            break;
                        case 'piechart':
                            chart = chart.Pie(chartData, chartOptions);
                            break;
                        case 'doughnutchart':
                            chart = chart.Doughnut(chartData, chartOptions);
                            break;
                        default:
                            chart = chart.Bar(chartData, chartOptions);
                    }

                    if (legend) {
                        node.appendChild(legend);
                        legend.innerHTML = chart.generateLegend();
                    }
                }
            }, true);
        }
    ]);
});
