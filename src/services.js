const dbMngr = require('./db/mngr');
const exp = module.exports = {};
const result = {
  data: null,
  status: 0,
  message: '',
};

function init(callback) {
  dbMngr.init(callback);
}

function index(req, res, next) {
  res.sendFile('index.html', { root: 'public' });
  next();
}

function getUsers(req, res, next) {
  dbMngr.getUsers((users) => {
    result.data = JSON.stringify(users);
    next();
  });
}


/* eslint-disable no-param-reassign*/
function authenticate(req, res, next) {
  dbMngr.getUser(req.body.user, req.body.password, (user) => {
    if (!user) {
      result.status = -1;
      result.message = 'Invalid credentials';
    } else {
      req.session.userType = user.get('type') || 'anonymous';
      req.session.userId = user.id;
    }

    next();
  });
}

/* eslint-disable no-param-reassign*/
function signout(req, res, next) {
  dbMngr.getAnonymousId((r) => {
    req.session.userType = 'anonymous';
    req.session.userId = r.id;
    next();
  });
}

function createQuiz(req, res, next) {
  dbMngr.insertQuiz(req.query);
  next();
}
function sendQuiz(req, res, next) {
  dbMngr.saveQuizAnswer(req.query);
  next();
}

function getDashboard(req, res, next) {
  dbMngr.getDashboard((dashboard) => {
    result.data = dashboard;
    next();
  });
}


function getQuiz(req, res, next) {
  dbMngr.getQuiz(req.session.userId, req.session.userType === 'anonymous', (quiz) => {
    result.data = quiz;
    next();
  });
}

function checkUser(req, res, next) {
  result.data = { type: req.session.userType || 'anonymous' };
  next();
}

function getQuestions(req, res, next) {
  dbMngr.getQuestions((questions) => {
    result.data = questions;
    next();
  });
}

function getQuizStatistics(req, res, next) {
  dbMngr.getQuizStatistics(req.query.quizId, (r) => {
    result.data = r;
    next();
  });
}

function beforeRender(req, res, next) {
  if (!req.url.match('authenticate|checkuser|signout|createquiz|getquiz|sendquiz|getdashboard|getusers|getquestions|getquizstatistics')) {
    next();
    return;
  }
  res.write(JSON.stringify(result));
  res.end();
  next();
}

function resetState(req, res, next) {
  result.status = 0;
  result.message = '';
  result.data = null;
  next();
}

exp.authenticate = authenticate;
exp.init = init;
exp.resetState = resetState;
exp.beforeRender = beforeRender;
exp.index = index;
exp.checkUser = checkUser;
exp.signout = signout;
exp.createQuiz = createQuiz;
exp.getQuiz = getQuiz;
exp.sendQuiz = sendQuiz;
exp.getDashboard = getDashboard;
exp.getUsers = getUsers;
exp.getQuestions = getQuestions;
exp.getQuizStatistics = getQuizStatistics;

