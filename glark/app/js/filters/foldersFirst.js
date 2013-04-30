/* Copyright 2013 Florent Galland & Luc Verdier

This file is part of glark.io.

glark.io is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
at your option) any later version.

glark.io is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with glark.io.  If not, see <http://www.gnu.org/licenses/>. */
'use strict';

angular.module('glark.filters')

    .filter('foldersFirst', function() {
        return function(entries) {
            
            var result = [];
            angular.forEach(entries, function(entry) {
                result.push(entry);
            });
                
            result = result.sort(function(entry1, entry2) {
                if(entry1.isDirectory && entry2.isFile) {
                    return -1;
                }
                if(entry1.isFile && entry2.isDirectory) {
                    return 1;
                }
                if(entry1.isFile && entry2.isFile) {
                    return entry1.name.toLowerCase() > entry2.name.toLowerCase();
                }
                if(entry1.isDirectory && entry2.isDirectory) {
                    return entry1.name.toLowerCase() > entry2.name.toLowerCase();
                }
                
            });
            
            return result;
        };
    });
