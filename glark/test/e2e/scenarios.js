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

        describe('Tabs', function () {

            beforeEach(function () {
                /* Get the scope and some services. */
                var $scope = angular.element('body').scope();
                var workspace = angular.element('body').injector().get('workspace');
                var File = angular.element('body').injector().get('File');

                /* Create a Blob mocking a File. */
                var fileEntry = new Blob(["/* I'm a javascript file. */"], {type: "text"});
                fileEntry.name = "mockFile.js";
                var mockedFile = new File(fileEntry);

                /* Add it to the workspace. */
                $scope.$apply(workspace.addFile(mockedFile));
            });

            it('should have tab with the "mockedfile.js" title', function () {
                expect(element('.file-name').text()).toBe('mockFile.js');
                // expect(true).toBeTruthy();
            });

        });

    });

});
