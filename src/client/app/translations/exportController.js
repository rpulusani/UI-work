

angular.module('mps.siebel')
.controller('ExportController', [
    '$scope',
    '$location',
    '$rootScope',
    'Translations',
    function($scope, $location, $rootScope, Translations) {
        $scope.exportedFileLanguage = '';
        $scope.currentCategories = []; // a,b,c,d

        $scope.exportLanguage = function(formData) {
            Translations.exportFile($scope).then(function() {
                //$location.path(Translations.route + '/');
            });
        };

        $scope.selectExportCategory = function(catKey) {
            var i = 0,
            fnd = false;

            if ($scope.currentCategories.length) {
                for (i; i < $scope.currentCategories.length; i += 1) {
                    if ($scope.currentCategories[i] === catKey) {
                        $scope.currentCategories.splice(i, 1)
                        fnd = true;
                    }
                }
            }

            if (!fnd) {
                $scope.currentCategories.push(catKey);
            }
        };

        Translations.getLocales().then(function(res) {
            $scope.languages = res.data.locales;
        });

        $scope.checkUncheckCategory = function(param) {
            $scope.currentCategories = [];
            var allCatCheckBoxes = angular.element("input[type='checkbox']");
            var i = 0;
            var checkBoxId = "";
            
            for (i; i < allCatCheckBoxes.length; i++ ) {
                checkBoxId = allCatCheckBoxes[i].id;
                if(param) {
                    allCatCheckBoxes[i].checked = true;
                    $scope.currentCategories.push(checkBoxId);
                }
                else {
                    allCatCheckBoxes[i].checked = false;
                }                
            }        
        };
    }
]);

