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
    
    .factory('File', function (filesystem, EditSession, filenameFilter, basenameFilter) {

        /* Create a glark.services.File object giving the fullPath of the file
         * and a promise callback allowing to get the content of the file itself. */
        return function (fullPath, getFileContentCallback) {
            var file = this;
            
            // file.fileEntry = fileEntry;

            file.name = filenameFilter(fullPath);
            file.basename = basenameFilter(fullPath);

            file.session = new EditSession('');

            // TODO: Should be changed.
            file.session.setMode("ace/mode/javascript");

            getFileContentCallback(function (content) {
                file.session.setValue(content, -1);
            });
            
            // if (typeof fileEntry.file === 'function') {
                // fileEntry.file(function (blob) {
                    // var promise = filesystem.getFileContent(blob);
                    // promise.then(function (content) {
                        // file.session.setValue(content, -1);
                    // });
                // });
            // } else {
                // var promise = filesystem.getFileContent(fileEntry);
                // promise.then(function (content) {
                    // file.session.setValue(content, -1);
                // });
            // }
        };
    });
