/* jshint node: true, camelcase: false */
'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsfiles: [
            'Gruntfile.js',
            'glark/app/js/**/*.js',
            'cabble/**/*.js',
            'glark/test/unit/**/*.js',
            'glark/test/e2e/**/*.js'
        ],

        jsbeautifier: {
            files: ['<%= jsfiles %>'],
            options: {
                space_after_anon_function: true
            }
        },

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
                    io: true,
                    /* Angular test variables. */
                    browser: false,
                    element: false,
                    /* Jasmine variables. */
                    jasmine: false,
                    it: false,
                    describe: false,
                    expect: false,
                    beforeEach: false,
                    sleep: false,
                    input: false
                }
            },
            files: ['<%= jsfiles %>']
        },

        concat: {
            options: {
                /* Separator between each concatenated file. */
                separator: ';'
            },
            js: {
                src: ['glark/app/js/**/*.js'],
                dest: 'glark/dist/js/<%= pkg.name %>.js'
            },
            css: {
                src: ['glark/app/css/*.css'],
                dest: 'glark/dist/css/<%= pkg.name %>.css'
            }
        },

        uglify: {
            options: {
                report: 'min',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'glark/dist/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
                }
            }
        },

        cssmin: {
            options: {
                report: 'min',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            minify: {
                expand: true,
                cwd: 'glark/dist/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'glark/dist/css/',
                ext: '.io.min.css' /* Watch out this bug in ext, had to add io here. */
            }
        },

        /* Generate the release html. */
        targethtml: {
            dist: {
                files: {
                    'glark/dist/index.html': 'glark/app/index.html'
                }
            }
        },

        /* Copy the necessary files in the dist folder. */
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'glark/app/',
                    src: ['css/lib/**'],
                    dest: 'glark/dist/'
                }, {
                    expand: true,
                    cwd: 'glark/app/',
                    src: ['fonts/**'],
                    dest: 'glark/dist/'
                }, {
                    expand: true,
                    cwd: 'glark/app/',
                    src: ['img/**'],
                    dest: 'glark/dist/'
                }, {
                    expand: true,
                    cwd: 'glark/app/',
                    src: ['lib/**'],
                    dest: 'glark/dist/'
                }, {
                    expand: true,
                    cwd: 'glark/app/',
                    src: ['partials/**'],
                    dest: 'glark/dist/'
                }]
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jsbeautifier', 'jshint']
        }
    });

    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-targethtml');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jsbeautifier', 'jshint', 'concat', 'uglify', 'cssmin', 'targethtml', 'copy']);

};
