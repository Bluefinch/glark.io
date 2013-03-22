'use strict';

/* jasmine specs for services go here */

describe('The services', function () {
    var file1, file2, file3;

    beforeEach(function () {
        angular.mock.module('glark.services');
        file1 = 'toto';
        file2 = 'titi';
        file3 = 'tutu';
    });

    describe('The workspace', function () {

        it('should have the 3 files in its files collection',
            angular.mock.inject(function (workspace) {
                workspace.addFile(file1);
                workspace.addFile(file2);
                workspace.addFile(file3);

                expect(workspace.getFileCount()).toBe(3);
            }));

        it('should have the file2 as its active file',
            angular.mock.inject(function (workspace) {
                workspace.addFile(file1);
                workspace.addFile(file2);
                workspace.addFile(file3);

                workspace.setActiveFile(file2);

                expect(workspace.getActiveFile()).toBe(file2);
            }));
    });
});
