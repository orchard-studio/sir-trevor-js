/*global module:false*/
module.exports = function(grunt) {

  var banner = ['/*!',
                 ' * Sir Trevor JS v<%= pkg.version %>',
                 ' *',
                 ' * Released under the MIT license',
                 ' * www.opensource.org/licenses/MIT',
                 ' *',
                 ' * <%= grunt.template.today("yyyy-mm-dd") %>',
                 ' */\n\n'
                ].join("\n");

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-exec');

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    exec: {
      'fontello-open': {
        cmd: './node_modules/fontello-cli/bin/fontello-cli open --config src/icons/config.json --css ./src/icons/css/ --font src/icons/font'
      },
      'fontello-install': {
        cmd: './node_modules/fontello-cli/bin/fontello-cli install --config src/icons/config.json --css ./src/icons/css/ --font src/icons/font'
      }
    },

    'jasmine' : {
      'sir-trevor': {
        src : 'sir-trevor.js',
        options: {
          vendor: ['components/jquery/jquery.js',
                   'components/underscore/underscore.js',
                   'components/Eventable/eventable.js'],
          specs : 'spec/javascripts/**/*.spec.js',
          helpers : 'spec/helpers/*.js'
        }
      }
    },

    rig: {
      build: {
        options: {
          banner: banner
        },
        files: {
          'sir-trevor.js': ['src/sir-trevor.js']
        }
      }
    },

    uglify: {
      options: {
        mangle: false,
        banner: banner
      },
      standard: {
        files: {
          'sir-trevor.min.js': ['sir-trevor.js']
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/*.js', 'src/**/*.js', 'src/sass/*.scss'],
        tasks: ['sass', 'rig']
      }
    },

    jshint: {
      all: ['sir-trevor.js'],

      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        _: true,
        console: true
      }
    },

    sass: {
      dist: {
        files: {
          'sir-trevor.css': 'src/sass/main.scss',
          'sir-trevor-icons.css': 'src/sass/icons.scss'
        }
      }
    }

  });

  // Default task.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('travis', ['rig', 'jasmine']);

  grunt.registerTask('default', ['sass', 'rig', 'uglify', 'jasmine']);

  grunt.registerTask('jasmine-browser', ['server','watch']);

  grunt.registerTask('fontello:open', ['exec:fontello-open']);
  grunt.registerTask('fontello:install', ['exec:fontello-install']);

};
