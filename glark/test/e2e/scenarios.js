'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('glark.io', function () {

    it('should create a new session when request hash is empty', function () {
        browser().navigateTo('/');
        expect(browser().window().path()).toMatch(/\/\w{8}$/);
    });

    it('should render an error page request hash does not match an existing session', function () {
        browser().navigateTo('/somethingsilly');
        expect(element('body').text()).toMatch('Error: Invalid session hash somethingsilly');
    });


    describe('Main editor', function () {

        beforeEach(function () {
            browser().navigateTo('/');
            /* Hacky sleep to account for page loading and websocket
             * registering time. */
            sleep(1);
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
            element('.tab-item .tab-close').click();
            expect(element('.tab-item').count()).toBe(0);
        });

    });

    describe('The file tree in left pane', function () {

        beforeEach(function () {
            browser().navigateTo('/');
            /* Hacky sleep to account for page loading and websocket
             * registering time. */
            sleep(1);
        });

        it('should contain a file with name "welcome.md"', function () {
            expect(element('.filetree a').attr('title')).toBe('welcome.md');
        });

        it('should contain 6 entries', function () {
            element('#e2e-tests-initializer a').click();
            expect(element('.filetree a').count()).toBe(2);
        });

    });

    describe('The add connector modal', function () {

        beforeEach(function () {
            browser().navigateTo('/');
            /* Hacky sleep to account for page loading and websocket
             * registering time. */
            sleep(1);

            /* Close the collaborative session settings modal. */
            input('me.name').enter('Flolagale');
            element('.modal-footer button').click();
            sleep(1);
        });

        it('should open when clicking the cog icon', function () {
            element('#toolbar a').click();
            expect(element('#addConnectorModalLabel').count()).toBe(1);
            expect(element('#addConnectorModalLabel').text()).toBe('Connector settings');
        });

    });

});
