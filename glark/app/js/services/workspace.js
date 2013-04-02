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
    
    /* Main model of the glark.io application. Contains among other all the
     * data describing the files of the workspace, the open ones and the active
     * one. */
    .factory('workspace', function (editor) {
        var workspace = {};
        
        var activeFile = null;
        
        /* Files of the workspace. A collection of glark.services.File object. */
        workspace.files = [];

        /* A file tree representation of the files collection. */
        workspace.tree = {directory: '/', containedDirectories: {}, containedFiles: {}};
        
        /* @param file is a glark.services.File object. */
        workspace.addFile = function (file) {
            if (this.files.indexOf(file) == -1) {
                this.files.push(file);
                this.updateTree();
            }
        };
        
        /* @param file is a glark.services.File object. */
        workspace.removeFile = function (file) {
            var idx = this.files.indexOf(file);
            if (idx != -1) {
                this.files.splice(idx, 1);
                file.session.setValue('', -1);
                this.updateTree();
                return true;
            }
            return false;
        };

        /* @return the number of files. */
        workspace.getFileCount = function () {
            return this.files.length;
        };

        /* @return the active glark.services.File file. */
        workspace.getActiveFile = function () {
            return activeFile;
        };

        /* @param file is a glark.services.File object. */
        workspace.setActiveFile = function (file) {
            this.addFile(file);
            activeFile = file;
            editor.setSession(file.session);
        };

        /* @param file is a glark.services.File object. */
        workspace.isActiveFile = function (file) {
            return file == activeFile;
        };


        /* Update the file tree description when the files collection changes. */
        workspace.updateTree = function () {
            var buildDirectoryEntry = function (splitBasename) {
                var dirEntry = {directory: splitBasename[0], containedDirectories: {}, containedFiles: {}};
                for (var dirIdx = 1; dirIdx < splitBasename.length; ++dirIdx) {
                    var dirName = splitBasename[dirIdx];
                    if (!(dirName in dirEntry.containedDirectories)) {
                        dirEntry.containedDirectories[dirName] = buildDirectoryEntry(splitBasename.slice(1));
                    }
                }

                return dirEntry;
            };

            for (var fileIdx = 0; fileIdx < workspace.files.length; ++fileIdx) {
                /* Split and remove empty elements. */
                var splitBasename = [];
                var split = this.files[fileIdx].basename.split('/');
                for (var i = 0; i < split.length; ++i) {
                    if (split[i] !== '') {
                        splitBasename.push(split[i]);
                    }
                }

                var parentEntry = this.tree;
                if (splitBasename.length > 0) {
                    for (var dirIdx = 0; dirIdx < splitBasename.length; ++dirIdx) {
                        if (splitBasename[dirIdx] in parentEntry.containedDirectories) {
                            parentEntry = parentEntry.containedDirectories[splitBasename[dirIdx]];
                        } else {
                            var dirEntry = buildDirectoryEntry(splitBasename.slice(dirIdx));
                            parentEntry.containedDirectories[splitBasename[dirIdx]] = dirEntry;
                            parentEntry = dirEntry;
                        }
                    }
                }

                /* Now add the file if necessary. */
                if (!(this.files[fileIdx] in parentEntry.containedFiles)) {
                    parentEntry.containedFiles[this.files[fileIdx].name] = this.files[fileIdx];
                }
            }
        };

        return workspace;
    });
