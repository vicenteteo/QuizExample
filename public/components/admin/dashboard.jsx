class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forceReload: false,
      questions: [],
      quizData: {
        totalAnswers: 0,
        answers: [
        ],
      },
    };
    this.setState(this.state);
  }
  componentDidMount() {
    this.getQuestions();
  }
  getQuestions() {
    $.get('./getquestions', null, (result) => {
      this.state.questions = result.data;
    }, 'json');
  }
  onQuestionChanged(question) {
    if (!question || question.length <= 0) {
      return;
    }

    $.get('./getquizstatistics', { quizId: question[0].id }, (result) => {
      this.state.quizData.totalAnswers = result.data.total;
      this.state.quizData.answers.length = 0;
      for (let i = 0; i < result.data.Answers.length; i++) {
        this.state.quizData.answers.push([result.data.Answers[i].answer, result.data.Answers[i].total]);
      }
      this.state.forceReload = true;
      this.setState(this.state, () => { this.state.forceReload = false; });
    }, 'json');
  }
  render() {
    return (
      <div className='col-xs-12' >
        <ReactBootstrapTypeahead.default options={this.state.questions} maxResults={2} minLength={1} onChange={(r) => { this.onQuestionChanged(r); }} />
        <Chart reload={this.state.forceReload} total={this.state.quizData.totalAnswers} bars={this.state.quizData.answers} />
      </div>
    );
  }
}

Dashboard.propTypes = {
};
