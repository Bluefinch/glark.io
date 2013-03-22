'use strict';

/* Filters */

angular.module('glark.filters', [])
    .filter('basename', function() {
        return function(input) {
            var pos1 = input.lastIndexOf("\\");
            var pos2 = input.lastIndexOf("/");
            var pos = pos1;
            if(pos < pos2) {
                pos = pos2;
            }
            return input.substring(0, pos + 1);
        }
    })

    .filter('filename', function() {
        return function(input) {
            return input.replace(/^.*[\\\/]/, '');
        }
    });
