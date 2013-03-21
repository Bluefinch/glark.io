'use strict';

/* Controllers */

angular.module('glark.controllers', [])
    .controller('DragDropController', function($scope, editor, workspace, File) {
        $scope.droppedFile = null;

        var openFile = function(fileEntry) {
            var file = new File(fileEntry);
            editor.setSession(file.session);
            workspace.activeFile = file;
            workspace.files.push(file);
        }

        $scope.openDroppedFiles = function() {
            var fileEntries = $scope.droppedFiles;
            angular.forEach(fileEntries, function(fileEntry) {
                openFile(fileEntry);
            });
        }
    })

    .controller('TabController', function($scope, editor, workspace) {
        $scope.workspace = workspace;

        $scope.setActiveFile = function(file) {
            editor.setSession(file.session);
            workspace.activeFile = file;
        }

        $scope.closeFile = function(file) {
            var idx = workspace.files.indexOf(file);
            if(idx != -1) {
                workspace.files.splice(idx, 1);
                file.session.setValue('', -1);

                if(workspace.files.length > 0) {
                    $scope.setActiveFile(workspace.files[0]);
                }
            }
        }
    });
