const replace = require('replace-in-file');

// ================================================= //
// Replace the version number in environment.prod.ts //
// ================================================= //
const pkg = require("../package.json");
const buildVersion = pkg.version + '-' + new Date().toISOString();

const versionOptions = {
    files: 'src/environments/environment.*.nogit.ts',
    from: /version: '(.*)'/g,
    to: "version: '" + buildVersion + "'",
    allowEmptyPaths: false,
};

try {
    let changedFiles = replace.sync(versionOptions);
    if (changedFiles == 0) {
        throw new Error("Please make sure that file '" + options.files + "' has \"version: ''\"");
    }
    console.log('Build version set: ' + buildVersion);
} catch (error) {
    console.error('Error occurred:', error);
    throw error;
}