/* jshint node: true */
'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                camelcase: true,
                curly: true,
                eqeqeq: true,
                indent: 4,
                latedef: true,
                newcap: true,
                nonew: true,
                undef: true,
                unused: true,
                trailing: true,
                white: true,
                globalstrict: true,
                browser: true,
                jquery: true,
                devel: true,
                globals: {
                    angular: false,
                    ace: false
                }
            },
            all: ['Gruntfile.js', 'glark/app/js/**/*.js']
        },

        concat: {
            options: {
                /* Separator between each concatenated file. */
                separator: ';'
            },
            dist: {
                src: ['glark/app/js/**/*.js'],
                dest: 'glark/app/dist/<%= pkg.name %>.js'
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['jshint', 'concat']);

};
