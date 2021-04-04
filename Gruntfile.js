module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec: {
            'app-serve': { cwd: 'app', cmd: 'ionic serve' },
            'app-version-patch': { cwd: 'app', cmd: 'npm version patch' },
            'app-version-minor': { cwd: 'app', cmd: 'npm version minor' },
            'app-version-major': { cwd: 'app', cmd: 'npm version major' },
            'app-version-patch-root': { cwd: '.', cmd: 'npm version patch' },
            'app-version-minor-root': { cwd: '.', cmd: 'npm version minor' },
            'app-version-major-root': { cwd: '.', cmd: 'npm version major' },
            'app-apply-version': { cwd: 'app', cmd: 'node ./replace.build.js' },
            'app-clean-apikey': { cwd: 'app', cmd: 'node ./clean.apikey.js' },
            'commit-version': { cwd: 'app', cmd: 'git commit -a -m "version"' },
            'git-tag': { cwd: 'app', cmd: 'git tag' },
            'app-build': { cwd: 'app', cmd: 'ionic build --prod --service-worker' },
            'function-build': { cwd: 'functions', cmd: 'npm run build' },
            'deploy-app': { cwd: '.', cmd: 'firebase deploy' },
            'set-target-deploy-www': { cwd: '.', cmd: 'firebase target:apply hosting  www coachreferee-site' },
            'set-target-deploy-app': { cwd: '.', cmd: 'firebase target:apply hosting  app refcoach-676e3' },
            'deploy-www': { cwd: 'hosting', cmd: 'firebase deploy --only hosting:www' },
            'deploy-function': { cwd: 'functions', cmd: 'firebase deploy --only functions' },
            'delete-help': { cwd: '.', cmd: 'rm -rf html' },
            'show-function-env': { cwd: 'functions', cmd: 'firebase functions:config:get' },
            'set-function-env': { cwd: 'functions', cmd: 'firebase functions:config:set gmail.email=coachreferee@gmail.com' }
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
    });
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-copy');
    grunt.loadNpmTasks('grunt-git-tag');

    grunt.registerTask('app-build', 'Build the app', ['exec:app-build']);

    grunt.registerTask('app-deploy-patch', 'Upgrade to next patch version, commit, build, deploy the app only', [
        'exec:app-version-patch-root',
        'exec:app-version-patch',
        'exec:app-apply-version',
        'exec:app-build',
        'exec:set-target-deploy-app',
        'exec:deploy-app',
        'exec:set-target-deploy-www',
        'exec:deploy-www',
        'exec:set-target-deploy-app',
        'exec:app-clean-apikey',
        'exec:commit-version'
    ]);
    grunt.registerTask('app-deploy-minor', 'Upgrade to next minor version, commit, build, deploy the app only', [
        'exec:app-version-minor-root',
        'exec:app-version-minor',
        'exec:app-apply-version',
        'exec:app-build',
        'exec:set-target-deploy-app',
        'exec:deploy-app',
        'exec:set-target-deploy-www',
        'exec:deploy-www',
        'exec:set-target-deploy-app',
        'exec:app-clean-apikey',
        'exec:commit-version'
    ]);
    grunt.registerTask('app-deploy-major', 'Upgrade to next major version, commit, build, deploy the app only', [
        'exec:app-version-major-root',
        'exec:app-version-major',
        'exec:app-apply-version',
        'exec:app-build',
        'exec:set-target-deploy-app',
        'exec:deploy-app',
        'exec:set-target-deploy-www',
        'exec:deploy-www',
        'exec:set-target-deploy-app',
        'exec:app-clean-apikey',
        'exec:commit-version'
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

    grunt.registerTask('gitag', 'Commit and tag', [
        'git_tag'
    ]);
    grunt.registerTask('help', 'Generate Help on web site', [
        'markdown:www-help-build'
    ]);
}