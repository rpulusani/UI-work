



 angular.module('mps.nav')
.factory('Nav', ['$http', 'filterFilter', 'NavItem',
    function($http, filter, Item) {

        var Nav = function() {
            var self = this;
            self.items = [];
            self.tags = [];
        };

        Nav.prototype.getItemsByTag = function(tag){
            var self = this;

            return filter(self.items, function(value, index, array){
                if(value.tags.indexOf(tag) !== -1){
                    return value;
                }
            });
        };

        Nav.prototype.getTags = function(){
            var self = this;
            var limit = self.items.length;
            var tagCount = 0;

            for(var i=0;i<limit;i++){
                tagCount = self.items[i].tags.length;

                for(var n=0;n<tagCount;n++){
                    if(self.tags.indexOf(self.items[i].tags[n]) === -1){
                        self.tags.push(self.items[i].tags[n]);
                    }
                }
            }
        };

        Nav.prototype.query = function(fn) {
            var self = this;

            $http.get('app/nav/data/navigation.json')
            .success(function(data) {
                var limit = data.length;

                for(var i=0;i<limit;i++){
                    self.items[i] = new Item.init(data[i]);
                }

                if (typeof fn === 'function') {
                    return fn(data);
                }
            })
            .error(function(data){
                NREUM.noticeError(data);
            });
        };

        return new Nav();
    }
]);

