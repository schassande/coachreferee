var replace = require('replace-in-file');

// ========================================== //
// Replace the api key in environment.prod.ts //
// ========================================== //
var apiKey = 'XXXXXXXXXXXXXXXXXXXXX';
const apiKeyOptions = {
    files: 'src/environments/environment.prod.ts',
    from: /apiKey: '(.*)'/g,
    to: "apiKey: '" + apiKey + "'",
    allowEmptyPaths: false,
};
try {
    let changedFiles = replace.sync(apiKeyOptions);
    if (changedFiles == 0) {
        throw "Please make sure that file '" + options.files + "' has \"apiKey: ''\"";
    }
    console.log('Api Key set: ' + apiKey);
} catch (error) {
    console.error('Error occurred:', error);
    throw error;
}