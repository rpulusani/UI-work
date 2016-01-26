define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('imageService', ['$http', '$q',
        function($http, $q) {
            var Image = function(){
                this.url = 'https://www.lexmark.com/common/xml/';
                this.defaultImageUrl = '/etc/resources/img/part_na_color.png';
            },
            $ = require('jquery');


            Image.prototype.parsePartNumber = function(partNumber){
                var item = {
                    prefix: '',
                    number: '',
                };
                if(!partNumber || partNumber.length < 3){
                    return undefined;
                }
                item.prefix = partNumber.substring(0,3);
                item.number = partNumber;
                return item;
            };
            Image.prototype.buildUrl = function(item){
                var self = this,
                builtUrl = self.url;
                if(!item || !item.prefix || !item.number){
                    return undefined;
                }
                return builtUrl + item.prefix + '/' + item.number + '.xml';
            };
            Image.prototype.getPartMediumImageUrl = function(partNumber){
                var self = this,
                item  = self.parsePartNumber(partNumber),
                deferred = $q.defer(),
                url  = self.buildUrl(item),
                medUrl = self.defaultImageUrl;

                if(!url){
                    return medUrl;
                }

               $http({
                    method: 'GET',
                    url: url,
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/xml'
                    },
                    params: {},
                    transformResponse : function(data) {
                        return $.parseXML(data);
                    }
                }).success(function(data, status, headers, config) {
                    if(!data){
                        deferred.resolve(medUrl);
                        return;
                    }

                    var x = data.getElementsByTagName('img');

                    for (var i = 0; i < x.length; i++) {
                        if(x[i].getAttribute('key')==='medium'){
                            if(x[i].getAttribute('src')){
                                medUrl = x[i].getAttribute('src');
                            }
                        }
                    }
                    deferred.resolve(medUrl);
                }).error(function(data, status, headers, config) {
                     NREUM.noticeError('Failed to get imageService xml ' + data);
                     deferred.resolve(self.defaultImageUrl);
                });
                return deferred.promise;
            };
            //http://www.lexmark.com/common/xml/35S/35S0332.xml
            return  new Image();
        }
    ]);
});
