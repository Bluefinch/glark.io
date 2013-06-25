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

.factory('Collaborator', ['$rootScope',
    function ($rootScope) {
        return function () {
            var $scope = $rootScope.$new();

            $scope.name = null;
            $scope.filename = null;

            /* The selection is an object like:
             * {start: {row: 12, column: 14}, end: {row: 14, column: 19}} */
            $scope.selection = null;

            $scope.toJSON = function () {
                return {
                    name: this.name,
                    filename: this.filename,
                    selection: this.selection
                };
            };

            $scope.fromJSON = function (json) {
                this.name = json.name;
                this.filename = json.filename;
                this.selection = json.selection;
            };

            return $scope;
        };
    }
])

.factory('collaboration', ['$rootScope', 'socket', '$modal', 'Collaborator', 'editor',
    function ($rootScope, socket, $modal, Collaborator, editor) {

        var $scope = $rootScope.$new(true);

        $scope.me = new Collaborator();

        $scope.collaborators = [];

        $scope.start = function () {
            /* Open a modal using the $modal service. */
            $modal({
                template: 'public/partials/setUserNameModal.html',
                show: true,
                backdrop: 'static',
                scope: $scope
            });

            $scope.initializeCollaborators();
        };

        /* --------------------------------
         * Private API
         * -------------------------------- */

        $scope.me.$watch('selection', function (selection) {
            $scope.sendCollaboratorUpdate();
        });

        $scope.addCollaborator = function (collaboratorJSON) {
            $rootScope.$apply(function () {
                var collaborator = new Collaborator();
                collaborator.fromJSON(collaboratorJSON);
                $scope.collaborators.push(collaborator);
            });
        };

        $scope.initializeCollaborators = function () {
            socket.broadcast('getCollaborators', function (collaboratorJSON) {
                $scope.addCollaborator(collaboratorJSON);
            });
        };

        $scope.notifyConnection = function () {
            socket.broadcast('notifyConnection', $scope.me);
        };

        $scope.sendCollaboratorUpdate = function () {
            socket.broadcast('sendCollaboratorUpdate', $scope.me);
        };

        $scope.onSelectionChange = function () {
            if (!$rootScope.$$phase) {
                $scope.$apply(function () {
                    $scope.me.selection = JSON.stringify(editor.getSelection().getRange());
                });
            }
        };

        $rootScope.$on('Workspace.activeFileChange', function (event, file) {
            $scope.me.filename = file.name;
            editor.getSelection().on('changeCursor', $scope.onSelectionChange);
            editor.getSelection().on('changeSelection', $scope.onSelectionChange);
            $scope.sendCollaboratorUpdate();
        });

        /* --------------------------------
         * Socket API
         * -------------------------------- */

        socket.on('getCollaborators', function (callback) {
            callback($scope.me);
        });

        socket.on('notifyConnection', function (collaborator) {
            $scope.addCollaborator(collaborator);
        });

        socket.on('sendCollaboratorUpdate', function (updatedCollab) {
            angular.forEach($scope.collaborators, function (collaborator) {
                if (collaborator.name === updatedCollab.name) {
                    collaborator.fromJSON(updatedCollab);
                    return 1;
                }
            });
        });

        return $scope;
    }
]);
