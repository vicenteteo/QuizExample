class ModalQuiz extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      pauseQuiz: true,
    }
    this.state = {
      question: '',
      answers: [],
    }
    this.setState(this.state);
  }
  componentDidMount() {
    setTimeout(this.getQuiz.bind(this), 1000);
  }
  componentWillUnmount() {
    if (this.getQuizInterval) {
      clearInterval(this.getQuizInterval);
      this.getQuizInterval = null;
    }
  }
  getQuiz() {
    if (this.props.pauseQuiz) {
      return;
    }
    $.get('./getquiz', null, (result) => {
      if (result.status === 0 && result.data) {

        if (this.getQuizInterval) {
          clearInterval(this.getQuizInterval);
          this.getQuizInterval = null;
        }

        this.state.question = result.data.Quiz.question;
        this.state.answers = result.data.Quiz.Answers;
        this.state.answers.map((item, index) => {
          item.checked = '';
        });
        this.state.currentQuizStorageId = result.data.id;
        this.setState(this.state, () => $('#quizModal').modal());
      }
    }, 'json');
  }
  send() {
    const quiz = {
      answers: [],
      id: this.state.currentQuizStorageId
    };
    $(".funkyradio-primary input").map((index, item) => {
      if (item.checked)
        quiz.answers.push(parseInt($(item).attr('id')));
    });

    $('#quizAnswers').hide();

    $.get('./sendquiz', quiz, (result) => {
      this.close();
    });
  }
  close() {
    $('#quizAnswers').show();
    $('#quizModal').modal('hide');
    if (!this.getQuizInterval)
      this.getQuizInterval = setInterval(this.getQuiz.bind(this), 10000);
  }
  onChecked(evt) {
    const index = parseInt($(evt.target).attr('data-index'));
    if (index >= 0) {
      this.state.answers[index].checked = (this.state.answers[index].checked === '' ? 'checked' : '');
      this.setState(this.state);
    }
  }
  render() {
    return (
      <div className='modal fade' id='quizModal'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h3 style={{ display: 'inline' }}><span className='label label-primary' id='qid'>Q</span></h3>
            <h3 style={{ display: 'inline', margin: '15px' }}>{this.state.question}</h3>
          </div>
          <div className='modal-body'>
            <div className="funkyradio" id='quizAnswers'>
              {
                this.state.answers.map((item, index) => {
                  return <div className="funkyradio-primary">
                    <input type="checkbox" name="checkbox" id={item.id} data-index={index} checked={item.checked} onChange={(evt) => this.onChecked(evt) }/>
                    <label htmlFor={item.id}>{item.answer}</label>
                  </div>
                })
              }
            </div>
          </div>
          <div className='modal-footer text-muted'>
            <button type='button' className='btn btn-default' onClick={ () => { this.close(); } } >Close</button>
            <button type='button' className='btn btn-primary' onClick={ () => { this.send(); } }>Send</button>
          </div>
        </div>
      </div>
    );
  }
}
ModalQuiz.propTypes = {
  pauseQuiz: React.PropTypes.boolean,
};
