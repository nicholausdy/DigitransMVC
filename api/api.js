const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cors = require('cors');

const UserController = require('./controllers/UserController');
const QuestionnaireController = require('./controllers/QuestionnaireController');
const config = require('../config/index');
const QuestionController = require('./controllers/QuestionController');

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
    const questionController = new QuestionController(req, res)
    await questionController.createQuestions();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.name, detail: error.message });
  }
});

server.listen(config.port, () => {
  console.log('Maid cafe running on port '.concat(config.port));
});
