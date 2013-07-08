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

.factory('collaboration', ['$rootScope', '$modal', 'DiffMatchPatch', 'socket', 'editor', 'workspaces',
    function ($rootScope, $modal, DiffMatchPatch, socket, editor, workspaces) {

        var $scope = $rootScope.$new(true);

        /* A collaborator object looks like:
         * {
         *   id: 'iuhyfJokKOHJ' // The socket id, set asynchronously.
         *   name: 'toto'
         *   workspaceId: 'fhrpf5458' // The current active workspace id.
         *   filename: 'my/current/file', // The currently edited file.
         *   selection: {start: {row: 12, column: 14}, end: {row: 14, column: 19}}
         * } */
        $scope.me = {
            id: null,
            name: null,
            filename: null,
            selection: null
        };

        $scope.collaborators = [];

        /* Store the text shadow for every edited files.
         * {'filename': shadowString, ... } */
        $scope.shadows = {};

        /* Store the server text for every edited files.
         * {'filename': serverTextString, ... } */
        $scope.serverTexts = {};

        $scope.start = function () {
            /* Open a modal using the $modal service. */
            $modal({
                template: 'public/partials/setUsernameModal.html',
                show: true,
                backdrop: 'static',
                scope: $scope
            });

            $scope.initializeCollaborators();
        };

        /* --------------------------------
         * Private API
         * -------------------------------- */

        /* Set the socket id when its available, asynchronously. */
        socket.onReady(function () {
            $scope.me.id = socket.id;
        });

        $scope.addCollaborator = function (collaborator) {
            $rootScope.$apply(function () {
                $scope.collaborators.push(collaborator);
            });
        };

        $scope.removeCollaboratorById = function (id) {
            angular.forEach($scope.collaborators, function (collaborator) {
                if (collaborator.id === id) {
                    $rootScope.$apply(function () {
                        $scope.collaborators.splice($scope.collaborators.indexOf(collaborator), 1);
                    });
                }
            });
        };

        $scope.initializeCollaborators = function () {
            socket.broadcast('getCollaborators', function (collaborator) {
                $scope.addCollaborator(collaborator);
            });
        };

        /* Notify the other users that we connected when the socket is ready. */
        $scope.notifyConnection = function () {
            socket.onReady(function () {
                socket.broadcast('notifyConnection', $scope.me);
            });
        };

        $scope.sendCollaboratorUpdate = function () {
            socket.broadcast('collaboratorUpdate', $scope.me);
        };

        $scope.onSelectionChange = function () {
            // var dmp = new DiffMatchPatch();
            // dmp.diffAndMakePatch('toto', 'titi', function (patch) {
            // console.log(patch);
            // });


            if (!$rootScope.$$phase) {
                $scope.$apply(function () {
                    $scope.me.selection = editor.getSelection().getRange();
                    $scope.sendCollaboratorUpdate();
                });
            }
        };

        $rootScope.$on('Workspace.activeFileChange', function (event, file) {
            /* Update the currently edited file */
            $scope.me.filename = file.name;

            /* Update the shadow, and create the server text if the file is ours. */
            file.getContent().then(function (content) {
                /* FIXME Manipulate files by some id or at least full path. */
                $scope.shadows[file.name] = content;

                if (!(file.name in $scope.serverTexts) &&
                    workspaces.getWorkspaceById(file.getWorkspaceId()).isSharable()) {
                    $scope.serverTexts[file.name] = content;
                }
            });

            /* Add listeners. */
            // editor.getSelection().on('changeCursor', $scope.onSelectionChange);
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

        socket.on('notifyDisconnection', function (id) {
            $scope.removeCollaboratorById(id);
        });

        socket.on('collaboratorUpdate', function (updatedCollab) {
            angular.forEach($scope.collaborators, function (collaborator) {
                if (collaborator.name === updatedCollab.name) {
                    /* TODO Use id to find collab and also update name here. */
                    $scope.$apply(function () {
                        collaborator.selection = updatedCollab.selection;
                        collaborator.filename = updatedCollab.filename;

                        $scope.$broadcast('collaboratorUpdate', collaborator);
                    });

                    return 1;
                }
            });
        });

        return $scope;
    }
]);
