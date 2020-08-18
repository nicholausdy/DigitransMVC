const NATSConnection = require('../../config/nats');
const MailHandler = require('./MailWorker');
const ScoreHandler = require('./ScoreWorker');

async function natsEventListener() {
  async function consume() {
    const nc = await NATSConnection.connect();
    return new Promise((resolve, reject) => {
      nc.subscribe('mailCall', { queue: 'mailer.workers' }, async (msg) => {
        if (msg) {
          console.log(msg.email);
          const handler = new MailHandler(msg.email, msg.type, msg.token);
          await handler.send();
          resolve(msg);
        }
        const data = { message: 'Error encountered during connection to NATS server' };
        reject(data);
      });

      nc.subscribe('scoreCall', { queue: 'score.workers'}, async (msg) => {
        if (msg) {
          console.log(msg);
          const handler = new ScoreHandler(msg);
          await handler.calculate();
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

natsEventListener();

module.exports = natsEventListener;
