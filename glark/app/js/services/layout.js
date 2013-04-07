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
            var settings = {
                parent: null,
                defaultWidth: null,
                defaultHeight: null,
                maxWidth: null,
                minWidth: null,
                setWidth: null,
                maxHeight: null,
                minHeight: null,
                setHeight: null
            };
            options = jQuery.extend({}, settings, options);
            
            if(options.setWidth !== null) {
                options.setWidth.bind(this);
            }
            if(options.setHeight !== null) {
                options.setHeight.bind(this);
            }
            
            this.options = options;
            this.name = name;
            this.$el = $element;
        };
        
        LayoutComponent.prototype.propertyValue = function(name) {
            if(this.options[name] !== undefined) {
                return this.options[name];
            } else if(this.options.parent !== undefined) {
                return this.options.parent.propertyValue(name);
            } else {
                return null;
            }
        };
        
        LayoutComponent.prototype.setWidth = function (width) {
            var setWidth = this.propertyValue('setWidth');
            if(setWidth === null) return;
            
            var minWidth = this.propertyValue('minWidth');
            var maxWidth = this.propertyValue('maxWidth');
            if(minWidth !== null && width < minWidth) return;
            if(maxWidth !== null && width > maxWidth) return;
            
            setWidth(width);
        };
        
        LayoutComponent.prototype.setHeight = function (height) {
            var setHeight = this.propertyValue('setHeight');
            if(setHeight === null) return;
            
            var minHeight = this.propertyValue('minHeight');
            var maxHeight = this.propertyValue('maxHeight');
            if(minHeight !== null && height < minHeight) return;
            if(maxHeight !== null && height > maxHeight) return;
            
            setHeight(height);
        };
        
        LayoutComponent.prototype.resetSize = function (height) {
            var defaultWidth = this.propertyValue('defaultWidth');
            if(defaultWidth !== null) {
                this.setWidth(defaultWidth);
            }
            
            var defaultHeight = this.propertyValue('defaultHeight');
            if(defaultHeight !== null) {
                this.setHeight(defaultHeight);
            }
        };
        
        return LayoutComponent;
    })

    /* Helper providing services to manage the layout . */
    .factory('layout', function (LayoutComponent) {
        var layout = {};
        var components = {};
        
        /* Register a new component. */
        layout.registerComponent = function (name, selector, options) {
            var $component = angular.element(selector);
            var component = new LayoutComponent(name, $component, options);
            components[name] = component;
        };

        /* Reset the layout. */
        layout.resetLayout = function () {
            angular.forEach(components, function (component, name) {
                component.resetSize();
            });
        };
        
        /* @param name is the component name. */
        layout.getWidth = function (name) {
            return components[name].$el.width();
        };
        
        /* @param name is the component name. */
        layout.getHeight = function (name) {
            return components[name].$el.height();
        };
        
        /* @param name is the component name. 
         * @param width is in pixel. */
        layout.setWidth = function (name, width) {
            components[name].setWidth(width);
        };
        
        /* @param name is the component name. 
         * @param height is in pixel. */
        layout.setHeight = function (name, height) {
            components[name].setHeight(height);
        };
        
        /* Register default components. */
        layout.registerComponent('left-panel', '#left-panel', {
            defaultWidth: 150,
            minWidth: 50,
            setWidth: function (width) {
                components['left-panel'].$el.css('width', width + 'px');
                components['center-panel'].$el.css('left', width + 'px');
            }
        });
        
        layout.registerComponent('left-panel-top', '#left-panel-top', {
            defaultHeight: 150,
            minHeight: 150,
            setHeight: function (height) {
                components['left-panel-top'].$el.css('height', height + 'px');
                components['left-panel-bottom'].$el.css('top', height + 'px');
            }
        });
        
        layout.registerComponent('left-panel-bottom', '#left-panel-bottom');
        
        layout.registerComponent('center-panel', '#center-panel');
            
        /* Reset the layout at the first access. */
        layout.resetLayout();
        
        return layout;
    });