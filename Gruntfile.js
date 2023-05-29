module.exports = function(grunt) {
    // Project configuration.
    grunt.pkgVer = 'x.x.x';
    grunt.initConfig({
        exec: {
            'app-serve': { cwd: 'app', cmd: 'ionic serve' },
            'app-version-patch-root': { cwd: '.', cmd: 'npm version --no-git-tag-version --allow-same-version patch' },
            'app-version-minor-root': { cwd: '.', cmd: 'npm version --no-git-tag-version --allow-same-version minor' },
            'app-version-major-root': { cwd: '.', cmd: 'npm version --no-git-tag-version --allow-same-version major' },
            'app-version-fromroot': { cwd: 'app', cmd: 'npm version --no-git-tag-version --allow-same-version <%= grunt.pkgVer %>' },
            'app-apply-version': { cwd: 'app', cmd: 'node ./replace.build.js' },
            'app-clean-apikey': { cwd: 'app', cmd: 'node ./clean.apikey.js' },
            'commit-version': { cwd: 'app', cmd: 'git commit -a -m "version <%= grunt.pkgVer %>"' },
            'app-build': { cwd: 'app', cmd: 'ionic build --prod --service-worker' },
            'function-build': { cwd: 'functions', cmd: 'npm run build' },
            'deploy-app': { cwd: '.', cmd: 'firebase deploy' },
            'set-target-deploy-www': { cwd: '.', cmd: 'firebase target:apply hosting  www coachreferee-site' },
            'set-target-deploy-app': { cwd: '.', cmd: 'firebase target:apply hosting  app refcoach-676e3' },
            'deploy-www': { cwd: 'hosting', cmd: 'firebase deploy --only hosting:www' },
            'deploy-function': { cwd: 'functions', cmd: 'firebase deploy --only functions' },
            'delete-help': { cwd: '.', cmd: 'rm -rf html' },
            'show-function-env': { cwd: 'functions', cmd: 'firebase functions:config:get' },
            'set-function-env': { cwd: 'functions', cmd: 'firebase functions:config:set gmail.email=coachreferee@gmail.com' },
            'version': { cwd: 'app', cmd: "echo Version is <%= pkg.version %>" }
        },
        markdown: {
            'www-help-build': { files: [{ expand: true, src: 'app/src/assets/help/*.md', dest: 'html/', ext: '.html' }] }
        },
        copy: {
            copyGeneratedHelp: {
                cwd: 'html/app/src/assets/help',
                src: ['*.html'],
                timestamp: true,
                dest: 'firebase/hosting/www/help/'
            },
            copyHelp: {
                cwd: 'app/src/assets/help',
                src: ['**'],
                timestamp: true,
                dest: 'firebase/hosting/www/help/'
            },
            copyFunctions: {
                cwd: 'firebase/functions/lib/firebase/functions/src/',
                src: ['*.*'],
                timestamp: true,
                dest: 'firebase/functions/lib/',
                expand: true
            }
        },
        gitcommit: {
            task: {
                options: {
                    message: 'Version <%= grunt.pkgVer %>'
                },
                files: {
                    src: ['**']
                }
            }
        },
        gittag: {
            tagVersion: {
                options: {
                    tag: '<%= grunt.pkgVer %>',
                    force: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-git');

    grunt.registerTask('version', 'Version of the application', ['exec:version']);
    grunt.registerTask('app-serve', 'Build the app', ['exec:app-serve']);
    grunt.registerTask('app-build', 'Build the app', ['exec:app-build']);
    grunt.registerTask('loadVersionFromPackage', function () {
        grunt.pkgVer = grunt.file.readJSON('package.json').version;
    }); 
    grunt.registerTask('showVersion', function () {
        grunt.log.writeln('=> ' + grunt.pkgVer);
    }); 
    grunt.registerTask('app-deploy-xxx', 'build, deploy, commit and tag', [
        'loadVersionFromPackage',
        'exec:app-version-fromroot',
        'exec:app-apply-version',
        'exec:app-build',
        'exec:set-target-deploy-app',
        'exec:deploy-app',
        'exec:set-target-deploy-www',
        'exec:deploy-www',
        'exec:set-target-deploy-app',
        'exec:app-clean-apikey',
        'exec:commit-version',
        'gittag:tagVersion'
    ]);
    grunt.registerTask('app-deploy-patch', 'Upgrade to next patch version, build, deploy, commit and tag', [
        'exec:app-version-patch-root',
        'app-deploy-xxx'
    ]);
    grunt.registerTask('app-deploy-minor', 'Upgrade to next patch version, build, deploy, commit and tag', [
        'exec:app-version-minor-root',
        'app-deploy-xxx'
    ]);
    grunt.registerTask('app-deploy-major', 'Upgrade to next patch version, build, deploy, commit and tag', [
        'exec:app-version-major-root',
        'app-deploy-xxx'
    ]);
    grunt.registerTask('function-deploy', 'Deploy the backend function only', [
        'exec:function-build',
        'copy:copyFunctions',
        'exec:deploy-function',
    ]);
    /* TODO deploy function
    lancer la compile ts=> js
    Copy firebase/functions/lib/firebase/functions/src firebase/functions/lib 
    dans firebase lancer firebase deploy --only functions
    */

    grunt.registerTask('www-deploy', 'Deploy the web site only', [
        /*'markdown:www-help-build',
        'copy:copyGeneratedHelp',
        'copy:copyHelp',
        'exec:delete-help', */
        'exec:set-target-deploy-www',
        'exec:deploy-www',
        'exec:set-target-deploy-app'
    ]);

    grunt.registerTask('help', 'Generate Help on web site', [
        'markdown:www-help-build'
    ]);
}