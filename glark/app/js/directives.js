/* Copyright 2013 Florent Galland & Luc Verdier

This file is part of glark.io.

glark.io is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
at your option) any later version.

glark.io is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with glark.io.  If not, see <http://www.gnu.org/licenses/>. */
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

                    var dataTransfer = e.originalEvent.dataTransfer;
                    var model = attrs.ngModel;
                    scope[model] = dataTransfer;
                    scope.$apply(attrs.dropZone);

                    return false;
                });
            }
        };
    })
    
    .directive('layoutLeftSlider', function (layout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var component = attrs.layoutLeftSlider;
                
                element.css('cursor', 'w-resize');
                element.mousedown(function (e) {
                    e.preventDefault();
                    
                    var initialWidth = layout.getWidth(component);
                    var initialPageX = e.pageX;
                    
                    var onmousemove = function(event) {
                        var deltaX = initialPageX - event.pageX;
                        var newWidth = initialWidth - deltaX;
                        layout.setWidth(component, newWidth);
                    };
                    
                    var $html = angular.element('html');
                    $html.mousemove(onmousemove);
                    $html.mouseup(function() {
                        $html.unbind('mousemove', onmousemove);
                    });
                });
            }
        };
    });
