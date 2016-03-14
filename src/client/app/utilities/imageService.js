

angular.module('mps.utility')
.factory('imageService', ['$http', '$q',
    function($http, $q) {
        var Image = function(){
            this.url = 'https://www.lexmark.com/common/xml/';
            this.defaultImageUrl = '/etc/resources/img/part_na_color.png';
            this.defaultThumbnailUrl = '';
        };
        var $ = require('jquery');
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

        Image.prototype.getPartThumbnailImageUrl = function(partNumber){
            var self = this,
            item  = self.parsePartNumber(partNumber),
            deferred = $q.defer(),
            url  = self.buildUrl(item),
            thumbnail = self.defaultImageUrl;

            if(!url){
                return thumbnail;
            }
             $http({
                 method: 'GET',
                 url: url,
                 timeout: 10000,
                 headers: {
                     'Content-Type': 'application/xml'
                 },
                 params: {}
            }).success(function(data, status, headers, config) {
                if(!data){
                    deferred.resolve(thumbnail);
                    return;
                } else {
                    data = $.parseXML(data);
                }

                var x = data.getElementsByTagName('thumbnail');

                if(x  && x.length > 0 && x[0].getAttribute('src')){
                    thumbnail = x[0].getAttribute('src');
                    deferred.resolve(thumbnail);
                }else{
                    deferred.resolve(self.defaultThumbnailUrl);
                }

            }).error(function(data, status, headers, config) {
                 NREUM.noticeError('Failed to get imageService xml ' + data);
                 deferred.resolve(self.defaultThumbnailUrl);
            });
            return deferred.promise;
        };
         Image.prototype.getPartStandardImageUrl = function(partNumber){
            var self = this,
            item  = self.parsePartNumber(partNumber),
            deferred = $q.defer(),
            url  = self.buildUrl(item),
            standardUrl = self.defaultImageUrl;

            if(!url){
                return standardUrl;
            }

           $http({
                 method: 'GET',
                 url: url,
                 timeout: 10000,
                 headers: {
                     'Content-Type': 'application/xml'
                 },
                 params: {}
            }).success(function(data, status, headers, config) {
                if(!data){
                    deferred.resolve(standardUrl);
                    return;
                } else {
                    data = $.parseXML(data);
                }

                var x = data.getElementsByTagName('img');

                for (var i = 0; i < x.length; i++) {
                    if(x[i].getAttribute('key')==='standard'){
                        if(x[i].getAttribute('src')){
                            standardUrl = x[i].getAttribute('src');
                        }
                    }
                }
                deferred.resolve(standardUrl);
            }).error(function(data, status, headers, config) {
                 NREUM.noticeError('Failed to get imageService xml ' + data);
                 deferred.resolve(self.defaultImageUrl);
            });
            return deferred.promise;
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
        return  new Image();
    }
]);

