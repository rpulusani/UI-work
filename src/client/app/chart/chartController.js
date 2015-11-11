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
            chartOptions,
            chart;

            if  (attrs.showlegend === '' || attrs.showlegend) {
                legend = document.createElement('div');
            }

            if  (attrs.centered !== 'false') {
                node.style.textAlign = 'center';
                node.style.verticalAlign = 'middle';
                node.style.margin = '0  auto';
            }

            // move to scope.on and broadcast the event
            scope.$watch('data', function() {
                if (scope.data) {
                    chartData = JSON.parse(scope.data);
                } else {
                    chartData = null;
                }

                if (scope.options) {
                    chartOptions = JSON.parse(scope.options);
                } else {
                    chartOptions = {};
                }

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
                        default: chart = chart.Bar(chartData, chartOptions);
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
