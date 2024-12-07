const net = require('net');

function findAvailablePort(startPort) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        
        server.listen(startPort, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                // Porta está em uso, tenta a próxima
                findAvailablePort(startPort + 1)
                    .then(resolve)
                    .catch(reject);
            } else {
                reject(err);
            }
        });
    });
}

module.exports = { findAvailablePort };
