var replace = require('replace-in-file');
var DateTime = require('luxon').DateTime;
var package = require('./package.json');
var version = package.version;
var timestamp = DateTime.now().toISO();
var versionOptions = {
  files: 'src/app/client-version.ts',
  from: /version: '(.*)'/g,
  to: `version: '${version}'`,
  allowEmptyPaths: false
};
var builtOptions = {
  files: 'src/app/client-version.ts',
  from: /timestamp: '(.*)'/g,
  to: `timestamp: '${timestamp}'`,
  allowEmptyPaths: false
};

try {
  let changedFiles = replace.sync(versionOptions);
  if (changedFiles == 0) {
    throw (
      "Please make sure that file '" + options.files + "' has \"version: ''\""
    );
  }
  changedFiles = replace.sync(builtOptions);
  if (changedFiles == 0) {
    throw (
      "Please make sure that file '" + options.files + "' has \"timestamp: ''\""
    );
  }
  console.log(`Build version set: ${version} - ${timestamp}`);
} catch (error) {
  console.error('Error occurred:', error);
  throw error;
}
