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

angular.module('glark.services')

    .factory('LocalDirectory', function ($rootScope, LocalFile, $q) {
        
        var createEntries = function (directoryEntry) {
            var defered = $q.defer();
            var directoryReader = directoryEntry.createReader();
            directoryReader.readEntries(function (entries) {
                var children = [];
                for (var i = 0; i < entries.length; ++i) {
                    var entry = entries[i];
                    if (entry.isFile) {
                        children.push(new LocalFile(entry));
                    } else if (entry.isDirectory) {
                        children.push(new LocalDirectory(entry.name, entry));
                    }
                }
                defered.resolve(children);
                $rootScope.$apply();
            }, function (err) {
                defered.reject(err);
                $rootScope.$apply();
            });
            return defered.promise;
        }
        
        var LocalDirectory = function (name, directoryEntry) {
            this.isDirectory = true;
            this.isFile = false;
            
            this.name = name;
            this.basename = '/';
            
            this.collapsed = true;
            this.children = [];
            
            var _this = this;
            if(directoryEntry !== undefined) {
                var promise = createEntries(directoryEntry);
                promise.then(function (children) {
                    _this.children = children;
                });
            }
        };
                
        LocalDirectory.prototype.updateChildren = function() {
            var defered = $q.defer();
            defered.resolve();
            return defered.promise;
        }
        
        LocalDirectory.prototype.addEntry = function (entry) {
            entry.basename = this.basename + this.name + '/';
            this.children.push(entry);
        };
        
        return LocalDirectory;
    });

