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

    .controller('DragDropController', function ($scope, workspaces, LocalFile) {
        $scope.droppedFile = null;

        var openFile = function (fileEntry, setAsActiveFile) {
            var file = new LocalFile(fileEntry);
            workspaces.getActiveWorkspace().addFile(file);
            if (setAsActiveFile) {
                workspaces.getActiveWorkspace().setActiveFile(file);
            }
        };

        var readDirectoryEntries = function (directoryReader) {
            directoryReader.readEntries(function (entries) {
                $scope.$apply(function () {
                    for (var i = 0; i < entries.length; ++i) {
                        readFileTree(entries[i]);
                    }
                });
            }, function (err) {
                console.log(err);
            });
        };
        
        var readFileTree = function (entry) {
            if (entry.isFile) {
                openFile(entry, false);
            } else if (entry.isDirectory) {
                var directoryReader = entry.createReader();
                readDirectoryEntries(directoryReader);
            }
        };

        $scope.openDroppedFiles = function () {
            var dataTransfer = $scope.dataTransfer;
            /* FIXME for firefox use dataTransfer.mozGetDataAt(i). */
            if (typeof dataTransfer.items !== 'undefined') {
                angular.forEach(dataTransfer.items, function (item) {
                    var entry = null;
                    if (typeof item.webkitGetAsEntry === "function") {
                        entry = item.webkitGetAsEntry();

                        /* If it's a file open it directly. */
                        if (entry.isFile) {
                            openFile(entry, true);
                            return;
                        }

                        readFileTree(entry);
                    }
                });
            } else {
                angular.forEach(dataTransfer.files, function (entry) {
                    openFile(entry, true);
                });
            }
        };

    });
