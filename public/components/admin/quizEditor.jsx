class QuizEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      answers: [],
    };
  }
  addAnswer() {
    this.state.answers.push(this.refs.inputAnswer.value);
    this.refs.inputAnswer.value = '';
    this.setState(this.state);
  }
  showAnswerText(index) {
    this.refs.inputAnswer.value = this.state.answers[index];
  }
  removeAnswer(evt, index) {
    this.state.answers.splice(index, 1);
    evt.stopPropagation();
    this.setState(this.state);
  }
  newQuiz() {
    this.state.answers.length = 0;
    this.refs.inputQuestion.value = '';
    this.refs.inputAnswer.value = '';
    this.setState(this.state);
  }
  save() {
    this.state.question = this.refs.inputQuestion.value;
    $.get('./createquiz', this.state, () => {
      this.newQuiz();
    }, 'json');
  }
  render() {
    return (
      <div className='col-xs-12' >
        <div className='row'>
          <button className='btn btn-primary btn-block' type='button' onClick={() => { this.save(); } }>Save Quiz</button>
        </div>
        <div className='row'>
          <div className='input-group'>
            <span className="input-group-addon" >Q</span>
            <input type='text' className='form-control' placeholder='Question' ref='inputQuestion' />
          </div>
        </div>
        <div className='row'>
          <div className='input-group'>
            <span className="input-group-addon" >A</span>
            <input type='text' className='form-control' placeholder='Answer' ref='inputAnswer' />
            <span className='input-group-btn'>
              <button className='btn btn-secondary' type='button' onClick={() => { this.addAnswer(); } }>Add</button>
            </span>
          </div>
        </div>
        <div className='row'>
          <div>
            {
              this.state.answers.map((answer, index) => <button className='btn btn-primary btn-xs' type='button' data-index={index} onClick={(evt) => { this.showAnswerText($(evt.target).attr('data-index')); } }>
                {answer.substr(0, 10) + (answer.length > 10 ? '...' : '') } <span className='badge' onClick={(evt) => { this.removeAnswer(evt, $(evt.target).attr('data-index')); } }>x</span>
              </button>)
            }
          </div>
        </div>
      </div>
    );
  }
}
