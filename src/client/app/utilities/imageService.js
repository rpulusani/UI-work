define(['angular', 'utility'], function(angular) {
    'use strict';
    angular.module('mps.utility')
    .factory('imageService', ['$http', '$q',
        function($http, $q) {
            var Image = function(){
                this.url = 'http://www.lexmark.com/common/xml/';
            };

            Image.prototype.parsePartNumber = function(partNumber){
                var item = {
                    prefix: '',
                    number: '',
                };
                item.prefix = partNumber.substring(0,3);
                item.number = partNumber;
                return item;
            };
            Image.prototype.buildUrl = function(item){
                var self = this,
                builtUrl = self.url;
                return builtUrl + item.prefix + '/' + item.number + '.xml';
            };
            Image.prototype.getPartMediumImageUrl = function(partNumber){
                var self = this,
                item  = self.parsePartNumber(partNumber),
                deferred = $q.defer();
                var url  = self.buildUrl(item);
               /* var str= '<xml version=\'1.0\'><name>jQuery By Example</name></xml>';
                $('h1').html($Name);*/

                $http({
                     method: 'GET',
                     url: url,
                     timeout: 10000,
                     headers: {
                         'Content-Type': 'application/xml'
                     },
                     params: {},
                     transformResponse : function(data) {
                        // string -> XML document object
                        return $.parseXML(data);
                     }
                }).success(function(data, status, headers, config) {
                    console.log(data);  // XML document object
                    deferred.resolve(data);
                }).error(function(data, status, headers, config) {
                     alert('issue found: ' + data);
                     deferred.reject(data);
                });

                return deferred.promise;
            };
            Image.prototype.getPartSmallImageUrl = function(partNumber){
                var self = this,
                item  = self.parsePartNumber(partNumber);
            };
            //http://www.lexmark.com/common/xml/35S/35S0332.xml
            return  Image;
        }
    ]);
});