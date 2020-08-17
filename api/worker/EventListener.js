const NATSConnection = require('../../config/nats');
const MailHandler = require('./MailWorker');

async function natsEventListener() {
  async function consume() {
    const nc = await NATSConnection.connect();
    return new Promise((resolve, reject) => {
      nc.subscribe('mailCall', { queue: 'mailer.workers' }, async (msg) => {
        if (msg) {
          const handler = new MailHandler(msg.email, msg.type, msg.token);
          await handler.send();
          resolve(msg);
        }
        const data = { message: 'Error encountered during connection to NATS server' };
        reject(data);
      });
    });
  }

  try {
    await consume();
  } catch (error) {
    console.log(error);
  }
}

module.exports = natsEventListener;
