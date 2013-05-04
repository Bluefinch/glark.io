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

            if (options.setWidth !== null) {
                options.setWidth.bind(this);
            }
            if (options.setHeight !== null) {
                options.setHeight.bind(this);
            }

            this.options = options;
            this.name = name;
            this.$el = $element;
        };

        LayoutComponent.prototype.setWidth = function (width) {
            var options = this.options;

            if (options.setWidth === null) { return; }
            if (options.minWidth !== null && width < options.minWidth) { return; }
            if (options.maxWidth !== null && width > options.maxWidth) { return; }

            options.setWidth(width);
        };

        LayoutComponent.prototype.setHeight = function (height) {
            var options = this.options;

            if (options.setHeight === null) { return; }
            if (options.minHeight !== null && height < options.minHeight) { return; }
            if (options.maxHeight !== null && height > options.maxHeight) { return; }

            options.setHeight(height);
        };

        LayoutComponent.prototype.resetSize = function () {
            var options = this.options;

            if (options.defaultWidth !== null) {
                this.setWidth(options.defaultWidth);
            }
            if (options.defaultHeight !== null) {
                this.setHeight(options.defaultHeight);
            }
        };

        return LayoutComponent;
    })

    /* Helper providing services to manage the layout . */
    .factory('layout', ['LayoutComponent', function (LayoutComponent) {
        var layout = {};

        /* List of registered components. */
        layout.components = {};

        /* Register a new component. */
        layout.registerComponent = function (name, selector, options) {
            var $component = angular.element(selector);
            var component = new LayoutComponent(name, $component, options);
            this.components[name] = component;
        };

        /* Reset the layout. */
        layout.resetLayout = function () {
            var components = this.components;
            angular.forEach(components, function (component) {
                component.resetSize();
            });
        };

        /* @param name is the component name. */
        layout.getWidth = function (name) {
            return this.components[name].$el.width();
        };

        /* @param name is the component name. */
        layout.getHeight = function (name) {
            return this.components[name].$el.height();
        };

        /* @param name is the component name.
         * @param width is in pixel. */
        layout.setWidth = function (name, width) {
            this.components[name].setWidth(width);
        };

        /* @param name is the component name.
         * @param height is in pixel. */
        layout.setHeight = function (name, height) {
            this.components[name].setHeight(height);
        };

        /* Register default components. */
        layout.registerComponent('left-panel', '#left-panel', {
            defaultWidth: 150,
            minWidth: 50,
            setWidth: function (width) {
                layout.components['left-panel'].$el.css('width', width + 'px');
                layout.components['center-panel'].$el.css('left', width + 'px');
            }
        });

        layout.registerComponent('center-panel', '#center-panel');

        /* Reset the layout at the first access. */
        //layout.resetLayout();

        return layout;
    }]);
