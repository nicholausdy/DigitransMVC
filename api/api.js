const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');

const UserController = require('./controllers/UserController');
const SubscriptionController = require('./controllers/SubscriptionController');
const QuestionnaireController = require('./controllers/QuestionnaireController');
const config = require('../config/index');
const QuestionController = require('./controllers/QuestionController');
const AnswerController = require('./controllers/AnswerController');
const ChartController = require('./controllers/ChartController');
const StatisticController = require('./controllers/StatisticController');

const app = express();
const server = http.Server(app);

app.use(cors());

app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/public/user/register', async (req, res) => {
  try {
    const userController = new UserController(req, res);
    await userController.register();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.get('/private/user/verification/:token', async(req, res) => {
  try {
    const userController = new UserController(req, res);
    await userController.verify();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/public/user/login', async(req, res) => {
  try {
    const userController = new UserController(req, res);
    await userController.login();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/user/subscription', async(req, res) => {
  try {
    const subscriptionController = new SubscriptionController(req, res);
    await subscriptionController.createSubscription();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.delete('/private/user/subscription', async(req, res) => {
  try {
    const subscriptionController = new SubscriptionController(req, res);
    await subscriptionController.deleteSubscription();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/user/getSubscription', async(req, res) => {
  try {
    const subscriptionController = new SubscriptionController(req, res);
    await subscriptionController.getSubscription();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/questionnaire', async (req, res) => {
  try {
    const questionnaireController = new QuestionnaireController(req, res)
    await questionnaireController.createQuestionnaire();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.put('/private/questionnaire', async (req, res) => {
  try {
    const questionnaireController = new QuestionnaireController(req, res)
    await questionnaireController.updateQuestionnaire();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/questions', async (req, res) => {
  try {
    const questionController = new QuestionController(req, res);
    await questionController.createQuestions(false);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/optionstoquestionsmap', async (req, res) => {
  try {
    const questionController = new QuestionController(req, res);
    await questionController.insertOptionsToQuestionsMap();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.put('/private/questions', async (req, res) => {
  try {
    const questionController = new QuestionController(req, res);
    await questionController.createQuestions(true);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/getQuestionnaires', async (req, res) => {
  try {
    const questionnaireController = new QuestionnaireController(req, res)
    await questionnaireController.getQuestionnaire();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/public/getQuestionnaireById', async (req, res) => {
  try {
    const questionnaireController = new QuestionnaireController(req, res)
    await questionnaireController.getQuestionnaireById();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.delete('/private/deleteQuestionnaireById', async (req, res) => {
  try {
    const questionnaireController = new QuestionnaireController(req, res);
    await questionnaireController.deleteQuestionnaireById();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/getQuestions', async (req, res) => {
  try {
    const questionController = new QuestionController(req, res);
    await questionController.getQuestions();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/public/getOptionsToQuestionsMap', async (req, res) => {
  try {
    const mappingController = new QuestionController(req, res);
    await mappingController.getOptionsToQuestionsMap();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.delete('/private/deleteOptionsToQuestionsMap', async (req, res) => {
  try {
    const mappingController = new QuestionController(req, res);
    await mappingController.deleteOptionsToQuestionsMap();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/public/answer', async (req, res) => {
  try {
    const answerController = new AnswerController(req, res);
    await answerController.answer();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/getAnswer', async (req, res) => {
  try {
    const answerController = new AnswerController(req, res);
    await answerController.getSingleAnswer();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/getScores', async (req, res) => {
  try {
    const answerController = new AnswerController(req, res);
    await answerController.getScores();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/getChart', async (req, res) => {
  try {
    const chartController = new ChartController(req, res);
    await chartController.readChart();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/getStatistic', async (req, res) => {
  try {
    const statController = new StatisticController(req, res);
    await statController.requestStat();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/getSpreadsheet', async (req, res) => {
  try {
    const statController = new StatisticController(req, res);
    await statController.requestSpreadsheet();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/getMinimumSampleSize', async (req, res) => {
  try {
    const statController = new StatisticController(req, res);
    await statController.requestMinSampleSize();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/getCronbachAlpha', async (req, res) => {
  try {
    const statController = new StatisticController(req, res);
    await statController.requestCronbach();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

app.post('/private/shareQuestionnaire', async (req, res) => {
  try {
    const questionnaireController = new QuestionnaireController(req, res);
    await questionnaireController.shareQuestionnaire();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

server.listen(config.port, () => {
  console.log('Maid cafe running on port '.concat(config.port));
});
