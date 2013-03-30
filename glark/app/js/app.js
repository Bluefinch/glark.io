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

angular.module('glark', ['glark.controllers', 'glark.directives', 'glark.filters', 'glark.services'])
.run(function ($rootScope, File, workspace, layout) {
    var KEY = {};
    // create key map A - Z
    for (var i = 65; i <= 90; i++) {
        KEY[String.fromCharCode(i).toUpperCase()] = i;
    }

    var applyEvent = function (eventName, event) {
        event.preventDefault();
        $rootScope.$apply(function () {
            $rootScope.$broadcast(eventName);
        });
    };

    document.addEventListener('keydown', function (event) {

        // ESC
        if (event.keyCode === 27) {
            applyEvent('escape', event);
            return;
        }

        if (!event.metaKey && !event.ctrlKey) {
            return;
        }

        switch (event.keyCode) {
            case KEY.S:
                return applyEvent('save', event);
        }
    });

    /* Open a file to display tutorial and info to the user. */
    /* TODO This is hard-coded for now, maybe requesting this from the
     * server would be better. */
    var fileEntry = new Blob(["###glark.io###\nWelcome to _glark.io_ the drag'n'collaborate editor.\nJust drag some files here and start editing."], {type: "text"});
    fileEntry.name = "welcome.md";
    var welcomeFile = new File(fileEntry);

    /* Add it to the workspace and give it the focus. */
    workspace.addFile(welcomeFile);
    workspace.setActiveFile(welcomeFile);

    /* Connect to socketio. */
    var socket = io.connect();
    socket.on('connect', function () {
        socket.on('ping', function (fn) {
            fn('pong');
        });

        socket.on('workspace', function (data) {
            // console.log(data);
        });
    });

});
