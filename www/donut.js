function donutViz() {
// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 50

// The radius of the pieplot is half the width or half the height (smallest one). I substract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
d3.select('#donut').text('');
    d3.select('#donut').append('h3').text('Proportion of total votes by parties')
var svg = d3.select("#donut")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
var data = piChartData;
// set the color scale
var color = d3.scaleOrdinal()
  .domain(data)
  .range(d3.schemeCategory10);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates

totalVotes = 0;
for (var i = 0; i < Object.keys(piChartData).length; i++) {
    totalVotes = totalVotes + parseInt(piChartData[Object.keys(piChartData)[i]]);
}




svg
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('text')
  .text(function(d){ return ((parseInt(d.data.value)/totalVotes)*100).toFixed(1)+"%"})
  .attr("transform", function(d) { 
    /*return "translate(" + arcGenerator.centroid(d) + ")";*/
    var tmc = arcGenerator.centroid(d);
    return "translate(" + tmc[0]*2.3 +"," + tmc[1]*2.3 + ")";
    })
  .style("text-anchor", "middle")
  .style("font-size", 17)
    
    
    
d3.select('#donut').append('div').attr('id','piLabels').classed('viz',true);
    
    
    var pieLab = d3.select('#piLabels').append('svg').attr('width',200).attr('height',450);
    
    pieLab.selectAll('text').data(data_ready).enter().append('text').attr('x',10).attr('y', function(d,i){return (i*20)+25;}).text(function(d){return partyAbb["Abb"][partyAbb["Party"].indexOf(d.data.key)]})
    pieLab.selectAll('circle').data(data_ready).enter().append('circle').attr('cx',90).attr('cy',function(d,i){return (i*20)+20;}).attr('fill',function(d){return(color(d.data.key))}).attr('r',5);
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}