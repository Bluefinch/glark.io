'use strict';

angular.module('glark', ['glark.controllers', 'glark.directives', 'glark.filters', 'glark.services'])
.run(function ($rootScope, File, workspace) {
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
    workspace.activeFile = welcomeFile;
});
