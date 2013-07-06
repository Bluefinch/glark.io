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

.factory('Workspace', ['$rootScope', 'editor', 'EditSession', 'extensionFilter', 'filetypes',
    function ($rootScope, editor, EditSession, extensionFilter, filetypes) {
        /* Main model of the glark.io application. Contains among other all the
         * data describing the files of the workspace, the open ones and the active
         * one. */
        var Workspace = function (name, rootDirectory, type) {
            this.name = name;

            /* Generate a random id. */
            this.id = Math.random().toString(36).substr(2);

            /* Private member active file. */
            this.activeFile = null;

            /* Set the root directory. */
            this.rootDirectory = rootDirectory;
            rootDirectory.setParentDirectory(null);
            rootDirectory.setWorkspaceId(this.id);

            /* Open files of the workspace. A collection of glark.services.File,
             * object, extended with a session attribute. */
            this.openFiles = [];

            if (type === 'local' || type === 'remote' || type === 'linked') {
                this.type = type;
            } else {
                throw 'Bad Workspace type: ' + type;
            }

        };

        Workspace.prototype.isLocal = function () {
            return this.type === 'local';
        };

        Workspace.prototype.isRemote = function () {
            return this.type === 'remote';
        };

        Workspace.prototype.isLinked = function () {
            return this.type === 'linked';
        };

        Workspace.prototype.isSharable = function () {
            /* Only local Workspace are sharable. */
            return this.isLocal();
        };

        /* Gets the workspace info. */
        Workspace.prototype.getInfo = function () {
            return {
                name: this.name,
                id: this.id,
                rootDirectory: this.rootDirectory
            };
        };

        /* Gets an entry by a its fullname. */
        Workspace.prototype.getEntry = function (fullname) {

            /* Remove fist and last slash. */
            if (fullname.charAt(0) === '/') {
                fullname = fullname.substring(1);
            }
            if (fullname.charAt(fullname.length - 1) === '/') {
                fullname = fullname.substring(0, fullname.length - 1);
            }

            var name = 0;
            var path = fullname.split('/');

            /* We extract the name and remove
             * it from the path. */
            if (path.length === 1 && path[0] === '') {
                return this.rootDirectory;
            } else {
                name = path[path.length - 1];
                path = path.slice(0, path.length - 1);
            }

            var directory = this.rootDirectory;
            angular.forEach(path, function (directoryName) {
                if (directory !== null) {
                    var child = directory.children[directoryName];
                    if (child !== undefined) {
                        directory = child;
                    } else {
                        directory = null;
                    }
                }
            });

            if (directory === null) {
                return null;
            }

            var entry = directory.children[name];
            if (entry !== undefined) {
                return entry;
            } else {
                return null;
            }
        };

        /* @param entry is a services.filesystem.*File or
         * a services.filesystem.*Directory object. */
        Workspace.prototype.addEntry = function (entry) {
            this.rootDirectory.addEntry(entry);
        };

        /* @param entry is a services.filesystem.*File object or
         * a glark.services.*Directory object. */
        Workspace.prototype.removeEntry = function (entry) {
            if (entry.isFile) {
                this.closeFile(entry);
            }
            this.rootDirectory.removeEntry(entry);
        };

        /* @param file is a services.filesystem.*File object. */
        Workspace.prototype.openFile = function (file) {
            if (this.openFiles.indexOf(file) === -1) {
                this.openFiles.push(file);
                /* Create session for file. */
                file.session = new EditSession('');

                /* Set the correct mode. */
                var aceMode = filetypes.getAceModeFromExtension(extensionFilter(file.name));
                file.session.setMode(aceMode);

                /* Fill content. */
                var promise = file.getContent();
                promise.then(function (content) {
                    file.session.setValue(content, -1);
                    /* Attach change event when filled. */
                    file.onchange = function () {
                        file.changed = true;
                        $rootScope.$digest();
                    };
                    file.session.on('change', file.onchange);
                });
            }
        };

        /* @param file is a services.filesystem.*File object. */
        Workspace.prototype.closeFile = function (file) {
            if (file === this.activeFile) {
                this.activeFile = null;
            }
            var idx = this.openFiles.indexOf(file);
            if (idx !== -1) {
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
            if (file !== this.activeFile) {
                this.openFile(file);
                this.activeFile = file;
                editor.setSession(file.session);
                $rootScope.$broadcast('Workspace.activeFileChange', file);
            }
        };

        /* @param file is a services.filesystem.*File object. */
        Workspace.prototype.isActiveFile = function (file) {
            return file === this.activeFile;
        };

        return Workspace;
    }
]);
