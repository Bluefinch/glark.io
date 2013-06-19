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

    .factory('workspaces', ['$rootScope', '$q', '$timeout', 'editor', 'socket', 'Workspace', 'LocalDirectory', 'RemoteDirectory', 'LinkedDirectory',
            function ($rootScope, $q, $timeout, editor, socket,  Workspace, LocalDirectory, RemoteDirectory, LinkedDirectory) {

        var workspaces = {};

        workspaces.workspaces = [];

        var activeWorkspace = null;

        /* @param workspace is a glark.services.Workspace object. */
        workspaces.addWorkspace = function (workspace) {
            if (this.workspaces.indexOf(workspace) === -1) {
                this.workspaces.push(workspace);
                workspace.rootDirectory.updateChildren();

                $rootScope.$broadcast('workspaces.addWorkspace', workspace);
            }
        };

        /* Create a new local workspace with the given name. A LocalDirectory
         * could be specified as rootDirectory. */
        workspaces.createLocalWorkspace = function (name, rootDirectory) {
            if (rootDirectory === undefined) {
                rootDirectory = new LocalDirectory(name);
            }
            var workspace = new Workspace(name, rootDirectory, 'local');
            this.addWorkspace(workspace);
            return workspace;
        };

        workspaces.createRemoteWorkspace = function (name, params) {
            var rootDirectory = new RemoteDirectory('files', params);
            var workspace = new Workspace(name, rootDirectory, 'remote');
            this.addWorkspace(workspace);
            return workspace;
        };
        
        workspaces.createLinkedWorkspace = function (name, id) {
            var rootDirectory = new LinkedDirectory(id);
            var workspace = new Workspace(name, rootDirectory, 'linked');
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
        
        workspaces.addHostWorkspaces = function () {
            socket.broadcast('getSharableWorkspacesInfo', function (workspacesInfo) {
                $rootScope.$apply(function () {
                    console.log('Sharable workspace info:');
                    console.log(workspacesInfo);
                    angular.forEach(workspacesInfo, function (workspaceName, workspaceId) {
                        workspaces.createLinkedWorkspace(workspaceName, workspaceId);
                    });
                });
            });
        };
        
        /* Returns a dictionnary containing the ids (as key) and 
         * names (as value) of sharable workspaces. */
        workspaces.getSharableWorkspacesInfo = function () {
            var sharableWorkspacesInfo = {};
            angular.forEach(this.workspaces, function(workspace) {
                if (workspace.isSharable()) {
                    sharableWorkspacesInfo[workspace.id] = workspace.name;
                }
            });
            return sharableWorkspacesInfo;
        };
        
        socket.on('getSharableWorkspacesInfo', function (callback) {
            callback(workspaces.getSharableWorkspacesInfo());
        });

        return workspaces;
    }]);
