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

    /* Create a glark.services.File object from a html5 File or Blob object. */
    .factory('filesystem', function (LocalFile, LocalDirectory) {
        var filesystem = {};

        filesystem.getEntriesFromDataTransfer = function (dataTransfer) {
            var entries = [];
            /* FIXME for firefox use dataTransfer.mozGetDataAt(i). */
            if (typeof dataTransfer.items !== 'undefined') {
                angular.forEach(dataTransfer.items, function (item) {
                    if (typeof item.webkitGetAsEntry === "function") {
                        var entry = item.webkitGetAsEntry();
                        if (entry.isFile) {
                            var localFile = new LocalFile(entry.name, entry);
                            entries.push(localFile);
                        } else {
                            var localDirectory = new LocalDirectory(entry.name, entry);
                            entries.push(localDirectory);
                        }
                    }
                });
            } else {
                angular.forEach(dataTransfer.files, function (entry) {
                    var localFile = new LocalFile(entry.name, entry);
                    entries.push(localFile);
                });
            }
            return entries;
        };

        return filesystem;
    });
