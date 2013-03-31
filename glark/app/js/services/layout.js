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

angular.module('glark.services')

    .factory('LayoutComponent', function () {
        var LayoutComponent = function (name, $element, options) {
            this.name = name;
            this.$el = $element;
        };
        
        return LayoutComponent;
    }

    /* Helper providing services to manage the layout . */
    .factory('layout', function () {
        var layout = {};
        
        var components = {};
        var styles = {};
        var resizes = {};
        
        /* Register a new component. */
        layout.registerComponent = function (name, selector, style, resizeWidth, resizeHeight) {
            var $component = angular.element(selector);
            $component.css(style);
            
            components[name] = $component;
            styles[name] = style;
            
            resizes[name] = {};
            if(resizeWidth !== undefined) {
                resizes[name].width = resizeWidth;
            }
            else {
                resizes[name].width = function () {};
            }
            
            if(resizeHeight !== undefined) {
                resizes[name].height = resizeHeight;
            }
            else {
                resizes[name].height = function () {};
            }
        };

        /* Reset the layout. */
        layout.resetLayout = function () {
            angular.forEach(components, function ($component, name) {
                $component.css(styles[name]);
            });
        };
        
        /* @param name is the component name. */
        layout.getWidth = function (name) {
            return components[name].width();
        };
        
        /* @param name is the component name. 
         * @param width is in pixel. */
        layout.setWidth = function (name, width) {
            resizes[name].width(width);
        };
        
        /* Register default components. */
        layout.registerComponent('editor', '#editor', {
            top: '35px',
            bottom: '0',
            left: '150px',
            right: '0'
        });
        
        layout.registerComponent('top-bar', '#editor-top-bar', {
            top: '0',
            height: '35px',
            left: '150px',
            right: '0'
        });
        
        layout.registerComponent('left-bar', '#editor-left-bar', {
            top: '0',
            bottom: '0',
            left: '0',
            width: '150px'
        }, function (width) {
            if(width<50) return;
            components['editor'].css('left', width + 'px');
            components['top-bar'].css('left', width + 'px');
            components['left-bar'].css('width', width + 'px');
        });
        
        /* Reset the layout at the first access. */
        layout.resetLayout();
        
        return layout;
    });