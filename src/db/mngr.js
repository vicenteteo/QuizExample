const model = require('./model');
const exp = module.exports = {};
process.env.DbUser = 'root';
process.env.DbPassword = 'root';

function getUser(name, pass, callback) {
  model.User.findOne({
    where: {
      name,
      password: pass,
    },
  }).then(callback);
}

function getUsers(callback) {
  const users = [];
  model.User.findAll({
    attributes: ['id', 'name'],
  }).then((u) => {
    for (let i = 0; i < u.length; i++) {
      if (u[i].name !== 'admin') {
        users.push(u[i]);
      }
    }
    callback(users);
  });
}

function getDashboard(callback) {
  model.User.findAll({
    attributes: ['id', 'name'],
    include: [{
      model: model.QuizStorage,
      attributes: ['answers', 'QuizId'],
      where: {
        answers: {
          $ne: '',
        },
      },
      include: [{
        model: model.Quiz,
        attributes: ['question'],
      }],
    }],
  }).then((dashboard) => {
    callback(dashboard);
  });
}

function getQuestions(callback) {
  model.Quiz.findAll({
    attributes: ['id', ['question', 'label']],
  }).then(callback);
}

function getQuizStatistics(quizId, callback) {
  model.Quiz.findOne({
    attributes: ['total'],
    where: {
      id: quizId,
    },
    include: {
      model: model.Answer,
      attributes: ['total', 'answer'],
    },
  }).then(callback);
}

function getQuiz(userId, isAnonymous, callback) {
  const where = {
    userId,
  };

  if (isAnonymous === false) {
    where.answers = '';
  }

  model.QuizStorage.findAll({
    order: [
      model.Sequelize.fn('RAND'),
    ],
    attributes: ['id', 'QuizId'],
    where,
    include: [{
      model: model.Quiz,
      attributes: ['question'],
      include: [{
        model: model.Answer,
        attributes: ['id', 'answer'],
      }],
    }],
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
        return user;
      });
    });
  });
}

function saveQuizAnswer(quiz) {
  model.QuizStorage.update(
    {
      answers: JSON.stringify(quiz.answers),
    },
    {
      where: {
        id: quiz.id,
      },
    }).then(() => {
      model.QuizStorage.findOne({
        attributes: ['QuizId'],
        where: {
          id: quiz.id,
        },
      }).then((q) => {
        model.Quiz.findOne({
          attributes: ['id', 'total'],
          where: {
            id: q.QuizId,
          },
          include: [{
            model: model.Answer,
            attributes: ['id', 'total'],
          }],

        }).then((totals) => {
          totals.increment('total');
          for (let i = 0; i < totals.Answers.length; i++) {
            for (let ii = 0; ii < quiz.answers.length; ii++) {
              if (totals.Answers[i].get('id') === parseInt(quiz.answers[ii], 10)) {
                totals.Answers[i].increment('total');
              }
            }
          }
        });
      });
    });
}

function getAnonymousId(callback) {
  model.User.findOne({
    attributes: ['id'],
    where: {
      type: 'anonymous',
      name: 'anonymous',
    },
  }).then(callback);
}

exp.getUser = getUser;
exp.init = init;
exp.insertQuiz = insertQuiz;
exp.getQuiz = getQuiz;
exp.saveQuizAnswer = saveQuizAnswer;
exp.getDashboard = getDashboard;
exp.getUsers = getUsers;
exp.getQuestions = getQuestions;
exp.getQuizStatistics = getQuizStatistics;
exp.getAnonymousId = getAnonymousId;

