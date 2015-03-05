angular.module('components', [])
  .directive('pageslider', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: function () {

      },
      template:
        '<div class="pageslider">' +
          '<ul class="page-menu">' + 
            '<li ng-repeat="page in pages" ng-class={active: page.selected}' +
              '<a href="" ng-click="select(page)">' + 
                '{{page.title}}' + 
              '</a>' + 
            '</li>' +
          '</ul>' + 
          '<div class="page-content" ng-transclude>' + 
          '</div>' + 
        '</div>',

        replace: true 

    };
  })