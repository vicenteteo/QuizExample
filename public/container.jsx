class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 'anonymous',
      pauseQuiz: false,
      showLoggin: false,
      mnuState: 'quizEditor'
    };
  }
  componentDidMount() {
    setInterval(this.checkUser.bind(this), 1000);
  }
  checkUser() {
    $.get('./checkuser', null, (result) => {
      if (result.status !== 0) {
        return;
      }

      this.state.userType = result.data.type;
      this.setState(this.state);
    }, 'json');
  }
  signAction() {
    if (this.state.userType === 'admin' || this.state.userType === 'registered') {
      $.get('./signout');
    }
    else {
      this.state.pauseQuiz = true;
      this.state.showLoggin = true;
    }
    this.setState(this.state);
  }
  render() {
    let editor = null;
    let caption = this.state.userType === 'admin' || this.state.userType === 'registered' ? 'Sign Out' : 'Sign In';

    if (this.state.userType === 'admin') {
      return <div className='container'>
        <div className='row'>
          <div className='col-xs-4'>
            <div id='left'>
              <div className="list-group">
                <button type="button" className="list-group-item" onClick={() => { this.state.mnuState = 'dashboard';}}>Dashboard</button>
                <hr style={{ margin: 0 }}/>
                <button type="button" className="list-group-item" onClick={() => { this.state.mnuState = 'quizEditor';}}>Quiz Editor</button>
              </div>
            </div>
          </div>
          <div className='col-xs-8'>
            <div className='row'>
              <div className='col-xs-12' id='header'>
                <SignInButton caption={caption} onClick={() => { this.signAction(); } } />
              </div>
            </div>
            <hr />
            <div className='row' id='body'>
              <SignInDialog onClose={() => this.state.pauseQuiz = false } show={this.state.showLoggin}  onShow={() => this.state.showLoggin = false}/>
              {this.state.mnuState === 'dashboard' ? <Dashboard /> : <QuizEditor />}
            </div>
          </div>
        </div>
      </div>
    }
    else {
      return <div className='container'>
        <div className='row'>
          <div className='col-xs-12' id='header'>
            <SignInButton caption={caption} onClick={() => { this.signAction(); } } />
          </div>
        </div>
        <hr />
        <div className='row' id='body'>
          <SignInDialog onClose={() => this.state.pauseQuiz = false } show={this.state.showLoggin}  onShow={() => this.state.showLoggin = false}/>
          { this.state.userType !== 'anonymous' ? <ModalQuiz pauseQuiz={this.state.pauseQuiz} /> : '' }
        </div>
      </div>
    }
  }
}

ReactDOM.render(
  <Container />,
  document.body
);
