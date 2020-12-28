const { QueryTypes } = require('sequelize');
const { db } = require('../config/database');
const { publisher } = require('../api/services/publish.service');

class DeletionNotifier {
  static async parallelSender(emailList, type) {
    try {
      const asyncOpList = [];
      for (let i = 0; i < emailList.length; i++) {
        const asyncOp = publisher.publish('mailCall', { email: emailList[i].email, type, token: '' });
        asyncOpList.push(asyncOp);
      }
      const result = await Promise.allSettled(asyncOpList);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async futureDeletionNotifier() {
    try {
      const queryString = `select distinct users.email from users left join subscription 
      on users.email = subscription.email
        left join questionnaire 
      on users.email = questionnaire.email 
        where subscription.email is NULL 
      AND questionnaire_id is not NULL
        AND created_at <= now() - interval'5 days'`; // change to interval'5 days'
      const queryResult = await db.query(queryString, {
        type: QueryTypes.SELECT,
      });
      const result = await DeletionNotifier.parallelSender(queryResult, 'futureDeletionNotification');
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  static async deletionNotifier() {
    try {
      const emailQueryString = `select distinct users.email from users left join subscription 
      on users.email = subscription.email
        left join questionnaire 
      on users.email = questionnaire.email 
        where subscription.email is NULL 
      AND questionnaire_id is not NULL
        AND created_at <= now() - interval'7 days'`; // change to interval'7 days'
      const deleteQueryString = `delete from questionnaire where questionnaire_id in (
        select questionnaire_id from users left join subscription 
          on users.email = subscription.email
        left join questionnaire 
          on users.email = questionnaire.email 
        where subscription.email is NULL 
          AND questionnaire_id is not NULL
          AND created_at <= now() - interval'7 days')`; // change to interval'7 days'
      const emailQueryResult = await db.query(emailQueryString, {
        type: QueryTypes.SELECT,
      });
      const deleteQueryResult = await db.query(deleteQueryString, {
        type: QueryTypes.DELETE,
      });
      const sendResult = await DeletionNotifier.parallelSender(emailQueryResult, 'deletionNotification');
      console.log(sendResult);
    } catch (error) {
      console.log(error);
    }
  }
}

(async () => {
  await DeletionNotifier.futureDeletionNotifier();
  await DeletionNotifier.deletionNotifier();
})();
