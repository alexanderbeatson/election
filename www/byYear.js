
function yearPage () {
    d3.select('#yearButtons').text('');
    var land = d3.select('#yearButtons').append('table').attr('class','tableYear');

land.append('tr').style("background-color","white")
    .style('width','100%')
    .text('General election : ')
    .selectAll('th')
    .data(['2010','2015']).enter()
    .append('th').append('button')
    .attr('id','init')
    .style('line-height','0')
    .classed('button',true)
    .text(function (d) {
                    return d;
                })
    .on('click',function (d) {
                    yearSelect = d;
                    return yearInformation(), visualize(), yearChange();
                });


land.append('tr').text('By-election : ')
    .selectAll('th')
    .data(['2012','2017','2018']).enter()
    .append('th').append('button')
    .attr('id','init')
    .style('line-height','0')
    .classed('button',true)
    .text(function(d){
                    return d;
                })
    .on('click',function(d){
                    yearSelect = d;
                    return yearInformation(), visualize(), yearChange();
                });
    return yearInformation();
}




function yearInformation () {
    d3.select('#yearInfo').text("");
    d3.select('#yearInfo')
        .append('h3')
        .append('table')
        .append('tr')
        .style('background-color','white')
        .selectAll('th')
        .data(['Year-', yearSelect]).enter()
        .append('th')
        .style('text-align','center')
        .text(function (d) {return d;});
    
    var yrTable = d3.select('#yearInfo')
        .append('table');
    var yrTableVar = yrTable.selectAll('td')
        .data(['Held on','Available seats','President']).enter()
        .append('tr')
        .style('background-color','white')
        .style('font-weight','bold')
        .text (function (d){return d;})
        .append('td')
        .attr('valign','top')
        .attr('class', function(d) {
            if (d == 'President') {
                return 'presLink';
            } else {
                return 'noPresLink ' + d;
            }
        });
    
    d3.select('.presLink')
        .append('div')
        .append('a')
        .attr('href', yearInfo[yearSelect][0]['link'])
        .text(yearInfo[yearSelect][0]['President'])
    d3.select('.Held')
        .append('div')
        .append('a')
        .attr('href', yearInfo[yearSelect][0]['sauce'])
        .text(yearInfo[yearSelect][0]['Held on'])
    d3.select('.Available')
        .append('div')
        .text(yearInfo[yearSelect][0]['Available seats'])
    
}




function DownloadBut () {
    d3.select('#DownBut').append('a').attr('href','https://opendevelopmentmyanmar.net/dataset/?id=election-result-data').style('background-color','#073C89').style('border','none').style('color','white').style('padding','10px 21px').style('text-align','center').style('display','inline-block').style('font-size','16px').text('Download data');
}



