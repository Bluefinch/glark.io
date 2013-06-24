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

.factory('collaboration', ['$rootScope', 'editor', 'socket', '$modal',
    function ($rootScope, editor, socket, $modal) {

        var $scope = $rootScope.$new(true);

        $scope.me = {
            name: null
        };

        $scope.collaborators = [];

        $scope.start = function () {
            /* Open a modal using the $modal service. */
            $modal({
                template: 'public/partials/setUserNameModal.html',
                show: true,
                backdrop: 'static',
                scope: $scope
            });

            $scope.getCollaborators();
        };

        $scope.addCollaborator = function (collaborator) {
            $rootScope.$apply(function () {
                $scope.collaborators.push(collaborator);
            });
        };

        $scope.getCollaborators = function () {
            socket.broadcast('getCollaborators', function (collaborator) {
                $scope.addCollaborator(collaborator);
            });
        };

        $scope.notifyConnection = function () {
            socket.broadcast('notifyConnection', $scope.me);
        };

        /* --------------------------------
         * Socket API
         * -------------------------------- */

        socket.on('getCollaborators', function (callback) {
            callback($scope.me);
        });

        socket.on('notifyConnection', function (collaborator) {
            $scope.addCollaborator(collaborator);
        });

        return $scope;
    }
]);
