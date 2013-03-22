'use strict';

/* jasmine specs for filters go here */

describe('The filters', function () {
    debugger;
    var fullPath, filename, basename;

    beforeEach(function () {
        angular.mock.module('glark.filters');
        fullPath = '/glark/cabble/file.io';
        filename = 'file.io';
        basename = '/glark/cabble/';
    });

    describe('The basename filter', function () {

        it('should return the base path of the full file path',
            angular.mock.inject(function (filePath) {
                console.log(fullPath);
                console.log(filePath(fullPath));
                expect(filePath(fullPath)).toBe(basename);
            }));
    });

    describe('The filename filter', function () {

        it('should return the filename of the full file path',
            angular.mock.inject(function (fileName) {
                expect(fileName(fullPath)).toBe(filename);
            }));
    });
});
