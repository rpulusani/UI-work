

angular.module('mps.translation')
.directive('translationFields', function(){
    return {
        restrict: 'A',
        templateUrl : '/app/translations/templates/translation-fields.html'
    };
})
.directive('translationSiebel', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/translations/templates/translation-siebel.html'
    };
})
.directive('translationPortal', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/translations/templates/translation-portal.html'
    };
})
.directive('translationTag', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/translations/templates/translation-tag.html'
    };
})
.directive('translationNotification', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/translations/templates/translation-notification.html'
    };
})
.directive('translationUpdateButtons', function() {
    return {
        restrict: 'A',
        templateUrl: '/app/translations/templates/translation-update-buttons.html'
    };
});

