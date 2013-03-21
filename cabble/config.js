path = require('path');

module.exports = {
  server: {
    listenPort: 3000,                                   // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
    distFolder: path.resolve(__dirname, '../glark'),  // The folder that contains the application files (note that the files are in a different repository) - relative to this file
  }
};
