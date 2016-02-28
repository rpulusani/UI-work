# Utilites

* [ImageService] (#ImageService)

## ImageService
A utility to parse the device partNumber and build the URL that maps to the device's image xml. (i.e. http://www.lexmark.com/common/xml/35S/35S0332.xml). Currently the medium image is mapped via the ```getPartMediumImageUrl``` method. If additional image sizes are to be used please add those specific methods to the service.

### Functions

#### parsePartNumber(partNumber)
Returns item of prefix of first 3 characters and full partNumber as number

#### buildUrl(item)
Returns builtUrl of prefix/number/.xml

#### getPartMediumImageUrl(partNumber)
XML parser which Rreturns the xml node for the img with medium src attribute

## Setup

### Installation
Defined as a utility module and included via require. To be used with ```deviceManagement.deviceFactory```. Example of use within ```DeviceInformationController```: 

```js
define(['angular', 'deviceManagement.deviceFactory', 'utility.imageService'], function(angular) {
        
        angular.module('mps.deviceManagement')
        .controller('DeviceInformationController', ['$scope', 'Devices', 'imageService',
        function($scope,Devices, ImageService) {
            if (Devices.item === null) {
                $scope.redirectToList();
            } else {
                $scope.device = Devices.item;

                var image =  ImageService;
                image.getPartMediumImageUrl($scope.device.partNumber).then(function(url){
                    $scope.medImage = url;
                }, function(reason){
                     NREUM.noticeError('Image url was not found reason: ' + reason);
                  });
            }
        }
    ]);
});
```
### HTML 

```html
<img ng-src="{{medImage}}" ng-show="medImage" alt="{{ 'MESSAGE.NO_IMAGE_FOUND' | translate }}" />
```
