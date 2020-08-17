const NATSConnection = require('../../config/nats');

class NATSPublisher {
  constructor() {
    this.nc = null;
  }

  async connect() {
    try {
      this.nc = await NATSConnection.connect();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async publish(topic, data) {
    try {
      return new Promise((resolve, reject) => {
        this.nc.publish(topic, data, () => {
          resolve();
        });

        this.nc.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = NATSPublisher;
