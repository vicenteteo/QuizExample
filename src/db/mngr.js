const model = require('./model');
const exp = module.exports = {};

process.env.DbUser = 'root';
process.env.DbPassword = 'root';

function getUser(name, pass, callback) {
  model.User.findOne({
    where: {
      username: name,
      password: pass,
    },
  }).then(callback);
}

function getDashboard(callback) {
  model.User.findAll({
    attributes: ['id', 'username'],
    include: [{
      model: model.QuizStorage,
      attributes: ['answers', 'QuizId'],
      where: {
        answers: {
          $ne: ''
        }
      },
      include: [{
        model: model.Quiz,
        attributes:['question'],
      }],
    }]
  }).then((dashboard) => {
    callback(dashboard);
  });
}

function getQuiz(userId, callback) {
  const quiz = {
    id: 0,
    question: '',
    answers: []
  };

  model.QuizStorage.findAll({
    order: [
      model.Sequelize.fn('RAND'),
    ],
    attributes: ['id', 'QuizId'],
    where: {
      UserId: userId,
      answers: '',
    },
    include: [{
      model: model.Quiz,
      attributes: ['question'],
      include: [{
        model: model.Answer,
        attributes: ['id', 'answer'],
      }]
    }]
  }).then((q) => {
    if (!q) {
      callback(null);
      return;
    }
    callback(q[0]);
  });
}

function init(callback) {
  model.init(callback);
}

function insertQuiz(data) {
  model.Quiz.create({
    question: data.question,
  }).then((q) => {
    if (!data.answers) {
      return;
    }

    data.answers.forEach((a) => {
      model.Answer.create({ answer: a, QuizId: q.id });
    });
    model.User.findAll().then((users) => {
      users.map((user) => {
        model.QuizStorage.create({
          UserId: user.get('id'),
          QuizId: q.get('id'),
        });
      });
    });
  });
}

function saveQuizAnswer(quiz) {
  model.QuizStorage.update(
    {
      answers: JSON.stringify(quiz.answers)
    },
    {
      where: {
        id: quiz.id
      }
    });
}

exp.getUser = getUser;
exp.init = init;
exp.insertQuiz = insertQuiz;
exp.getQuiz = getQuiz;
exp.saveQuizAnswer = saveQuizAnswer;
exp.getDashboard = getDashboard;