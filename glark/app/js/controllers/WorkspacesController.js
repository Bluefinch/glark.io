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

    .controller('WorkspacesController', function ($window, $scope, workspaces, Workspace, RemoteDirectory) {
        $scope.workspaces = workspaces;
        
        /* The entries of the workspaces dropdown menu. They all directly map
         * to a function with the same name. */
        $scope.dropdownEntries = [
            "New local workspace",
            "New connected workspace"
        ];

        $scope.addLocalWorkspace = function () {
            var workspace = workspaces.createLocalWorkspace('Local');
            workspaces.setActiveWorkspace(workspace);
        };
        
        $scope.addRemoteWorkspace = function () {
            /* TODO : temporar UI... */
            var result = $window.prompt("adress:port","localhost:3000");
            var split = result.split(':');
            
            var params = {
                adress: split[0],
                port: split[1]
            };
            
            var result = $window.prompt("username:password", "toto:pipo");
            var split = result.split(':');

            params.username = split[0];
            params.password = split[1];

            var workspace = workspaces.createRemoteWorkspace('Remote', params);
            workspaces.setActiveWorkspace(workspace);
        };
        
        $scope.setActiveWorkspace = function (workspace) {
            workspaces.setActiveWorkspace(workspace);
        };

        $scope.connectWorkspace = function (workspace) {
            workspaces.setActiveWorkspace(workspace);
            workspace.connected = !workspace.connected;
        };
    });

