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
    
    /* Helper providing services to handle the html5 filesystem api. */
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

    /* Create a glark.services.File object from a html5 File or Blob object. */
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

    /* Main model of the glark.io application. Contains among other all the
     * data describing the files of the workspace, the open ones and the active
     * one. */
    .factory('workspace', function (editor) {
        var workspace = {};
        
        var activeFile = null;
        
        /* Files of the workspace. A collection of glark.services.File object. */
        workspace.files = [];
        
        /* @param file is a glark.services.File object. */
        workspace.addFile = function (file) {
            if (workspace.files.indexOf(file) == -1) {
                workspace.files.push(file);
            }
        };
        
        /* @param file is a glark.services.File object. */
        workspace.removeFile = function (file) {
            var idx = workspace.files.indexOf(file);
            if (idx != -1) {
                workspace.files.splice(idx, 1);
                file.session.setValue('', -1);
                return true;
            }
            return false;
        };
        
        /* @return the number of files. */
        workspace.getFileCount = function() {
             return workspace.files.length;
        };
        
        /* @return the active glark.services.File file. */
        workspace.getActiveFile = function() {
             return activeFile;
        };
        
        /* @param file is a glark.services.File object. */
        workspace.setActiveFile = function(file) {
            workspace.addFile(file);
            activeFile = file;
            editor.setSession(file.session);
        };
        
        /* @param file is a glark.services.File object. */
        workspace.isActiveFile = function(file) {
            return file == activeFile;
        };
    
        return workspace;
    });
