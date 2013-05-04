'use strict';

/* jasmine specs for services go here */

describe('The services:', function () {

    beforeEach(function () {
        angular.mock.module('glark.services');
        angular.mock.module('glark.filters');

        var mockEditor = { setSession: jasmine.createSpy() };
        var mockSession = { setValue: jasmine.createSpy() };

        angular.mock.module(function ($provide) {
            $provide.value('EditSession', mockSession);
            $provide.value('editor', mockEditor);
        });

    });

    describe('The LocalDirectory', function () {
        var localDirectory, file1, file1bis, file2, file3;

        beforeEach(angular.mock.inject(function (LocalDirectory, LocalFile) {
                localDirectory = new LocalDirectory('root');

                file1 = new LocalFile("tata", {});
                file1bis = new LocalFile("tata", {});
                file2 = new LocalFile("titi", {});
                file3 = new LocalFile("toto", {});
            })
        );

        it('is a directory and not a file', function () {
            expect(localDirectory.isDirectory).toBeTruthy();
            expect(localDirectory.isFile).toBeFalsy();
        });

        it('has a name and basename', function () {
            expect(localDirectory.name).toBe('root');
            expect(localDirectory.basename).toBe('/');
        });

        it('has a children collection', function () {
            expect(localDirectory.children).toEqual({});
        });

        it('has a method to add entries to its children and another one to count them', function () {
            localDirectory.addEntry(file1);
            localDirectory.addEntry(file2);
            localDirectory.addEntry(file3);

            expect(localDirectory.getChildCount()).toBe(3);
        });

        it('has only one child with the same name', function () {
            localDirectory.addEntry(file1);
            localDirectory.addEntry(file1);
            localDirectory.addEntry(file1bis);

            expect(localDirectory.getChildCount()).toBe(1);
        });

        it('erase an existing child with the same name', function () {
            localDirectory.addEntry(file1);
            localDirectory.addEntry(file1bis);

            expect(localDirectory.children[file1.name]).not.toBe(file1);
            expect(localDirectory.children[file1.name]).toBe(file1bis);
        });

    });

    describe('The base64 encoder/decoder', function () {
        it('should be able to encode a string in base 64',
            angular.mock.inject(function (base64) {
                var toEncode = 'username:password';
                var encoded = base64.encode(toEncode);
                expect(encoded).toBe('dXNlcm5hbWU6cGFzc3dvcmQ=');
            }));

        it('should be able to decode a string encoded in base 64',
            angular.mock.inject(function (base64) {
                var toDecode = 'dXNlcm5hbWU6cGFzc3dvcmQ=';
                var decoded = base64.decode(toDecode);
                expect(decoded).toBe('username:password');
            }));
    });
});
