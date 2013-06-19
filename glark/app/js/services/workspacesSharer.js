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

    .factory('workspacesSharer', ['$rootScope', '$timeout', 'socket', 'workspaces',
            function ($rootScope, $timeout, socket, workspaces) {

        var workspacesSharer = {};
        
        workspacesSharer.name = 'coucou';
        workspacesSharer.workspaces = [];

        // ---------
        /* Register local listeners. */
        $rootScope.$on('workspaces.setActiveWorkspace', function (event, workspace) {
            console.log(workspace);
        });

        $rootScope.$on('workspaces.addWorkspace', function (event, workspace) {
            console.log(workspace);
        });

        $rootScope.$on('Workspace.addEntry', function (event, entry) {
            /* An entry was added to the current active workspace. */
            console.log(entry);
            socket.broadcast('Workspace.addEntry', entry);
        });

        // ---------
        /* Register socket listeners. */
        socket.on('workspacesChange', function (workspaces) {
            console.log(workspaces);
        });

        socket.on('Workspace.addEntry', function (entry) {
            console.log(entry);
            /* FIXME temporarily remove listeners from here, and add them back
             * afterwards rather than this ugly silent boolean. */
            workspaces.getActiveWorkspace().addEntry(entry, true);
        });

        socket.on('getWorkspaces', function (callback) {
            callback(workspaces);
        });

        // ---------
        workspacesSharer.startSharing = function () {
            /* FIXME Wait for the socket service to be ready with a small
             * timeout. This might be wrapped in a socket.onReady() event. */
            $timeout(function () {
                console.log('Start sharing workspaces');
                if (!socket.isHost) {
                    socket.emitToHost('getWorkspaces', function (workspaces) {
                        console.log('Host workspaces:');
                        console.log(workspaces);
                        workspacesSharer.workspaces = workspaces.workspaces;
                        $rootScope.$digest();
                    });
                }
            }, 1000);
        };


        return workspacesSharer;
    }]);

