'use strict';

/* jasmine specs for services go here */

describe('The services', function () {
    var mockSession, mockEditor, file1, file2, file3;

    beforeEach(function () {
        angular.mock.module('glark.services');
        
        mockEditor = { setSession: jasmine.createSpy() };
        mockSession = { setValue: jasmine.createSpy() };
        
        module(function($provide) {
            $provide.value('editor', mockEditor);
        });
        
        file1 = { name: 'toto', session: mockSession};
        file2 = { name: 'titi', session: mockSession};
        file3 = { name: 'tutu', session: mockSession};
        
    });

    describe('The workspace', function () {

        it('should have the 3 files in its files collection',
            angular.mock.inject(function (workspace) {
                workspace.addFile(file1);
                workspace.addFile(file2);
                workspace.addFile(file3);

                expect(workspace.fileCount).toBe(3);
            }));

        it('should have the file2 as its active file',
            angular.mock.inject(function (workspace) {
                workspace.addFile(file1);
                workspace.addFile(file2);
                workspace.addFile(file3);

                workspace.activeFile = file2;

                expect(workspace.activeFile).toBe(file2);
            }));
    });
});
