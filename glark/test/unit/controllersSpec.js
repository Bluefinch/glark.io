'use strict';

/* jasmine specs for controllers go here */

describe('The controllers', function () {
    beforeEach(angular.mock.module('glark.controllers'));

    describe('The TabController', function () {
        var editor, workspace;

        beforeEach(function () {
            angular.mock.module('glark.controllers');
            editor = null;
            workspace = { files: ['toto', 'titi'], activeFile: 'titi' };
        });

        it('should have a reference to the workspace service in its scope',
            angular.mock.inject(function ($rootScope, $controller) {
                var scope = $rootScope.$new();
                $controller('TabController', { $scope: scope, editor: editor, workspace: workspace });

                expect(scope.workspace).toBe(workspace);
            }));
    });
});
