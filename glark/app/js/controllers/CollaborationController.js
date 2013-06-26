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

angular.module('glark.controllers')

.controller('CollaborationController', ['$scope', 'collaboration', 'editor',
    function ($scope, collaboration, editor) {
        $scope.collaboration = collaboration;

        $scope.collaboration.$on('collaboratorUpdate', function (event, collaborator) {
            if (collaborator.selection !== null) {
                var screenCoordinates = editor.getRenderer()
                    .textToScreenCoordinates(collaborator.selection.start.row,
                                            collaborator.selection.start.column);
                console.log(screenCoordinates);
                /* Update the selection css to the correct position. Should
                 * this go in a directive? */
                angular.element('#collaboration-selection-' + collaborator.name)
                    .css({
                        left: screenCoordinates.pageX,
                        top: screenCoordinates.pageY
                    });
            }
        });

    }
]);
