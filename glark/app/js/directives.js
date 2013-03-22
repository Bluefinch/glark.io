'use strict';

/* Directives */

/* This makes any element dropZone. It should be used
 * with the ngModel directive.
 * Exemple:
 * <div ng-model="myDroppedFile" drop-zone="onDrop()"></div>
 */
angular.module('glark.directives', [])
    .directive('dropZone', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('drop', function (e) {
                    e.preventDefault();

                    var droppedFiles = e.originalEvent.dataTransfer.files;
                    var model = attrs.ngModel;
                    scope[model] = droppedFiles;
                    scope.$apply(attrs.dropZone);

                    return false;
                });
            }
        };
    });
