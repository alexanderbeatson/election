function visualize() {
    yrData = candidateData [data];
    //Bar chart
    d3.select('#parChart').style('width','100%').style('overflow','auto');
    d3.select('#parChart').append('#barC');
    d3.select('#barC').remove();
    var barChart = d3.select("#barC");
    barChart.append('h3').text('Top 10 parties by number of candidates');
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
// set the ranges
    var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    var y = d3.scaleLinear()
          .range([height, 0]); 
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg = barChart.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    x.domain(yrData.map(function(d) { return d.partyAbb; }));
    y.domain([0, d3.max(yrData, function(d) { return d.candidates; })]);
    
      svg.selectAll("rect")
        .data(yrData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.partyAbb); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.candidates); })
        .attr("height", function(d) { return height - y(d.candidates); });

    
    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

  // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
    
    // add x label
    svg.append("text")
        .style("font-size","12")
        .attr("class","x label")
        .attr("text-anchor","end")
        .attr("x", width/2)
        .attr("y", height+ 30)
        .text("Parties")
    
    
    svg.append("text")
        .attr("transform","rotate(-90)")    
        .style("font-size","12")
        .attr("class","y label")
        .attr("text-anchor","end")
        .attr("x", -50)
        .attr("y", -30)
        .text("Candidates")
    //append('div').style('float','right').style('margin-right','10%')
      /*
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")*/

    
    
    
    //Parliamentry Chart
    d3.select('#parC').text('');
    var parChart = d3.select("#parC");
    parChart.append('h3').text('Positions in parliament');
    var parli = parChart.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var parliament = d3.parliament();
        parliament.width(350).height(400).innerRadiusCoef(0.4);
        parliament.enter.fromCenter(false).smallToBig(false);
        parliament.exit.toCenter(true).bigToSmall(true);


    parli.datum(parliData[yearSelect]).call(parliament);
    
    
    
    
    //legends
    d3.select('#parC').append('div').classed('viz',true).attr('id','leg');
    var legd = d3.select('#leg').append('svg').attr('width',100).attr('height',200);
    legd.append('circle').attr('cx',90).attr('cy',40).attr('r',5).attr('fill','blue');
    legd.append('circle').attr('cx',90).attr('cy',80).attr('r',5).attr('fill','green');
    legd.append('circle').attr('cx',90).attr('cy',120).attr('r',5).attr('fill','black');
    legd.append('circle').attr('cx',90).attr('cy',160).attr('r',5).attr('fill','yellow');
    
    legd.selectAll('text').data(parliData[yearSelect]).enter().append('text').attr('x',25).attr('y',function(d,i){return ((i*40)+45);}).text(function(d){ return d.id;});
    legd.append('text').attr('x',25).attr('y',65).text(function(){return parliData[yearSelect][0]['seats']+ "% seats"});
    legd.append('text').attr('x',25).attr('y',105).text(parliData[yearSelect][1]['seats']+ "% seats");
    legd.append('text').attr('x',25).attr('y',145).text(parliData[yearSelect][2]['seats']+ "% seats");
    legd.append('text').attr('x',25).attr('y',185).text(parliData[yearSelect][3]['seats']+ "% seats");
};








