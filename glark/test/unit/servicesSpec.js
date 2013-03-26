'use strict';

/* jasmine specs for services go here */

describe('The services:', function () {
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

        it('has a method to add file to its file collection and another one to count them',
            angular.mock.inject(function (workspace) {
                workspace.addFile(file1);
                workspace.addFile(file2);
                workspace.addFile(file3);

                expect(workspace.getFileCount()).toBe(3);
            }));

        it('can be added files only if they are not already in it',
            angular.mock.inject(function (workspace) {
                workspace.addFile(file1);
                workspace.addFile(file1);

                expect(workspace.fileCount).toBe(1);
            }));

        it('has a method to set some file as active file',
            angular.mock.inject(function (workspace) {
                workspace.addFile(file1);
                workspace.addFile(file2);
                workspace.addFile(file3);

                workspace.setActiveFile(file2);

                expect(workspace.getActiveFile()).toBe(file2);
            }));

        it('adds automatically a file to its file collection when setting a file as active file',
            angular.mock.inject(function (workspace) {
                workspace.addFile(file1);

                workspace.activeFile = file2;

                expect(workspace.fileCount).toBe(2);
                expect(workspace.activeFile).toBe(file2);
            }));
    });
});
