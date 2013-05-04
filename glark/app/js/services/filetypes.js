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

    .factory('filetypes', function () {
        
        // https://github.com/ajaxorg/ace/blob/master/demo/kitchen-sink/demo.js#L68
        var aceModes = {
            coffee:     ["CoffeeScript" , "coffee"],
            coldfusion: ["ColdFusion"   , "cfm"],
            csharp:     ["C#"           , "cs"],
            css:        ["CSS"          , "css"],
            diff:       ["Diff"         , "diff|patch"],
            golang:     ["Go"           , "go"],
            groovy:     ["Groovy"       , "groovy"],
            haxe:       ["haXe"         , "hx"],
            html:       ["HTML"         , "htm|html|xhtml"],
            c_cpp:      ["C/C++"        , "c|cc|cpp|cxx|h|hh|hpp"],
            clojure:    ["Clojure"      , "clj"],
            java:       ["Java"         , "java"],
            javascript: ["JavaScript"   , "js"],
            json:       ["JSON"         , "json"],
            latex:      ["LaTeX"        , "latex|tex|ltx|bib"],
            less:       ["LESS"         , "less"],
            liquid:     ["Liquid"       , "liquid"],
            lua:        ["Lua"          , "lua"],
            markdown:   ["Markdown"     , "md|markdown"],
            ocaml:      ["OCaml"        , "ml|mli"],
            perl:       ["Perl"         , "pl|pm"],
            pgsql:      ["pgSQL"        , "pgsql"],
            php:        ["PHP"          , "php|phtml"],
            powershell: ["Powershell"   , "ps1"],
            python:     ["Python"       , "py"],
            ruby:       ["Ruby"         , "ru|gemspec|rake|rb"],
            scad:       ["OpenSCAD"     , "scad"],
            scala:      ["Scala"        , "scala"],
            scss:       ["SCSS"         , "scss|sass"],
            sh:         ["SH"           , "sh|bash|bat"],
            sql:        ["SQL"          , "sql"],
            svg:        ["SVG"          , "svg"],
            text:       ["Text"         , "txt"],
            textile:    ["Textile"      , "textile"],
            xml:        ["XML"          , "xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl"],
            xquery:     ["XQuery"       , "xq"],
            yaml:       ["YAML"         , "yaml"]
        };
        
        var ext2mode = {};
        angular.forEach(aceModes, function (value, mode) {
            var extensions = value[1].split('|');
            angular.forEach(extensions, function (extension) {
                ext2mode[extension] = mode;
            });
        });
        
        return {
            getAceModeFromExtension: function (extension) {
                if(ext2mode[extension] !== undefined) {
                    return 'ace/mode/' + ext2mode[extension];
                }
                return 'ace/mode/text';
            }
        };
    });

