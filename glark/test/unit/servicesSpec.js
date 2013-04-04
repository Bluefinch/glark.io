'use strict';

/* jasmine specs for services go here */

describe('The services:', function () {
    var mockSession, mockEditor, mockFileEntry,
        file1, file2, file3;

    beforeEach(function () {
        angular.mock.module('glark.services');
        
        mockEditor = { setSession: jasmine.createSpy() };
        mockSession = { setValue: jasmine.createSpy() };
        mockFileEntry = { setValue: jasmine.createSpy() };
        
        module(function ($provide) {
            $provide.value('editor', mockEditor);
        });
        
        file1 = { name: 'toto', basename: '/tata/tete/', fileEntry: mockFileEntry, session: mockSession};
        file2 = { name: 'titi', basename: '/tata/tete/', fileEntry: mockFileEntry, session: mockSession};
        file3 = { name: 'tutu', basename: '/tata/tete/', fileEntry: mockFileEntry, session: mockSession};
        
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

                expect(workspace.getFileCount()).toBe(1);
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

                workspace.setActiveFile(file2);

                expect(workspace.getFileCount()).toBe(2);
                expect(workspace.getActiveFile()).toBe(file2);
            }));
    });

    describe('The FileTree', function () {
        var fileTree;

        beforeEach(angular.mock.inject(function (FileTree) {
            fileTree = new FileTree();
        }));

        it('contains a rootNode upon creation', function () {
            expect(fileTree.rootNode.isDirectory).toBeTruthy();
            expect(fileTree.rootNode.isFile).toBeFalsy();
            expect(fileTree.rootNode.name).toBe('root');
            expect(fileTree.rootNode.children).toEqual({});
            expect(fileTree.rootNode.collapsed).toBeTruthy();
        });

        it('has a method to add files, which also adds the intermediary directories', function () {
            fileTree.addFile(file1);

            expect(fileTree.rootNode.children.tata).not.toBeUndefined();
            expect(fileTree.rootNode.children.tata.isDirectory).toBeTruthy();
            expect(fileTree.rootNode.children.tata.collapsed).toBeTruthy();
            expect(fileTree.rootNode.children.tata.children.tete).not.toBeUndefined();

            expect(fileTree.rootNode.children.tata.children.tete.children.toto).not.toBeUndefined();
            expect(fileTree.rootNode.children.tata.children.tete.children.toto.isDirectory).toBeFalsy();
            expect(fileTree.rootNode.children.tata.children.tete.children.toto.isFile).toBeTruthy();

            expect(fileTree.rootNode.children.tata.children.tete.children.toto.name).toBe('toto');
            expect(fileTree.rootNode.children.tata.children.tete.children.toto.file.name).toBe('toto');
            expect(fileTree.rootNode.children.tata.children.tete.children.toto.file.basename).toBe('/tata/tete/');
        });

    });
});
