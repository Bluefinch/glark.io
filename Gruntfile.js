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
                    ace: false,
                    /* Angular test variables. */
                    browser: false,
                    element: false,
                    /* Jasmine variables. */
                    jasmine: false,
                    it: false,
                    describe: false,
                    expect: false,
                    beforeEach: false
                }
            },
            files: ['Gruntfile.js', 'glark/app/js/**/*.js', 'glark/test/unit/**/*.js', 'glark/test/e2e/**/*.js']
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

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'glark/app/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
