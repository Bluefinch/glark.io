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

    .controller('WorkspacesController', function ($window, $scope, workspaces, Workspace, Connector, RemoteDirectory) {
        $scope.workspaces = workspaces;
        
        $scope.addLocalWorkspace = function() {
            var workspace = new Workspace('Local');
            workspaces.addWorkspace(workspace);
        };
        
        $scope.addRemoteWorkspace = function() {
            /* TODO : temporar UI... */
            var result = $window.prompt("adress:port","");
            var split = result.split(':');
            var adress = split[0];
            var port = split[1];
            
            var connector = new Connector(adress, port, workspace);
            var directory = new RemoteDirectory('root', connector);
            var workspace = new Workspace('Remote', directory);
            
            workspaces.addWorkspace(workspace);
        };
        
        $scope.setActiveWorkspace = function(workspace) {
            workspaces.setActiveWorkspace(workspace);
            workspace.rootDirectory.updateChildren();
        };
    });

