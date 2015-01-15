// Generated on 2013-09-05 using generator-angular 0.4.0

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var modRewrite = require('connect-modrewrite');
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

    // get version info from package.json
    var packageObj = {};
    try {
        packageObj.version = require('./package.json').version;
    } catch(e) {

    }
    grunt.initConfig({

        protractor: {
            options: {
                keepAlive: false,
                configFile: "./test/protractor.conf.js"
            },
            singlerun: {},
            auto: {
                keepAlive: true,
                options: {
                    args: {
                        seleniumPort: 4444
                    }
                }
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',   
                commitFiles: ['package.json'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        },
        ngconstant: {
            options: {
                space: '  '
            },

            // targets
            localdev: [
                {
                    dest: '<%= yeoman.app %>/scripts/config.js',
                    wrap: '"use strict";\n\n <%= __ngModule %>',
                    name: 'config',
                    constants: {
                        ENV: 'dev',
                        VERSION: packageObj.version,
                        AUTH_BASE_URL: 'http://cct-dev.highwire.org/svc/global-login',
                        API_BASE_URL: 'http://localhost:8080/cyclades/ccts',
                        BASE_URL: 'http://cct-dev.highwire.org/svc',
                        CITATION_BASE_URL: 'http://services-content-dev-01.highwire.org/extract',
                        MODCATALOG_BASE_URL: 'http://localhost:8080/cyclades/modcatalog',
                        CATALOG_BASE_URL: 'http://localhost:8080/cyclades/catalog',
                        INDEXER_BASE_URL: 'http://hw-search-dev.highwire.org/hwcctsindexing/services/cct',
                        INDEXER_INSTANCE: 'cctadev'

                    }
                }
            ],

            dev: [
                {
                    dest: '<%= yeoman.dist %>/scripts/config.js',
                    wrap: '"use strict";\n\n <%= __ngModule %>',
                    name: 'config',
                    constants: {
                        ENV: 'dev',
                        VERSION: packageObj.version,
                        AUTH_BASE_URL: '/svc/global-login',
                        API_BASE_URL: '/svc/ccts',
                        BASE_URL: '/svc',
                        CITATION_BASE_URL: '/svc/citation',
                        MODCATALOG_BASE_URL: '/svc/modcatalog',
                        CATALOG_BASE_URL: '/svc/catalog',
                        INDEXER_BASE_URL: '/svc/hw-search',
                        INDEXER_INSTANCE: 'cctadev'

                    }
                }
            ],
            qa: [
                {
                    dest: '<%= yeoman.dist %>/scripts/config-qa.js',
                    wrap: '"use strict";\n\n <%= __ngModule %>',
                    name: 'config',
                    constants: {
                        ENV: 'qa',
                        VERSION: packageObj.version,
                        AUTH_BASE_URL: '/svc/global-login',
                        API_BASE_URL: '/svc/ccts',
                        BASE_URL: '/svc',
                        CITATION_BASE_URL: '/svc/citation',
                        MODCATALOG_BASE_URL: '/svc/modcatalog',
                        CATALOG_BASE_URL: '/svc/catalog',
                        INDEXER_BASE_URL: '/svc/hw-search',
                        INDEXER_INSTANCE: 'cctaqa'

                    }
                }
            ],
            prod: [
                {
                    dest: '<%= yeoman.dist %>/scripts/config-prod.js',
                    wrap: '"use strict";\n\n <%= __ngModule %>',
                    name: 'config',
                    constants: {
                        ENV: 'qa',
                        VERSION: packageObj.version,
                        AUTH_BASE_URL: '/svc/global-login',
                        API_BASE_URL: '/svc/ccts',
                        BASE_URL: '/svc',
                        CITATION_BASE_URL: '/svc/citation',
                        MODCATALOG_BASE_URL: '/svc/modcatalog',
                        CATALOG_BASE_URL: '/svc/catalog',
                        INDEXER_BASE_URL: '/svc/hw-search',
                        INDEXER_INSTANCE: 'cctaprod'

                    }
                }
            ]
        },
        yeoman: yeomanConfig,
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer']
            },
//            protractor: {
//                files: ['app/scripts/**/*.js', 'test/e2e/**/*.js'],
//                tasks: ['protractor:auto']
//            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        autoprefixer: {
            options: ['last 1 version'],
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '{,*/}*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },

        shell: {
            options: {
                stdout: true
            },
            selenium: {
                command: './selenium/start',
                options: {
                    stdout: false,
                    async: true
                }
            },
            protractor_install: {
                command: 'node ./node_modules/protractor/bin/install_selenium_standalone'
            },
            npm_install: {
                command: 'npm install'
            },
            bower_install: {
                command: 'node ./node_modules/bower/bin/bower install'
            },
            alphaClean: {
                command: 'ssh netsite@lions.stanford.edu "rm -f /highwire/webapps/cct-alpha/apache/htdocs/*"',
                options: {
                    stdout: true
                }
            },
            alphaSCP: {
                command: 'scp -P 22 -r dist/. "netsite@lions.stanford.edu:/highwire/webapps/cct-alpha/apache/htdocs"',
                options: {
                    stdout: true
                }
            },
            alphaReinstall: {
                command: 'ssh netsite@lions.stanford.edu "/highwire/prodsofts/webapp/bin/modulectl cct-alpha reinstall"',
                options: {
                    stdout: true
                }
            },
            devClean: {
                command: 'ssh netsite@lions.stanford.edu "rm -rf /highwire/webapps/cct-dev/apache/htdocs/*"',
                options: {
                    stdout: true
                }
            },
            devSCP: {
                command: 'scp -P 22 -r dist/. "netsite@lions.stanford.edu:/highwire/webapps/cct-dev/apache/htdocs"',
                options: {
                    stdout: true
                }
            },
            devReinstall: {
                command: 'ssh netsite@lions.stanford.edu "/highwire/prodsofts/webapp/bin/modulectl cct-dev reinstall"',
                options: {
                    stdout: true
                }
            }
        },
        connect: {
            options: {

                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    port: 9000,
                    middleware: function (connect) {
                        return [
                            modRewrite([
                                '!\\.html|\\.js|\\.css|\\.png|\\.ttf|\\.woff|\\.gif|\\.svg$ /index.html [L]'
                            ]),
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app),
                            function(req, res, next) {
                                res.setHeader('Access-Control-Allow-Origin', '*');
                                res.setHeader('Access-Control-Allow-Methods', '*');
                                next();
                            }
                        ];
                    }
                }
            },
            testserver: {
                options: {
                    port: 9999,
                    middleware: function (connect) {
                        return [
                            modRewrite([
                                '!\\.html|\\.js|\\.css|\\.png|\\.ttf|\\.woff|\\.gif|\\.svg$ /index.html [L]'
                            ]),
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9999,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            },
            coverage: {
                options: {
                    base: 'coverage/',
                    port: 5555,
                    keepalive: true
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.livereload.options.port %>'
                //app: 'Chrome'
            },
            devserver: {
                path: 'http://localhost:8888'
            },
            coverage: {
                path: 'http://localhost:5555'
            }
        },

        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ]
        },
        coffee: {
            options: {
                sourceMap: true,
                sourceRoot: ''
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/scripts',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/scripts',
                        ext: '.js'
                    }
                ]
            },
            test: {
                files: [
                    {
                        expand: true,
                        cwd: 'test/spec',
                        src: '{,*/}*.coffee',
                        dest: '.tmp/spec',
                        ext: '.js'
                    }
                ]
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
         dist: {}
         },*/
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg,ico}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.{png,jpg,jpeg}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '{,*/}*.svg',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        cssmin: {
            // By default, your `index.html` <!-- Usemin Block --> will take care of
            // minification. This option is pre-configured if you do not wish to use
            // Usemin blocks.
            // dist: {
            //   files: {
            //     '<%= yeoman.dist %>/styles/main.css': [
            //       '.tmp/styles/{,*/}*.css',
            //       '<%= yeoman.app %>/styles/{,*/}*.css'
            //     ]
            //   }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                     // https://github.com/yeoman/grunt-usemin/issues/44
                     //collapseWhitespace: true,
                     collapseBooleanAttributes: true,
                     removeAttributeQuotes: true,
                     removeRedundantAttributes: true,
                     useShortDoctype: true,
                     removeEmptyAttributes: true,
                     removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: ['*.html', 'views/**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            'bower_components/**/*',
                            'images/{,*/}*.{ico,gif,webp}',
                            'styles/fonts/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: [
                            'generated/*'
                        ]
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        },
        concurrent: {
            server: [
                'coffee:dist',
                'compass:server',
                'copy:styles'
            ],
            test: [
                'coffee',
                'compass',
                'copy:styles'
            ],
            dist: [
                'coffee',
                'compass:dist',
                'copy:styles',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        karma: {
            unit: {
                configFile: './test/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unit_auto: {
                configFile: './test/karma-unit.conf.js',
                autoWatch: true,
                singleRun: false
            },
            unit_coverage: {
                configFile: './test/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true,
                reporters: ['progress', 'coverage'],
                preprocessors: {
                    'app/scripts/**/*.js': ['coverage']
                },
                coverageReporter: {
                    type: 'html',
                    dir: 'coverage/'
                }
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>/scripts',
                        src: '*.js',
                        dest: '<%= yeoman.dist %>/scripts'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                options: {
                    //sourceMap: '<%= yeoman.dist %>/scripts/sourceMap.js',
                    beautify: false, //preserve line breaks in minified files
                    mangle: false
                },
                files: {
                    '<%= yeoman.dist %>/scripts/scripts.js': [
                        '<%= yeoman.dist %>/scripts/scripts.js'
                    ]
                }                
            }

        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'ngconstant:localdev',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });

//    grunt.registerTask('test', [
//        'clean:server',
//        'concurrent:test',
//        'autoprefixer',
//        'connect:test',
//        'karma'
//    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'ngconstant:dev',
        'ngconstant:qa',
        'ngconstant:prod',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'copy:dist',
        //'cdnify',
        'ngmin',
        'cssmin',
        //'uglify', this isn't deploying properly due to minification
        'rev',
        'usemin',
        'shell:devClean',
        'shell:devSCP',
        'shell:devReinstall'
    ]);



    grunt.registerTask('default', [
        'test',
        'build'
    ]);

    //single run tests
    grunt.registerTask('test', ['test:unit', 'test:e2e']);
    grunt.registerTask('test:unit', ['karma:unit']);
    grunt.registerTask('test:e2e', ['connect:livereload', 'protractor:singlerun']);

    //autotest and watch tests
    grunt.registerTask('autotest', ['karma:unit_auto']);
    grunt.registerTask('autotest:unit', ['karma:unit_auto']);
    grunt.registerTask('autotest:e2e', ['connect:livereload', 'shell:selenium', 'watch:protractor']);

    //coverage testing
    grunt.registerTask('test:coverage', ['karma:unit_coverage']);
    grunt.registerTask('coverage', ['karma:unit_coverage', 'open:coverage', 'connect:coverage']);
};
