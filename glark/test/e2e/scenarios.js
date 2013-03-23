'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('glark.io', function () {

    beforeEach(function () {
        browser().navigateTo('./app/index.html');
    });


    it('should automatically redirect to main editor page when location hash/fragment is empty', function () {
        expect(browser().location().url()).toBe('');
    });

    it('should automatically redirect to main editor page when location hash/fragment is something', function () {
        browser().navigateTo('/somethingsilly')
        expect(browser().location().url()).toBe('');
    });


    describe('Main editor', function () {

        beforeEach(function () {
            browser().navigateTo('/');
        });

        it('after initialization, ace editor must be loaded', function () {
            expect(element('.ace_editor').count()).toBe(1);
        });

    });

});
