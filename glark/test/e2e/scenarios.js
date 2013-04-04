'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('glark.io', function () {

    it('should automatically redirect to main editor page when location hash/fragment is empty', function () {
        browser().navigateTo('./app/index.html');
        expect(browser().location().url()).toBe('');
    });

    it('should automatically redirect to main editor page when location hash/fragment is something', function () {
        browser().navigateTo('/somethingsilly');
        expect(browser().location().url()).toBe('');
    });


    describe('Main editor', function () {

        beforeEach(function () {
            browser().navigateTo('/');
        });

        it('should have ace editor loaded just after initialization', function () {
            expect(element('.ace_editor').count()).toBe(1);
        });

        it('should have a tab with the "welcome.md" title', function () {
            expect(element('.file-name').text()).toBe('welcome.md');
        });

        it('tab with title "welcome.md" should be active', function () {
            expect(element('.active-true .file-name').text()).toBe('welcome.md');
        });

        //TODO test that the file has mode 'markdown'.

        it('clicking on "close" icon should close the tab', function () {
            element('.tab-item .close').click();
            expect(element('.tab-item').count()).toBe(0);
        });

    });

    describe('The file tree in left pane', function () {

        beforeEach(function () {
            browser().navigateTo('/');
        });

        it('should contain a file with name "welcome.md"', function () {
            expect(element('#filetree a').attr('title')).toBe('welcome.md');
        });

        it('should contain 6 entries', function () {
            element('#e2e-tests-initializer a').click();
            expect(element('#filetree a').count()).toBe(6);
        });

    });

});
