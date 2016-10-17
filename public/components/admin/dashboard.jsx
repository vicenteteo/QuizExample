class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    setTimeout(this.getDashboard.bind(this), 1000);
  }
  getDashboard(){
    debugger;
    $.get('./getdashboard', null, (result) => {
      debugger;
    }, 'json');
  }
  render() {
    return (
      <div className='col-xs-12' >
      ddddd
            </div>
      
    );
  }
}
