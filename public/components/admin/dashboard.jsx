class Dashboard extends React.Component {
  componentDidMount() {
    setTimeout(this.getDashboard.bind(this), 1000);
    $('.autoSearchBox').typeahead({
        source: ['Vicente','Elvis'], 
    });
  }
  getDashboard() {
    $.get('./getdashboard', null, (result) => {
      console.debug(JSON.stringify(result));
    }, 'json');
  }
  render() {
    return (
      <div className='col-xs-12' >
        <input type='text' id='autoSearchBox' />
      </div>
    );
  }
}

Dashboard.propTypes = {
};
