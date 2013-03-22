'use strict';

/* Services */

angular.module('glark.services', [])
    .factory('ace', function () {
        return ace.edit('editor');
    })

    .factory('EditSession', function () {
        return ace.require("ace/edit_session").EditSession;
    })

    .factory('editor', function (EditSession, ace) {
        ace.setTheme("ace/theme/twilight");

        return {
            focus: function () {
                setTimeout(function () {
                    ace.focus();
                }, 0);
            },

            setSession: function (session) {
                session.setFoldStyle('markbegin');

                ace.setSession(session);
                ace.setReadOnly(false);
            },

            clearSession: function () {
                ace.setSession(new EditSession(''));
                ace.setReadOnly(true);
            },

            goToLine: function (lineNumber) {
                ace.gotoLine(lineNumber);
            },

            find: function (value) {
                return ace.find(value);
            },

            findNext: function () {
                return ace.findNext();
            },

            findPrevious: function () {
                return ace.findPrevious();
            }
        };
    })

    .factory('File', function (EditSession) {
        var readAndSetFileContent = function (file, fileEntry) {
            var reader = new FileReader();
            reader.onload = function (event) {
                file.session.setValue(event.target.result, -1);
            };
            reader.readAsText(fileEntry);
        };

        return function (fileEntry) {
            this.fileEntry = fileEntry;
            this.name = fileEntry.name;
            this.session = new EditSession('');

            // TODO: Should be changed.
            this.session.setMode("ace/mode/javascript");

            readAndSetFileContent(this, fileEntry);
        };
    })

    .factory('workspace', function ($rootScope) {
        return {
            files: [],
            activeFile: null,
            
            addFile: function (file) {
                this.files.push(file);
            },

            getFileCount: function () {
                return this.files.length;
            },

            setActiveFile: function (file) {
                this.activeFile = file;
            },

            getActiveFile: function () {
                return this.activeFile;
            }
        };
    });
