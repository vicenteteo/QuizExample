const express = require('express');
const session = require('express-session');
const SessionStore = require('express-mysql-session')(session);
const services = require('./src/services');
const bodyParser = require('body-parser');
const app = express();

function setupSession() {
  app.use(session({
    key: 'quiz_example_key',
    secret: 'quiz_example_secret',
    store: new SessionStore({
      host: 'localhost',
      port: 3306,
      user: process.env.DbUser,
      password: process.env.DbPassword,
      database: 'quiz_example',
    }),
    resave: true,
    saveUninitialized: true,
  }));
}

function startup() {
  setupSession();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(express.static('public'));
  app.use('/node_modules', express.static('node_modules'));
  app.use('/common', express.static('common'));

  app.use(services.resetState);
  app.get('/', services.index);
  app.post('/authenticate', services.authenticate);
  app.get('/checkuser', services.checkUser);
  app.get('/signout', services.signout);
  app.get('/createquiz', services.createQuiz);
  app.get('/getquiz', services.getQuiz);
  app.get('/sendquiz', services.sendQuiz);
  app.get('/getdashboard', services.getDashboard);
  app.get('/getusers', services.getUsers);
  app.get('/getquestions', services.getQuestions);
  app.get('/getquizstatistics', services.getQuizStatistics);
  app.use(services.beforeRender);

  console.log('Listening host: localhost port: 8085');
}

services.init((err) => {
  if (err) {
    return;
  }

  app.listen(8085, startup);
});
