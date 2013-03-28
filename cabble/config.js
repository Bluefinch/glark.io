var path = require('path');

module.exports = {
    server: {
        listenPort: 80,                                   // The port on which the server is to listen
        distFolder: path.resolve(__dirname, '../glark/app/')  // The folder that contains the application files
    }
};
