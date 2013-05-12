/* jshint node: true */
var path = require('path');

module.exports = {
    server: {
        listenPort: 3000,                                   // The port on which the server is to listen
        devFolder: path.resolve(__dirname, '../glark/app/'),  // The folder that contains the application files
        distFolder: path.resolve(__dirname, '../glark/dist/')  // The folder that contains the application files
    }
};
