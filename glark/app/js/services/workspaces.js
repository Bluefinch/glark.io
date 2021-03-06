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

.factory('workspaces', ['$rootScope', '$q', '$timeout', 'editor', 'socket',
    'Workspace', 'LocalDirectory', 'RemoteDirectory', 'LinkedDirectory',
    function ($rootScope, $q, $timeout, editor, socket, Workspace,
        LocalDirectory, RemoteDirectory, LinkedDirectory) {

        var workspaces = {};

        workspaces.workspaces = [];

        var activeWorkspace = null;

        /* @param workspace is a glark.services.Workspace object. */
        workspaces.addWorkspace = function (workspace) {
            if (this.workspaces.indexOf(workspace) === -1) {
                this.workspaces.push(workspace);
                workspace.rootDirectory.onReady(function () {
                    /* Wait for children to be updated before broadcasting the
                     * addWorspace event. */
                    $rootScope.$broadcast('workspaces.addWorkspace', workspace);
                });
            }
        };

        /* Create a new local workspace with the given name. A LocalDirectory
         * could be specified as rootDirectory. */
        workspaces.createLocalWorkspace = function (name, rootDirectory) {
            if (rootDirectory === undefined) {
                rootDirectory = new LocalDirectory(null, name);
            }
            var workspace = new Workspace(name, rootDirectory, 'local');
            this.addWorkspace(workspace);
            return workspace;
        };

        workspaces.createRemoteWorkspace = function (name, params) {
            var rootDirectory = new RemoteDirectory(null, 'files', params);
            var workspace = new Workspace(name, rootDirectory, 'remote');
            this.addWorkspace(workspace);
            return workspace;
        };

        workspaces.createLinkedWorkspace = function (workspaceInfo) {
            var rootDirectory = new LinkedDirectory(null, workspaceInfo.id, workspaceInfo.rootDirectory);
            var workspace = new Workspace(workspaceInfo.name, rootDirectory, 'linked');
            this.addWorkspace(workspace);
            return workspace;
        };

        /* @param workspace is a glark.services.Workspace object. */
        workspaces.setActiveWorkspace = function (workspace) {
            this.addWorkspace(workspace);
            activeWorkspace = workspace;

            /* Update workspace content. */
            workspace.rootDirectory.updateChildren();

            /* Set the new active file if needed. */
            var activeFile = workspace.getActiveFile();
            if (activeFile !== null) {
                editor.setSession(activeFile.session);
            } else {
                editor.clearSession();
            }

            $rootScope.$broadcast('workspaces.setActiveWorkspace', workspace);

            return activeWorkspace;
        };

        workspaces.getActiveWorkspace = function () {
            return activeWorkspace;
        };

        workspaces.addSharableWorkspaces = function () {
            socket.broadcast('getSharableWorkspacesInfo', function (workspacesInfo) {
                $rootScope.$apply(function () {
                    angular.forEach(workspacesInfo, function (workspaceInfo) {
                        workspaces.createLinkedWorkspace(workspaceInfo);
                    });
                });
            });
        };

        /* Get the workspace corresponding to the given id, throw an exception
         * if not found. */
        workspaces.getWorkspaceById = function (workspaceId) {
            var resultWorkspace = null;
            angular.forEach(workspaces.workspaces, function (workspace) {
                if (workspace.id === workspaceId) {
                    resultWorkspace = workspace;
                }
            });

            if (resultWorkspace === null) {
                throw 'Unable to find workspace with id ' + workspaceId;
            }

            return resultWorkspace;
        };

        /* --------------------------------
         * Socket API
         * -------------------------------- */

        /* Return a dictionnary containing the ids (as key) and
         * names (as value) of sharable workspaces. */
        socket.on('getSharableWorkspacesInfo', function (callback) {
            var sharableWorkspacesInfo = [];
            angular.forEach(workspaces.workspaces, function (workspace) {
                if (workspace.isSharable()) {
                    sharableWorkspacesInfo.push(workspace.getInfo());
                }
            });
            callback(sharableWorkspacesInfo);
        });

        /* Return a dictionnary containing the ids (as key) and
         * names (as value) of sharable workspaces. */
        socket.on('getFileContent', function (data, callback) {
            var workspace = workspaces.getWorkspaceById(data.workspaceId);
            if (workspace !== null) {
                var child = workspace.getEntry(data.file.fullpath);
                if (child !== null && child.isFile) {
                    child.getContent().then(function (content) {
                        callback(content);
                    });
                    $rootScope.$digest();
                } else {
                    callback(null);
                }
            } else {
                callback(null);
            }

        });

        /* Broadcast the new workspace if it is sharable. */
        $rootScope.$on('workspaces.addWorkspace', function (event, workspace) {
            if (workspace.isSharable()) {
                socket.broadcast('addWorkspace', workspace.getInfo());
            }
        });

        /* Add a LinkedWorkspace. */
        socket.on('addWorkspace', function (workspaceInfo) {
            $rootScope.$apply(function () {
                workspaces.createLinkedWorkspace(workspaceInfo);
            });
        });

        /* Broadcast the new entry if it is sharable. */
        $rootScope.$on('directory.addEntry', function (event, data) {
            socket.broadcast('addEntry', data);
        });

        /* Add an Entry. */
        socket.on('addEntry', function (data) {
            $rootScope.$apply(function () {
                angular.forEach(workspaces.workspaces, function (workspace) {
                    if (workspace.isLinked() && workspace.rootDirectory.linkedWorkspaceId === data.workspaceId) {
                        var entry = data.entry;
                        var directory = workspace.getEntry(entry.basename);
                        directory.addLinkedEntry(data.workspaceId, entry);
                    }
                });
            });
        });

        return workspaces;
    }
]);
