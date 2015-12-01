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
                // DONE use the test cases for partNumber for undefined, null, less 3 characters


                var self = this,
                item  = self.parsePartNumber(partNumber),
                deferred = $q.defer(),
                url  = self.buildUrl(item),
                defaultImageUrl = '/etc/resources/img/part_na_color.png';

                // DONE what do you do here if url is undefined???
                if(!url){
                    return defaultImageUrl;
                }
                //console.log(url);
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
                    // TODO what if the xml is bad?

                    var medUrl = defaultImageUrl; //<--- DONE set default url here
                    var x = data.getElementsByTagName('img');
                    for (var i = 0; i < x.length; i++) {
                    // DONE what if its missing medium?
                        if(x[i].getAttribute('key')==='medium'){
                            // DONE what happens if src does not exist?
                            if(x[i].getAttribute('src')){
                                medUrl = x[i].getAttribute('src');
                            }
                        }
                    }
                    //console.log(medUrl);
                    // DONE if medUrl is not found should we should return default image
                    deferred.resolve(medUrl);
                }).error(function(data, status, headers, config) {
                     // capture the error and resolve to default image url
                     // how do we do this? NREUM.noticeError('Failed to get imageService xml ' + data);
                     deferred.resolve(defaultImageUrl);
                     //deferred.reject(data);
                });

                return deferred.promise;
            };
            //http://www.lexmark.com/common/xml/35S/35S0332.xml
            return  new Image();
        }
    ]);
});
