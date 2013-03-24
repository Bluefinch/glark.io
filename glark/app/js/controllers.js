'use strict';

/* Controllers */

angular.module('glark.controllers', [])
    .controller('DragDropController', function ($scope, editor, workspace, File) {
        $scope.droppedFile = null;

        var openFile = function (fileEntry) {
            var file = new File(fileEntry);
            workspace.files.push(file);
            workspace.activeFile = file;
        };

        $scope.openDroppedFiles = function () {
            var fileEntries = $scope.droppedFiles;
            angular.forEach(fileEntries, function (fileEntry) {
                openFile(fileEntry);
            });
        };
    })

    .controller('TabController', function ($scope, editor, workspace) {
        $scope.workspace = workspace;

        $scope.setActiveFile = function (file) {
            workspace.activeFile = file;
        };

        $scope.closeFile = function (file) {
            var removed = workspace.removeFile(file);
            if (removed && workspace.files.length > 0) {
                workspace.activeFile = workspace.files[0];
            }
        };
    });
