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

/* Controllers */

angular.module('glark.controllers', [])
    .controller('DragDropController', function ($scope, editor, workspace, File) {
        $scope.droppedFile = null;

        var openFile = function (fileEntry) {
            var file = new File(fileEntry);
            workspace.files.push(file);
            workspace.setActiveFile(file);
        };

        $scope.openDroppedFiles = function () {
            var fileEntries = $scope.droppedFiles;
            angular.forEach(fileEntries, function (fileEntry) {
                openFile(fileEntry);
            });
        };
    })

    .controller('TabController', function ($scope, editor, workspace) {
        $scope.workspace = workspace;

        $scope.setActiveFile = function (file) {
            workspace.setActiveFile(file);
        };

        $scope.closeFile = function (file) {
            var removed = workspace.removeFile(file);
            if (removed && workspace.files.length > 0) {
                workspace.setActiveFile(workspace.files[0]);
            }
        };
    });
