'use strict';

/* jasmine specs for controllers go here */

describe('TabController', function(){
    var tabController;

    beforeEach(function(){
        // Inject the controllers module.
        angular.mock.module('glark.controllers');
        angular.mock.inject(function ($rootScope, $controller) {
            this.scope = $rootScope.$new();
            $controller('TabController', {
                $scope: this.scope
            });

        // tabController = new 
    });


    it('should ....', function() {
        //spec body
    });
});


describe('MyCtrl2', function(){
    var myCtrl2;


    beforeEach(function(){
        myCtrl2 = new MyCtrl2();
    });


    it('should ....', function() {
        //spec body
    });
});
