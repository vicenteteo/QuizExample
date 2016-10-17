class SignInButton extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      onClick: null,
      caption: '',
    };
  }
  render() {
    return (
      <div>
        <button type='button' className='btn btn-xs btn-primary' onClick={() => this.props.onClick && this.props.onClick()} >
          {this.props.caption}
        </button>
      </div>
    );
  }
}
SignInButton.propTypes = {
  caption: React.PropTypes.string,
  onClick: React.PropTypes.func,
};
