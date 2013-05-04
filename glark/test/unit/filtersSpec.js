'use strict';

/* jasmine specs for filters go here */

describe('The filters:', function () {
    var fullPath, filename, basename;

    beforeEach(function () {
        angular.mock.module('glark.filters');
        fullPath = '/glark/cabble/file.io';
        filename = 'file.io';
        basename = '/glark/cabble/';
    });

    describe('The basename filter', function () {

        it('should return the base path of the full file path',
            angular.mock.inject(function (basenameFilter) {
                expect(basenameFilter(fullPath)).toBe(basename);
            }));
    });

    describe('The filename filter', function () {

        it('should return the filename of the full file path',
            angular.mock.inject(function (filenameFilter) {
                expect(filenameFilter(fullPath)).toBe(filename);
            }));
    });
});
