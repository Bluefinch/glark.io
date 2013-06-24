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

.controller('WorkspacesController', ['$scope', '$modal', 'editor', 'workspaces', 'filesystem', 'collaboration',
    function ($scope, $modal, editor, workspaces, filesystem, collaboration) {
        $scope.workspaces = workspaces;
        $scope.editor = editor;

        $scope.collaboration = collaboration;

        $scope.addLocalWorkspace = function () {
            var workspace = workspaces.createLocalWorkspace('Local');
            workspaces.setActiveWorkspace(workspace);
        };

        $scope.addRemoteWorkspace = function () {
            /* Open a modal using the $modal service. */
            $modal({
                template: 'public/partials/addConnectorModal.html',
                show: true,
                backdrop: 'static',
                scope: $scope
            });
        };

        $scope.saveConnectorParameters = function (params, callback) {
            var workspace = workspaces.createRemoteWorkspace('Remote', params);
            workspaces.setActiveWorkspace(workspace);

            callback();
        };

        $scope.setActiveWorkspace = function (workspace) {
            workspaces.setActiveWorkspace(workspace);
        };

        $scope.isActiveWorkspace = function (workspace) {
            return workspaces.getActiveWorkspace() === workspace;
        };

        $scope.openDroppedFiles = function (event, directory) {
            var dataTransfer = event.originalEvent.dataTransfer;
            var entries = filesystem.getEntriesFromDataTransfer(dataTransfer);
            angular.forEach(entries, function (entry) {
                directory.addEntry(entry);
            });
        };

        $scope.toggleCollapsed = function (directory) {
            directory.collapsed = !directory.collapsed;
            if (!directory.collapsed) {
                directory.updateChildren();
            }
        };
    }
]);
