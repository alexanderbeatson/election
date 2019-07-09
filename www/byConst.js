function buildDropdowns(){
  var dropdownDiv = d3.select('#dropdown').attr('id','ddlabels');

//yearS , year4const, yearSelect
    
  dropdownDiv.append('select')
    .attr('class', 'house')
    .attr('id','constHouse')
    .attr('name', 'house')
    .attr('onchange','houseChange()')
    .selectAll('option')
    .data(houses)
    .enter()
    .append('option')
    .attr('value', function(d) { return d;})
    .text(function(d) { return houseNameTranslate[d];});
    
  dropdownDiv.append('select')
    .attr('class', 'state')
    .attr('id','constState')
    .attr('name', 'state')
    .attr('onchange','stateChange()')
    .selectAll('option')
    .data(states)
    .enter()
    .append('option')
    .attr('value', function(d) { return d;})
    .text(function(d) { return d;});    
    
  dropdownDiv.append('select')
    .attr('class', 'consti')
    .attr('id','const')
    .attr('name', 'consti')
    .attr('onchange','constChange()')
    .selectAll('option')
    .data(consts)
    .enter()
    .append('option')
    .attr('value', function(d) { return d;})
    .text(function(d) { return d;});  
    
    d3.select("#tabLabel").text('');
    d3.select("#tabLabel").append('h3').text(tabLabelTranslate[ddHouseSelect]);
    
    tabulate(constTable ,["name_st","const_code","const_name","candidate_name.my","party_name.en","votes.total_valid"]);
    for (var i = 0; i < constTable.length; i++) {
        piChartData [constTable[i]['party_name.en']] = constTable[i]['votes.total_valid'];
    }
    donutViz();
}
//---------------------------------------------------------------
function yearChange() {
    d3.select('#constHouse').remove();
    d3.select('#constState').remove();
    d3.select('#const').remove();
    ddYearSelect = yearS.concat(yearSelect);
    ddHouseSelect = Object.keys(elect[ddYearSelect])[0];
    ddStateSelect = [...new Set(elect[ddYearSelect][ddHouseSelect].map(x => x.name_st))][0];
    houses = Object.keys(elect[ddYearSelect]);
    d3.select('#ddlabels')
        .append('select')
        .attr('class', 'house')
        .attr('id','constHouse')
        .attr('name', 'house')
        .attr('onchange','houseChange()')
        .selectAll('option')
        .data(houses)
        .enter()
        .append('option')
        .attr('value', function(d) { return d;})
        .text(function(d) { return houseNameTranslate[d];});
    houseUpdate();
}
//---------------------------------------------------------------
function houseChange() {
    d3.select('#constState').remove();
    d3.select('#const').remove();
    ddHouseSelect = document.getElementById("constHouse").value;
    ddStateSelect = [...new Set(elect[ddYearSelect][ddHouseSelect].map(x => x.name_st))][0];
    houseUpdate();
}
function houseUpdate() {
    states = [...new Set(elect[ddYearSelect][ddHouseSelect].map(x => x.name_st))];
    d3.select('#ddlabels')
        .append('select')
        .attr('class', 'state')
        .attr('id','constState')
        .attr('name', 'state')
        .attr('onchange','stateChange()')
        .selectAll('option')
        .data(states)
        .enter()
        .append('option')
        .attr('value', function(d) { return d;})
        .text(function(d) { return d;}); 
    d3.select("#tabLabel").text('');
    d3.select("#tabLabel").append('h3').text(tabLabelTranslate[ddHouseSelect]);
    stateUpdate();
}
//---------------------------------------------------------------
function stateChange() {
    d3.select('#const').remove();
    ddStateSelect =document.getElementById("constState").value;
    stateUpdate();
}
function stateUpdate() {
    statesLoc = [];
    j = 0;
    for(var i = 0; i < elect[ddYearSelect][ddHouseSelect].length; i++){
        if(elect[ddYearSelect][ddHouseSelect].map(x => x.name_st)[i] == ddStateSelect) {
            statesLoc[j] = i;
            j++;
    }
}

    NewStateData = [];
    for (var i = 0; i < statesLoc.length; i++) {
        NewStateData [i] = elect[ddYearSelect][ddHouseSelect][statesLoc[i]];
}
    ddConstSelect = [...new Set(NewStateData.map(x => x.const_name))][0];
    constRender();
    consts = [...new Set(NewStateData.map(x => x.const_name))];
    d3.select('#ddlabels')
    .append('select')
    .attr('class', 'consti')
    .attr('id','const')
    .attr('name', 'consti')
    .attr('onchange','constChange()')
    .selectAll('option')
    .data(consts)
    .enter()
    .append('option')
    .attr('value', function(d) { return d;})
    .text(function(d) { return d;});  
    
}
//---------------------------------------------------------------
function constChange() {
    ddConstSelect = document.getElementById("const").value;
    constRender();
}

function constRender() {
    constLoc = [];
    j = 0;
    for (var i = 0; i < NewStateData.length; i++) {
        if(NewStateData.map(x => x.const_name)[i] == ddConstSelect) {
        constLoc[j] = i;
        j++;
    }
}
    constTable = [];
    for (var i = 0; i <constLoc.length; i++) {
    constTable [i] = NewStateData[constLoc[i]];
}
    tabulate(constTable ,["name_st","const_code","const_name","candidate_name.my","party_name.en","votes.total_valid"]);
    piChartData = {};
    for (var i = 0; i < constTable.length; i++) {
        piChartData [constTable[i]['party_name.en']] = constTable[i]['votes.total_valid'];
    }
    donutViz();
}
//---------------------------------------------------------------
function tabulate(data, columns) {
       d3.select("#constTable").text('');
		var table = d3.select('#constTable').append('table')
		var thead = table.append('thead')
		var	tbody = table.append('tbody');
        
		// append the header row
		thead.append('tr')
		  .selectAll('th')
		  .data(columns).enter()
		  .append('th')
            .style('border','1px solid black')
            .append('b')
		    .text(function (column) { return colNameTranslate[column]; });

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
            .style('border','0.5px solid black')
		    .text(function (d) { return d.value; });

	  return table;
	}
//---------------------------------------------------------------





























