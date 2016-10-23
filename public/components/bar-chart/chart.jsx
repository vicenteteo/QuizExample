class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      total: 0,
      bars: [],
      reload: false,
    };
  }
  drawChart(){

    const width = this.refs.chart.offsetWidth;
    const height = this.refs.chart.offsetHeight;
    const barHeight = 25;
    const barPadding = 25;
    const axisMargin = 20;
    const margin = 0;
    const valueMargin = 4;
    let labelWidth = 0;
    let svg = null;
    let bar = null;
    let scale = null;

    $(this.refs.chart).empty();
    this.refs.total.innerHTML = this.props.total;


    svg = d3.select(this.refs.chart)
      .append('svg')
      .attr('width', width)
      .attr('height', 400);

    bar = svg.selectAll('g')
      .data(this.props.bars)
      .enter()
      .append('g');

    bar.attr('class', 'bar')
      .attr('cx', 0)
      .attr('transform', function(d, i) { 
        return 'translate(0,' + (i * (barHeight + barPadding) + barPadding ) + ')';
            });

        bar.append('text')
        .attr('class', 'label')
        .attr('y', 0)
        .attr('dy', '.35em') //vertical align middle
        .text(function(d){
          return d[0];
        }).each(function() {
          labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
        });

        scale = d3.scale.linear()
        .domain([0, this.props.total])
        .range([0, width - margin*2 - labelWidth]);


        bar.append('rect')
        .attr('transform', 'translate(0, 10)')
        .attr('height', barHeight)
        .attr('width', function(d){
          return scale(d[1]);
        });

        bar.append('text')
          .attr('class', 'value')
          .attr('y', (barPadding + barHeight) / 2)
          .attr('dx', -valueMargin) //margin right
          .attr('dy', '.35em') //vertical align middle
          .attr('text-anchor', 'end')
          .text(function(d){
            return d[1];
          })
        .attr('x', function(d){
          var width = this.getBBox().width;
          return Math.max(width + valueMargin, scale(d[1]));
        }); 
  }
  componentDidMount() {
    this.drawChart();
  }
  componentDidUpdate(prevProp) {
    if (this.props.reload === true) {
      this.drawChart();
      this.props.reload = false;
    }
  } 
  render() {
    return (
      <div className='bar-chart'>
        <div className='label label-primary'>Total <span ref='total'>5</span> </div>
        <div ref='chart' className='chart'> 

        </div>
      </div>
    );
  }
}
Chart.propTypes = {
  total: React.PropTypes.number, 
  bar: React.PropTypes.array,
  reload: React.PropTypes.boolean,
};
