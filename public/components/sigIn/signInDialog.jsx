class SignInDialog extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      onClose: null,
      onShow: null,
      show: false,
    };
    this.state = {
      user: '',
      password: '',
    };
  }
  componentWillUpdate(nextProp) {
    if (nextProp.show === true) {
      $('#loginModal').modal();
    }
  }
  componentDidMount() {
    $('#loginModal').on('shown.bs.modal', () => this.props.onShow());
  }
  signIn() {
    $.post('./authenticate', this.state, () => { this.signInResult(); }, 'json');
  }
  signInResult() {
    $('#loginModal').modal('hide');
    this.state.user = '';
    this.state.password = '';
    this.setState(this.state);

    if (this.props.onClose) {
      this.props.onClose();
    }
  }
  handleUserChange(ev) {
    this.state.user = ev.target.value;
    this.setState(this.state);
  }
  handlerPasswordChange(ev) {
    this.state.password = ev.target.value;
    this.setState(this.state);
  }
  render() {
    return (
      <div id='loginModal' className='modal fade' role='dialog' >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal'>&times; </button>
              <h4 className='modal-title'>Sign In</h4>
            </div>
            <div className='modal-body'>
              <span>User:</span>
              <input type='text' ref='inputUser' className='form-control' value={this.state.user} onChange={(ev) => this.handleUserChange(ev)} />
              <span>Password:</span>
              <input type='password' ref='inputPassword' className='form-control' value={this.state.password} onChange={(ev) => this.handlerPasswordChange(ev)} />
            </div>
            <div className='modal-footer'>
              <button className='btn btn-primary' onClick={() => this.signIn()}>Sign in</button>
              <button type='button' className='btn btn-default' data-dismiss='modal' onClick={() => this.props.onClose && this.props.onClose()}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignInDialog.propTypes = {
  onClose: React.PropTypes.func,
  onShow: React.PropTypes.func,
  show: React.PropTypes.boolean,
};
