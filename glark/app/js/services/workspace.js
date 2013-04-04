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

    .factory('FileTree', function () {
        
        
        var DirectoryNode = function(name) {
            this.isDirectory = true;
            this.isFile = false;
            
            this.name = name;
            this.children = [];
        };
        
        var FileNode = function(file) {
            this.isDirectory = false;
            this.isFile = true;
            
            this.name = false.name;
            this.file = file;
        };
        
        var FileTree = function() {
            this.rootNode = new DirectoryNode('root');
        }
        
        FileTree.prototype.addFile = function(file) {
            var directories = file.basename.split('/');
            var activeNode = this.rootNode;
            angular.forEach(directories, function(directory) {
                if(!(directory in activeNode.children)) {
                    activeNode.children.push(new DirectoryNode(directory));
                }
                activeNode = activeNode[directory];
            });
            activeNode.children.push(new FileNode(file));
        };
        
        return FileTree;
    }
    
    .factory('workspace', function (editor, FileTree) {
        /* Main model of the glark.io application. Contains among other all the
         * data describing the files of the workspace, the open ones and the active
         * one. */
        var workspace = {};

        var activeFile = null;

        /* Files of the workspace. A collection of glark.services.File object. */
        workspace.files = [];

        /* A file tree representation of the files collection. */
        workspace.tree = new FileTree();
        
        /* @param file is a glark.services.File object. */
        workspace.addFile = function (file) {
            if (this.files.indexOf(file) == -1) {
                this.files.push(file);
                this.tree.addFile(file);
            }
        };
        
        /* @param file is a glark.services.File object. */
        workspace.removeFile = function (file) {
            var idx = this.files.indexOf(file);
            if (idx != -1) {
                this.files.splice(idx, 1);
                file.session.setValue('', -1);
                //this.tree.removeFile(file); /*TODO*/
                return true;
            }
            return false;
        };

        /* @return the number of files. */
        workspace.getFileCount = function () {
            return this.files.length;
        };

        /* @return the active glark.services.File file. */
        workspace.getActiveFile = function () {
            return activeFile;
        };

        /* @param file is a glark.services.File object. */
        workspace.setActiveFile = function (file) {
            this.addFile(file);
            activeFile = file;
            editor.setSession(file.session);
        };

        /* @param file is a glark.services.File object. */
        workspace.isActiveFile = function (file) {
            return file == activeFile;
        };

        return workspace;
    });
