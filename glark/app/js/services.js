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
    
    .factory('filesystem', function ($q, $rootScope) {
        return {
            getFileContent: function (fileEntry) {
                var defered = $q.defer();
                var reader = new FileReader();
                reader.onload = function (event) {
                    defered.resolve(event.target.result);
                    $rootScope.$digest();
                };
                reader.readAsText(fileEntry);
                return defered.promise;
            }
        };
    })

    .factory('File', function (filesystem, EditSession) {

        return function (fileEntry) {
            var file = this;
            
            file.fileEntry = fileEntry;
            file.name = fileEntry.name;
            file.session = new EditSession('');

            // TODO: Should be changed.
            file.session.setMode("ace/mode/javascript");
            
            var promise = filesystem.getFileContent(fileEntry);
            promise.then(function (content) {
                file.session.setValue(content, -1);
            });
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
