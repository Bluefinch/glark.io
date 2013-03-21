'use strict';

angular.module('glark', ['glark.controllers', 'glark.directives', 'glark.filters', 'glark.services'])
    .run(function($rootScope, editor) {
        var KEY = {};
        // create key map A - Z
        for (var i = 65; i <= 90; i++) {
            KEY[String.fromCharCode(i).toUpperCase()] = i;
        }

        var applyEvent = function(eventName, event) {
            event.preventDefault();
            $rootScope.$apply(function() {
                $rootScope.$broadcast(eventName);
            });
        };

        document.addEventListener('keydown', function(event) {

            // ESC
            if (event.keyCode === 27) {
                applyEvent('escape', event);
                return;
            }

            if (!event.metaKey && !event.ctrlKey) {
                return;
            }

            switch (event.keyCode) {
                case KEY.S:
                    return applyEvent('save', event);
            }
        });
    });
