


angular.module('tree', [])
.config(['$routeProvider',
    function ($routeProvider){
        $routeProvider
        .when('/tree-example', {
            templateUrl: '/app/tree/view/tree-example.html'
        });
    }
]);
