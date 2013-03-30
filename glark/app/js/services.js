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

/* Services */

angular.module('glark.services', ['glark.filters'])
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
    
    /* Helper providing services to manage the layout . */
    .factory('layout', function () {
        var layout = {};
        
        var minLeftBarWidth = 50;
        
        var components = {};
        var styles = {};
        
        /* Register a new component. */
        layout.registerComponent = function(name, selector, style) {
            var $component = angular.element(selector);
            $component.css(style);
            components[name] = $component;
            styles[name] = style;
        };

        /* Reset the layout. */
        layout.resetLayout = function() {
            angular.forEach(components, function($component, name) {
                $component.css(styles[name]);
            });
        };
        
        /* @param name is the component name. */
        layout.width = function(name) {
            return components[name].width();
        };
        
        /* @param width is in pixel. */
        layout.setLeftBarWidth = function(width) {
            if(width<minLeftBarWidth) return;
            
            components['editor']
                .css('left', width + 'px');
                
            components['top-bar']
                .css('left', width + 'px');
                
            components['left-bar']
                .css('width', width + 'px');
        };
        
        /* Register default components. */
        layout.registerComponent('editor', '#editor', {
            top: '35px',
            bottom: '0',
            left: '150px',
            right: '0'
        });
        
        layout.registerComponent('top-bar', '#editor-top-bar', {
            top: '0',
            height: '35px',
            left: '150px',
            right: '0'
        });
        
        layout.registerComponent('left-bar', '#editor-left-bar', {
            top: '0',
            bottom: '0',
            left: '0',
            width: '150px'
        });
        
        /* Reset the layout at the first access. */
        layout.resetLayout();
        
        return layout;
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
    .factory('File', function (filesystem, EditSession, basenameFilter) {

        return function (fileEntry) {
            var file = this;
            
            file.fileEntry = fileEntry;

            file.name = fileEntry.name;
            file.basename = '/';
            if (typeof fileEntry.fullPath !== 'undefined') {
                file.basename = basenameFilter(fileEntry.fullPath);
            }

            file.session = new EditSession('');

            // TODO: Should be changed.
            file.session.setMode("ace/mode/javascript");
            
            if (typeof fileEntry.file === 'function') {
                fileEntry.file(function (blob) {
                    var promise = filesystem.getFileContent(blob);
                    promise.then(function (content) {
                        file.session.setValue(content, -1);
                    });
                });
            } else {
                var promise = filesystem.getFileContent(fileEntry);
                promise.then(function (content) {
                    file.session.setValue(content, -1);
                });
            }
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
