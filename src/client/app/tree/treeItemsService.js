angular.module('mps.tree')
.factory('TreeItems', ['$http',
    function($http){
        var Items = function(){
            var self = this;
            this.data = null;
            this.dataUrl = '/app/tree/data/treeMock.json';
        };

        Items.prototype.query = function(fn){
            var self = this;

            return $http.get(self.dataUrl).success(function(data){
                self.data = data;

                if(typeof fn === 'function'){
                    return fn(data);
                }
            });
        };

        return new Items();
    }
]);

