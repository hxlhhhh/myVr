
angular.module('app', []).directive('compileHtml', function ($compile) {
    console.log("编译编译");
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(function () {
                //return scope.$eval(attrs);
             },
            function(html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
});
