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

    .factory('workspaces', function (editor) {
        var workspaces = {};
        
        workspaces.workspaces = [];
        
        var activeWorkspace = null;
    
        /* @param workspace is a glark.services.Workspace object. */
        workspaces.addWorkspace = function(workspace) {
            if (this.workspaces.indexOf(workspace) == -1) {
                this.workspaces.push(workspace);
            }
        };
        
        /* @param workspace is a glark.services.Workspace object. */
        workspaces.setActiveWorkspace = function(workspace) {
            editor.clearSession();
            this.addWorkspace(workspace);
            activeWorkspace = workspace;
            
            var activeFile = workspace.getActiveFile();
            if(activeFile !== null){
                editor.setSession(activeFile.session);
            }
        };
        
        workspaces.getActiveWorkspace = function() {
            return activeWorkspace;
        };
        
        return workspaces;
    });