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

angular.module('glark.controllers', []);
angular.module('glark.directives', []);
angular.module('glark.filters', []);
angular.module('glark.services', ['ngResource']);

angular.module('glark', ['glark.controllers', 'glark.directives', 'glark.filters', 'glark.services'])

.run(function ($rootScope, LocalFile, workspaces, layout) {
    
    /* Helper function to broadcast events. */
    var applyEvent = function(eventName, event) {
        event.preventDefault();
        $rootScope.$apply(function() {
            $rootScope.$broadcast(eventName);
        });
    };
    
    /* Bind keys with events. */
    document.addEventListener('keydown', function(event) {

        if (!event.metaKey && !event.ctrlKey) {
            return;
        }
        
        switch (event.keyCode) {
            case 83 : // s 
                return applyEvent('save', event);
        }
    });
    
    /* Create the default local workspace. */
    var workspace = workspaces.createLocalWorkspace('Workspace');
    workspaces.setActiveWorkspace(workspace);

    /* Open a file to display tutorial and info to the user. */
    /* TODO This is hard-coded for now, maybe requesting this from the
     * server would be better. */
    var blob = new Blob(["###glark.io###\nWelcome to _glark.io_ the drag'n'collaborate editor.\nJust drag some files here and start editing."], {type: "text"});
    var welcomeFile = new LocalFile("welcome.md", blob);
    
    /* Add it to the default workspace and give it the focus. */
    workspace.addEntry(welcomeFile);
    workspace.setActiveFile(welcomeFile);
});
