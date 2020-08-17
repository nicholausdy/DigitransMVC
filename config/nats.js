const NATS = require('nats');
const config = require('./index');

class NATSConnection {
  static async connect() {
    try {
      const nc = NATS.connect({
        url: config.natsIP,
        json: true,
      });
      return new Promise((resolve, reject) => {
        nc.on('connect', (nc) => {
          console.log(`natpublish - Connected to ${nc.currentServer.url.host}`)
          resolve(nc);
        });

        nc.on('error', (err) => {
          reject(err);
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = NATSConnection;
