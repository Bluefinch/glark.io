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

.factory('editor', ['$rootScope', 'EditSession', 'ace',
    function ($rootScope, EditSession, ace) {
        ace.setTheme("ace/theme/glarkio_black");

        angular.element('.ace_gutter').css('background', 'rgb(22, 22, 22)');
        angular.element('.ace_scroller').css('background', 'rgb(23, 23, 23)');

        return {
            focus: function () {
                setTimeout(function () {
                    ace.focus();
                }, 0);
            },

            setSession: function (session) {
                session.setFoldStyle('markbegin');

                ace.setSession(session);
                ace.setReadOnly(false);
            },

            clearSession: function () {
                ace.setSession(new EditSession(''));
                ace.setReadOnly(true);
            },

            goToLine: function (lineNumber) {
                ace.gotoLine(lineNumber);
            },

            find: function (value) {
                return ace.find(value);
            },

            findNext: function () {
                return ace.findNext();
            },

            findPrevious: function () {
                return ace.findPrevious();
            },

            previewFile: function (file) {
                if (file.session !== undefined) {
                    this.setSession(file.session);
                }
            },

            getBackgroundColor: function () {
                return angular.element('.ace_scroller').css('background-color');
            },

            getSelection: function () {
                return ace.getSelection();
            },

            getRenderer: function () {
                return ace.renderer;
            }
        };
    }
]);
