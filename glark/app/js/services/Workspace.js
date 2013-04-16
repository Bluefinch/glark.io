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

    .factory('Workspace', function ($rootScope, editor, EditSession) {
        /* Main model of the glark.io application. Contains among other all the
         * data describing the files of the workspace, the open ones and the active
         * one. */
        var Workspace = function(name, rootDirectory) {
            this.name = name;
            
            /* Private member active file. */
            this.activeFile = null;    
            
            /* A services.filesystem.*Directory object. */
            this.rootDirectory = rootDirectory;
            rootDirectory.collapsed = false;
            
            /* Open files of the workspace. A collection of glark.services.File,
             * object, extended with a session attribute. */
            this.openFiles = [];
        };

        /* @param entry is a services.filesystem.*File or
         * a services.filesystem.*Directory object. */
        Workspace.prototype.addEntry = function (entry) {
            this.rootDirectory.addEntry(entry);
        };

        /* @param entry is a services.filesystem.*File object or
         * a glark.services.*Directory object. */
        Workspace.prototype.removeEntry = function (entry) {
            if(entry.isFile) {
                this.closeFile(entry);
            }
            this.rootDirectory.removeEntry(entry);
        };
        
        /* @param file is a services.filesystem.*File object. */
        Workspace.prototype.openFile = function (file) {
            if (this.openFiles.indexOf(file) == -1) {
                this.openFiles.push(file);
                /* Create session for file. */
                file.session = new EditSession('');
                file.session.setMode("ace/mode/javascript");
                /* Fill content. */
                var promise = file.getContent();
                promise.then(function (content) {
                    file.session.setValue(content, -1);
                    /* Attach change event when filled. */
                    file.onchange = function() {
                        file.changed = true;
                        $rootScope.$digest();
                    };
                    file.session.on('change', file.onchange);
                });
            }
        };

        /* @param file is a services.filesystem.*File object. */
        Workspace.prototype.closeFile = function (file) {
            if(file == this.activeFile) {
                this.activeFile = null;
            }
            var idx = this.openFiles.indexOf(file);
            if (idx != -1) {
                this.openFiles.splice(idx, 1);
                /* Reset file. */
                file.changed = false;
                file.session.removeListener('change', file.onchange);
                file.session.setValue('', -1);
                file.session = undefined;
                return true;
            }
            return false;
        };
        
        /* @param file is a services.filesystem.*File object. */
        Workspace.prototype.addAndOpenFile = function (file) {
            this.addEntry(file);
            this.openFile(file);
        };

        /* @return the active services.filesystem.*File file. */
        Workspace.prototype.getActiveFile = function () {
            return this.activeFile;
        };

        /* @param file is a services.filesystem.*File object. */
        Workspace.prototype.setActiveFile = function (file) {
            this.openFile(file);
            this.activeFile = file;
            editor.setSession(file.session);
        };

        /* @param file is a services.filesystem.*File object. */
        Workspace.prototype.isActiveFile = function (file) {
            return file == this.activeFile;
        };

        return Workspace;
    });
