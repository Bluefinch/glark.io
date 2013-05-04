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

angular.module('glark.directives')

    .directive('layoutTopSlider', ['layout', function (layout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var component = attrs.layoutTopSlider;

                element.css('cursor', 'n-resize');
                element.mousedown(function (e) {
                    e.preventDefault();

                    var initialHeight = layout.getHeight(component);
                    var initialPageY = e.pageY;

                    var onmousemove = function (event) {
                        var deltaY = initialPageY - event.pageY;
                        var newHeight = initialHeight - deltaY;
                        layout.setHeight(component, newHeight);
                    };

                    var $html = angular.element('html');
                    $html.mousemove(onmousemove);
                    $html.mouseup(function () {
                        $html.unbind('mousemove', onmousemove);
                    });
                });
            }
        };
    }]);
