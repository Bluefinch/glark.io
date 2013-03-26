'use strict';

/* Controllers */

angular.module('glark.controllers', [])
    .controller('DragDropController', function ($scope, editor, workspace, File) {
        $scope.droppedFile = null;

        var openFile = function (fileEntry) {
            var file = new File(fileEntry);
            workspace.files.push(file);
            workspace.setActiveFile(file);
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
            workspace.setActiveFile(file);
        };

        $scope.closeFile = function (file) {
            var removed = workspace.removeFile(file);
            if (removed && workspace.files.length > 0) {
                workspace.setActiveFile(workspace.files[0]);
            }
        };
    });
