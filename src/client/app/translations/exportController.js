

angular.module('mps.siebel')
.controller('ExportController', [
    '$scope',
    '$location',
    '$rootScope',
    'Translations',
    '$route',
    function($scope, $location, $rootScope, Translations, $route) {
        $scope.exportedFileLanguage = '';
        $scope.currentCategories = []; // a,b,c,d
        $scope.isLoading=false;

        $scope.exportLanguage = function(formData) {
            $scope.isLoading=true;
            Translations.exportFile($scope).then(function() {
                $scope.isLoading=false;
                //$location.path(Translations.route + '/');
               $route.reload();
            });
        };

        $scope.selectExportCategory = function(catKey) {
            var i = 0,
            fnd = false;

            catKey = catKey.replace(/ /g, '_');

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
                    $scope.currentCategories.push(checkBoxId.replace(/ /g, '_'));
                }
                else {
                    allCatCheckBoxes[i].checked = false;
                }                
            }        
        };
    }
]);

