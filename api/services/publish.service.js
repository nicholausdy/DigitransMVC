const NATS = require('nats');
const NATSConnection = require('../../config/nats');

class NATSPublisher {
  constructor() {
    this.nc = null;
    (async () => {
      try {
        this.nc = await NATSConnection.connect();
      } catch (error) {
        throw new Error(error.message);
      }
    })();
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

  async request(topic, data) {
    try {
      return new Promise((resolve, reject) => {
        this.nc.request(topic, data, { max: 1, timeout: 2000 }, (msg) => {
          if (msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT) {
            reject(msg);
          }
          resolve(msg);
        });
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const publisher = new NATSPublisher();

module.exports = { publisher };
