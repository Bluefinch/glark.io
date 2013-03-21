'use strict';

/* Filters */

angular.module('glark.filters', [])
    .filter('filePath', function() {
        return function(input, uppercase) {
            var pos1 = input.lastIndexOf("\\");
            var pos2 = input.lastIndexOf("/");
            var pos = pos1;
            if(pos < pos2) {
                pos = pos2;
            }
            return input.substring(0, pos + 1);
        }
    })

    .filter('fileName', function() {
        return function(input, uppercase) {
            return input.replace(/^.*[\\\/]/, '');
        }
    });
