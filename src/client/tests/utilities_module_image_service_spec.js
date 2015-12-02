define(['angular', 'angular-mocks', 'utility.imageService'], function(angular, mocks, imageService) {
    describe('Image Service Utility Module', function() {
        var imageService, q, httpBackend;
        beforeEach(module('mps'));
        beforeEach(inject(['imageService', '$q','$httpBackend', function(ImageService, $q, $httpBackend){
                imageService =  ImageService;
                q = $q.defer();
                httpBackend = $httpBackend;
                httpBackend.when('GET', 'etc/resources/i18n/en.json').respond({it: 'works'});
                httpBackend.when('GET', 'http://www.lexmark.com/common/xml/abc/abcdef.xml').respond('<xml><product><name>Lexmark MS510dn</name><media><thumbnail src="//media.lexmark.com/www/asset/19/7694/+image_thumbnail.gif"/><img key="icon" src="//media.lexmark.com/www/asset/19/7694/+image_icon.png"/><img key="large" src="//media.lexmark.com/www/asset/19/7694/+image_wide.png"/><img key="medium" src="//media.lexmark.com/www/asset/19/7694/+image_medium.jpg"/></media></product></xml>');
                httpBackend.when('GET', 'http://www.lexmark.com/common/xml/cat/catdog.xml').respond('<xml><product><name>Lexmark MS510dn</name><media><thumbnail src="//media.lexmark.com/www/asset/19/7694/+image_thumbnail.gif"/><image key="icon" src="//media.lexmark.com/www/asset/19/7694/+image_icon.png"/><image key="large" src="//media.lexmark.com/www/asset/19/7694/+image_wide.png"/><image key="medium" src="//media.lexmark.com/www/asset/19/7694/+image_medium.jpg"/></media></product></xml>');
                httpBackend.when('GET', 'http://www.lexmark.com/common/xml/123/123456.xml').respond('<xml><product><name>Lexmark MS510dn</name><media><thumbnail src="//media.lexmark.com/www/asset/19/7694/+image_thumbnail.gif"/><img key="icon" src="//media.lexmark.com/www/asset/19/7694/+image_icon.png"/><img key="large" src="//media.lexmark.com/www/asset/19/7694/+image_wide.png"/></media></product></xml>');
                httpBackend.when('GET', 'http://www.lexmark.com/common/xml/777/777555.xml').respond('<xml><product><name>Lexmark MS510dn</name><media><thumbnail src="//media.lexmark.com/www/asset/19/7694/+image_thumbnail.gif"/><img key="icon" src="//media.lexmark.com/www/asset/19/7694/+image_icon.png"/><img key="large" src="//media.lexmark.com/www/asset/19/7694/+image_wide.png"/><img key="medium"/></media></product></xml>');
                httpBackend.when('GET', 'http://www.lexmark.com/common/xml/111/111111.xml').respond('<xml/>');
        }]));

        describe('parsePartNumber', function(){
            it('should parse the part number into the item object', function(){
                var expected_prefix = 'abc';
                var expected_number = 'abcdef';
                var actual = imageService.parsePartNumber('abcdef');
                expect(expected_prefix).toEqual(actual.prefix);
                expect(expected_number).toEqual(actual.number);
            });
            it('should not parse the part number into the item object if the length is less than 3 characters and return undefined',
             function(){
                var actual = imageService.parsePartNumber('ab');
                expect(undefined).toEqual(actual);
            });
            it('should not parse the part number into the item object since it is undefined and should return undefined', function(){
                var actual = imageService.parsePartNumber(undefined);
                expect(undefined).toEqual(actual);
            });
            it('should not parse the part number into the item object since it is null and should return undefined', function(){
                var actual = imageService.parsePartNumber(null);
                expect(undefined).toEqual(actual);
            });
        });

        describe('buildUrl', function(){
            it('should use the partNumber to build the url', function(){
                var item = {
                    prefix: 'abc',
                    number: 'abcdef',
                };
                var expectedUrl = 'http://www.lexmark.com/common/xml/abc/abcdef.xml';
                var actual = imageService.buildUrl(item);
                expect(expectedUrl).toEqual(actual);
            });
            it('should not use the partNumber to build the url if the data is undefined', function(){
                var item = undefined;
                var expectedUrl = undefined;
                var actual = imageService.buildUrl(item);
                expect(expectedUrl).toEqual(actual);
            });
            it('should not use the partNumber to build the url if the data is null', function(){
                var item = null;
                var expectedUrl = undefined;
                var actual = imageService.buildUrl(item);
                expect(expectedUrl).toEqual(actual);
            });
            it('should not use the partNumber to build the url because item object prefix is not correctly defined', function(){
                var item = {
                    cat: 'abc',
                    number: 'abcdef',
                };
                var expectedUrl = undefined;
                var actual = imageService.buildUrl(item);
                expect(expectedUrl).toEqual(actual);
            });
            it('should not use the partNumber to build the url because item object number is not correctly defined', function(){
                var item = {
                    prefix: 'abc',
                    dog: 'abcdef',
                };
                var expectedUrl = undefined;
                var actual = imageService.buildUrl(item);
                expect(expectedUrl).toEqual(actual);
            });
            it('should not use the partNumber to build the url because item object number is not correctly defined', function(){
                var item = {
                    cat: 'abc',
                    dog: 'abcdef',
                };
                var expectedUrl = undefined;
                var actual = imageService.buildUrl(item);
                expect(expectedUrl).toEqual(actual);
            });
        });

        describe('getPartMediumImageUrl', function(){
            it('should return the part url', function(){
                var expectedUrl = '//media.lexmark.com/www/asset/19/7694/+image_medium.jpg';
                var promise = imageService.getPartMediumImageUrl('abcdef');
                httpBackend.flush();
                var result = spyOn(imageService, 'getPartMediumImageUrl');
                var actual = promise.$$state.value;
                expect(expectedUrl).toEqual(actual);
            });
           it('should not parse the part number into the item object if the length is less than 3 characters and return default image url',
             function(){
                var defaultUrl = '/etc/resources/img/part_na_color.png';
                var actual = imageService.getPartMediumImageUrl('ab');
                expect(defaultUrl).toEqual(actual);
            });
            it('should not parse the part number into the item object since it is undefined and should return default image url', function(){
                var defaultUrl = '/etc/resources/img/part_na_color.png';
                var actual = imageService.getPartMediumImageUrl(undefined);
                expect(defaultUrl).toEqual(actual);
            });
            it('should not parse the part number into the item object since it is null and should return default image url', function(){
                var defaultUrl = '/etc/resources/img/part_na_color.png';
                var actual = imageService.getPartMediumImageUrl(null);
                expect(defaultUrl).toEqual(actual);
            });
            it('should not find the img xml node since it is missing and should return default image url', function(){
                var expectedDefaultUrl = '/etc/resources/img/part_na_color.png';
                var promise = imageService.getPartMediumImageUrl('catdog');
                var result = spyOn(imageService, 'getPartMediumImageUrl');
                httpBackend.flush();
                var actual = promise.$$state.value;
                expect(expectedDefaultUrl).toEqual(actual);
            });
            it('should not find the img xml nodes medium attribute since it is missing and should return default image url', function(){
                var expectedDefaultUrl = '/etc/resources/img/part_na_color.png';
                var promise = imageService.getPartMediumImageUrl('123456');
                var result = spyOn(imageService, 'getPartMediumImageUrl');
                httpBackend.flush();
                var actual = promise.$$state.value;
                expect(expectedDefaultUrl).toEqual(actual);
            });
            it('should not find the img xml nodes medium src attribute since it is missing and should return default image url', function(){
                var expectedDefaultUrl = '/etc/resources/img/part_na_color.png';
                var promise = imageService.getPartMediumImageUrl('777555');
                var result = spyOn(imageService, 'getPartMediumImageUrl');
                httpBackend.flush();
                var actual = promise.$$state.value;
                expect(expectedDefaultUrl).toEqual(actual);
            });
            it('should not return the part url since the xml is malformed and should return default image url', function(){
                var expectedDefaultUrl = '/etc/resources/img/part_na_color.png';
                var promise = imageService.getPartMediumImageUrl('111111');
                httpBackend.flush();
                var result = spyOn(imageService, 'getPartMediumImageUrl');
                var actual = promise.$$state.value;
                expect(expectedDefaultUrl).toEqual(actual);
            });
        });
    });
});
