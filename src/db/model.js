const mysql = require('mysql');
const Sequelize = require('sequelize');
let sequelize = null;
let initCallback = null;
let hasInitialized = false;
const exp = module.exports = {
  err: 0,
};

function initDBModel() {
  let user = null;
  let quiz = null;
  let answer = null;
  let quizStorage = null;

  sequelize = new Sequelize('sumome', process.env.DbUser, process.env.DbPassword, {
    dialect: 'mysql',
    port: 3306,
    logging: false,
  });

  user = sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    type:{
     type: Sequelize.STRING,
     defaultValue: 'anonymous',    
    },
  });
  
  quizStorage = sequelize.define('QuizStorage', {
    answers: { 
      type: Sequelize.STRING,
      defaultValue: '',
    }
  });

  quiz = sequelize.define('Quiz', {
    question: Sequelize.STRING,
  });

  answer = sequelize.define('Answer', {
    answer: Sequelize.STRING,
  });

  answer.belongsTo(quiz);
  quiz.hasMany(answer);
  quizStorage.belongsTo(user);
  quizStorage.belongsTo(quiz);
  user.hasMany(quizStorage);

  exp.User = user;
  exp.Quiz = quiz;
  exp.Answer = answer;
  exp.QuizStorage = quizStorage;

  sequelize.authenticate().then(() => {
    sequelize.sync({ force: false}).then(() => {
      user.create({
        username: 'guest1',
        password: 'guest',
        type:'registered',
      });
      user.create({
        username: 'guest2',
        password: 'guest',
        type:'registered',
      });
      user.create({
        username: 'admin',
        password: 'admin',
        type: 'admin'
      });
    }, (err) => {
      console.log('Fail to sync database model', err);
    });
    console.log('Connection was established with success!!!');

    if (initCallback) {
      initCallback(exp.err);
    }
  }, (err) => {
    exp.err = -1;
    console.log('Fail to sync database model', err);

    if (initCallback) {
      initCallback(exp.err);
    }

    return;
  });
}

function init(callback) {
  if (hasInitialized === true) {
    callback();
    return;
  }

  initCallback = callback;
  hasInitialized = true;

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
  });

  connection.connect((err) => {
    if (err) {
      console.log('error connecting: ', err);
      return;
    }

    connection.query('CREATE DATABASE IF NOT EXISTS sumome;', (err2) => {
      if (err2) {
        exp.err = -1;
        console.error('error connecting: ', err2);
        initCallback(exp.err);
        return;
      }
      connection.end();
      initDBModel();
    });
  });
}

exp.init = init;
exp.Sequelize = Sequelize;
