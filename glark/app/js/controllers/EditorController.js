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

    .controller('EditorController', function ($scope, workspaces, filesystem) {

        $scope.openDroppedFiles = function (event) {
            var dataTransfer = event.originalEvent.dataTransfer;
            var entries = filesystem.getEntriesFromDataTransfer(dataTransfer);

            if (entries.length === 1 && entries[0].isDirectory) {
                /* If only one directory was dropped, create and active a new
                 * Workspace. */
                var newWorkspace = workspaces.createLocalWorkspace(entries[0].name, entries[0]);
                workspaces.setActiveWorkspace(newWorkspace);
            } else {
                angular.forEach(entries, function (entry) {
                    workspaces.getActiveWorkspace().addEntry(entry);
                    if (entry.isFile) {
                        workspaces.getActiveWorkspace().setActiveFile(entry);
                    }
                });
            }
        };

        $scope.$on('save', function () {
            var workspace = workspaces.getActiveWorkspace();
            if (workspace !== null) {
                var file = workspace.getActiveFile();
                if (file !== null) {
                    var content = file.session.getValue();
                    var promise = file.setContent(content);
                    promise.then(function () {
                        file.changed = false;
                    });
                }
            }
        });

    });
