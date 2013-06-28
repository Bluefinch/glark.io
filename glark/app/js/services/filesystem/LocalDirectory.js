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
        var createEntries = function (localDirectory, directoryEntry, callback) {
            var directoryReader = directoryEntry.createReader();
            directoryReader.readEntries(function (entries) {
                var children = {};
                for (var i = 0; i < entries.length; ++i) {
                    var entry = entries[i];
                    if (entry.isFile) {
                        children[entry.name] = new LocalFile(localDirectory, entry.name, entry);
                    } else if (entry.isDirectory) {
                        children[entry.name] = new LocalDirectory(localDirectory, entry.name, entry);
                    }
                }
                callback(children);
            }, function (err) {
                console.log('Error in LocalDirectory createEntries method: ' + err);
                /* Error, return an empty list. */
                callback([]);
            });
        };

        var LocalDirectory = function (parentDirectory, name, directoryEntry) {
            AbstractDirectory.call(this, parentDirectory, name);

            var readyDefered = $q.defer();
            this.readyPromise = readyDefered.promise;

            /* If the directoryEntry is not undefined, we
             * read the content and we fill the children
             * collection with the services.filesystem.*Local
             * objects. */
            var _this = this;
            if (directoryEntry !== undefined) {
                createEntries(_this, directoryEntry, function (children) {
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
            entry.setParentDirectory(this);
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
