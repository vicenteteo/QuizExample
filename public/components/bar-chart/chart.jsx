class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.props = {
      bars: [],
    };
  }
  componentDidMount() {
    const data = [
      ['oranges', 2312],
      ['mangos', 674],
      ['limes', 994],
      ['apples', 3433],
      ['strawberries', 127],
      ['blueberries', 2261],
    ];
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
    let max = null;
    let scale = null;

    max = d3.max(data.map((item) => {
      return item[1];
    }));

    svg = d3.select(this.refs.chart)
    .append('svg')
    .attr('width', width)
    .attr('height', 400);

    bar = svg.selectAll('g')
    .data(data)
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
      .domain([0, max])
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

  render() {
    return (
      <div className='bar-chart'>
        <div ref='chart' className='chart'> 

        </div>
      </div>
    );
  }
}
Chart.propTypes = {
  bars: React.PropTypes.array, 
};
