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

.factory('LocalDirectory', ['AbstractDirectory', '$rootScope', 'LocalFile', '$q',
    function (AbstractDirectory, $rootScope, LocalFile, $q) {

        /* Read the directoryEntry and create a list of
         * services.filesystem.*Local objects. */
        var createEntries = function (directoryEntry) {
            var defered = $q.defer();
            var directoryReader = directoryEntry.createReader();
            directoryReader.readEntries(function (entries) {
                var children = {};
                for (var i = 0; i < entries.length; ++i) {
                    var entry = entries[i];
                    if (entry.isFile) {
                        children[entry.name] = new LocalFile(entry.name, entry);
                    } else if (entry.isDirectory) {
                        children[entry.name] = new LocalDirectory(entry.name, entry);
                    }
                }
                defered.resolve(children);
                $rootScope.$digest();
            }, function (err) {
                defered.reject(err);
                $rootScope.$digest();
            });
            return defered.promise;
        };

        var LocalDirectory = function (name, directoryEntry) {
            AbstractDirectory.call(this, name);

            var readyDefered = $q.defer();
            this.readyPromise = readyDefered.promise;

            /* If the directoryEntry is not undefined, we
             * read the content and we fill the children
             * collection with the services.filesystem.*Local
             * objects. */
            var _this = this;
            if (directoryEntry !== undefined) {
                var promise = createEntries(directoryEntry);
                promise.then(function (children) {
                    _this.children = children;

                    /* Wait for children to be ready. */
                    var promises = [];
                    angular.forEach(children, function (child) {
                        if (child.isDirectory) {
                            promises.push(child.readyPromise);
                        }
                    });
                    $q.all(promises).then(function () {
                        readyDefered.resolve();
                    });
                });
            } else {
                readyDefered.resolve();
            }

            this.setBasename('/');
        };

        /* LocalDirectory extends AbstractDirectory. */
        LocalDirectory.prototype = Object.create(AbstractDirectory.prototype);
        LocalDirectory.prototype.constructor = LocalDirectory;

        /* --------------------------
         *  Override Methods.
         * -------------------------- */

        LocalDirectory.prototype.onReady = function (callback) {
            this.readyPromise.then(callback);
        };

        LocalDirectory.prototype.updateChildren = function () {
            /* If the LocalDirectory is ready, it is 
             * up to date. */
            return this.readyPromise;
        };

        LocalDirectory.prototype.addEntry = function (entry) {
            var basename = this.isRoot ? '/' : this.basename + this.name + '/';
            entry.setBasename(basename);
            entry.setWorkspaceId(this.workspaceId);
            this.children[entry.name] = entry;

            /* Broadcast event. */
            var _this = this;
            entry.onReady(function () {
                $rootScope.$broadcast('directory.addEntry', {
                    workspaceId: _this.workspaceId,
                    entry: entry
                });
            });
        };

        return LocalDirectory;
    }
]);
