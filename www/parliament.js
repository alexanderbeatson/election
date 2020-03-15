/*
 * MIT License
 * © Copyright 2016 - Geoffrey Brossard (me@geoffreybrossard.fr)
 */

d3.parliament = function() {
    /* params */
    var width,
        height,
        innerRadiusCoef = 0.4;

    /* animations */
    var enter = {
            "smallToBig": true,
            "fromCenter": true
        },
        update = {
          'animate': true,
        },
        exit = {
            "bigToSmall": true,
            "toCenter": true
        };

    /* events */
    var parliamentDispatch = d3.dispatch("click", "dblclick", "mousedown", "mouseenter",
        "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup", "touchcancel", "touchend",
        "touchmove", "touchstart");

    function parliament(data) {
        data.each(function(d) {

            // if user did not provide, fill the svg:
            width = width ? width : this.getBoundingClientRect().width;
            height = width ? width / 2 : this.getBoundingClientRect().width/2;

            var outerParliamentRadius = Math.min(width/2, height);
            var innerParliementRadius = outerParliamentRadius * innerRadiusCoef;

            /* init the svg */
            var svg = d3.select(this);

            /***
             * compute number of seats and rows of the parliament */
            var nSeats = 0;
            d.forEach(function(p) { nSeats += (typeof p.seats === 'number') ? Math.floor(p.seats) : p.seats.length; });

            var nRows = 0;
            var maxSeatNumber = 0;
            var b = 0.5;
            (function() {
                var a = innerRadiusCoef / (1 - innerRadiusCoef);
                while (maxSeatNumber < nSeats) {
                    nRows++;
                    b += a;
                    /* NOTE: the number of seats available in each row depends on the total number
                    of rows and floor() is needed because a row can only contain entire seats. So,
                    it is not possible to increment the total number of seats adding a row. */
                    maxSeatNumber = series(function(i) { return Math.floor(Math.PI * (b + i)); }, nRows-1);
                }
            })();


            /***
             * create the seats list */
            /* compute the cartesian and polar coordinates for each seat */
            var rowWidth = (outerParliamentRadius - innerParliementRadius) / nRows;
            var seats = [];
            (function() {
                var seatsToRemove = maxSeatNumber - nSeats;
                for (var i = 0; i < nRows; i++) {
                    var rowRadius = innerParliementRadius + rowWidth * (i + 0.5);
                    var rowSeats = Math.floor(Math.PI * (b + i)) - Math.floor(seatsToRemove / nRows) - (seatsToRemove % nRows > i ? 1 : 0);
                    var anglePerSeat = Math.PI / rowSeats;
                    for (var j = 0; j < rowSeats; j++) {
                        var s = {};
                        s.polar = {
                            r: rowRadius,
                            teta: -Math.PI + anglePerSeat * (j + 0.5)
                        };
                        s.cartesian = {
                            x: s.polar.r * Math.cos(s.polar.teta),
                            y: s.polar.r * Math.sin(s.polar.teta)
                        };
                        seats.push(s);
                    }
                };
            })();

            /* sort the seats by angle */
            seats.sort(function(a,b) {
                return a.polar.teta - b.polar.teta || b.polar.r - a.polar.r;
            });

            /* fill the seat objects with data of its party and of itself if existing */
            (function() {
                var partyIndex = 0;
                var seatIndex = 0;
                seats.forEach(function(s) {
                    /* get current party and go to the next one if it has all its seats filled */
                    var party = d[partyIndex];
                    var nSeatsInParty = typeof party.seats === 'number' ? party.seats : party.seats.length;
                    if (seatIndex >= nSeatsInParty) {
                        partyIndex++;
                        seatIndex = 0;
                        party = d[partyIndex];
                    }

                    /* set party data */
                    s.party = party;
                    s.data = typeof party.seats === 'number' ? null : party.seats[seatIndex];

                    seatIndex++;
                });
            })();


            /***
             * helpers to get value from seat data */
            var seatClasses = function(d) {
                var c = "seat ";
                c += (d.party && d.party.id) || "";
                return c.trim();
            };
            var seatX = function(d) { return d.cartesian.x; };
            var seatY = function(d) { return d.cartesian.y; };
            var seatRadius = function(d) {
                var r = 0.4 * rowWidth;
                if (d.data && typeof d.data.size === 'number') {
                    r *= d.data.size;
                }
                return r;
            };


            /***
             * fill svg with seats as circles */
            /* container of the parliament */
            var container = svg.select(".parliament");
            if (container.empty()) {
                container = svg.append("g");
                container.classed("parliament", true);
            }
            container.attr("transform", "translate(" + width / 2 + "," + outerParliamentRadius + ")");

            /* all the seats as circles */
            var circles = container.selectAll(".seat").data(seats);
            circles.attr("class", seatClasses);

            /* animation adding seats to the parliament */
            var circlesEnter = circles.enter().append("circle");
            circlesEnter.attr("class", seatClasses);
            circlesEnter.attr("cx", enter.fromCenter ? 0 : seatX);
            circlesEnter.attr("cy", enter.fromCenter ? 0 : seatY);
            circlesEnter.attr("r", enter.smallToBig ? 0 : seatRadius);
            if (enter.fromCenter || enter.smallToBig) {
                var t = circlesEnter.transition().duration(function() { return 1000 + Math.random()*800; });
                if (enter.fromCenter) {
                    t.attr("cx", seatX);
                    t.attr("cy", seatY);
                }
                if (enter.smallToBig) {
                    t.attr("r", seatRadius);
                }
            }

            /* circles catch mouse and touch events */
            for (var evt in parliamentDispatch._) {
                (function(evt){
                    circlesEnter.on(evt, function(e) { parliamentDispatch.call(evt, this, e); });
                })(evt);
            }

            /* animation updating seats in the parliament */
            if (update.animate) {
              var circlesUpdate = circles.transition().duration(function() { return 1000 + Math.random()*800; });
            } else {
              var circlesUpdate = circles;
            }
              circlesUpdate.attr("cx", seatX)
                .attr("cy", seatY)
                .attr("r", seatRadius);

            /* animation removing seats from the parliament */
            if (exit.toCenter || exit.bigToSmall) {
                var t = circles.exit().transition().duration(function() { return 1000 + Math.random()*800; });
                if (exit.toCenter) {
                    t.attr("cx", 0).attr("cy", 0);
                }
                if (exit.bigToSmall) {
                    t.attr("r", 0);
                }
                t.remove();
            } else {
                circles.exit().remove();
            }
        });
    }

    parliament.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return parliament;
    };

    /** Deprecated since v1.0.1 */
    parliament.height = function(value) {
        if (!arguments.length) return height;
        return parliament;
    };

    parliament.innerRadiusCoef = function(value) {
        if (!arguments.length) return innerRadiusCoef;
        innerRadiusCoef = value;
        return parliament;
    };

    parliament.enter = {
        smallToBig: function (value) {
            if (!arguments.length) return enter.smallToBig;
            enter.smallToBig = value;
            return parliament.enter;
        },
        fromCenter: function (value) {
            if (!arguments.length) return enter.fromCenter;
            enter.fromCenter = value;
            return parliament.enter;
        }
    };

    parliament.update = {
      animate: function(value) {
        if (!arguments.length) return update.animate;
        update.animate = value;
        return parliament.update;
      }
    }

    parliament.exit = {
        bigToSmall: function (value) {
            if (!arguments.length) return exit.bigToSmall;
            exit.bigToSmall = value;
            return parliament.exit;
        },
        toCenter: function (value) {
            if (!arguments.length) return exit.toCenter;
            exit.toCenter = value;
            return parliament.exit;
        }
    };

    parliament.on = function(type, callback) {
        parliamentDispatch.on(type, callback);
    }

    return parliament;

    // util
    function series(s, n) { var r = 0; for (var i = 0; i <= n; i++) { r+=s(i); } return r; }

}







    svg.text('');
    svg.append('style').text('svg .seat.USDP { fill: green } svg .seat.NLD { fill: blue } svg .seat.Others { fill: white } svg .seat.Military { fill: yellow }');
    
    var parliData = {'2010':[{'id':'NLD','seats':0},{'id':'USDP','seats':58},{'id':'Others','seats':17},{'id':'Military','seats':25}],
                '2012':[{'id':'NLD','seats':3},{'id':'USDP','seats':55},{'id':'Others','seats':17},{'id':'Military','seats':25}],
                 '2015':[{'id':'NLD','seats':59},{'id':'USDP','seats':6},{'id':'Others','seats':10},{'id':'Military','seats':25}],
                 '2017':[{'id':'NLD','seats':58},{'id':'USDP','seats':6},{'id':'Others','seats':11},{'id':'Military','seats':25}],
                 '2018':[{'id':'NLD','seats':58},{'id':'USDP','seats':6},{'id':'Others','seats':11},{'id':'Military','seats':25}],
                }    
    var margin = {top: 20, right: 10, bottom: 30, left: 10},
    charPx = $('#parChart').css('width');
    var charWidth = parseInt (charPx,10);
    width =  charWidth - margin.left - margin.right,
    height = charWidth/2 - margin.top - margin.bottom;
    svg.style("background","#484e55").style('height',charWidth/2);
    
    var parliament = d3.parliament();
        parliament.width(width-125).height(height-125).innerRadiusCoef(0.5);
        parliament.enter.fromCenter(true).smallToBig(true);
        parliament.exit.toCenter(true).bigToSmall(true);


    svg.append("g").attr("transform","translate(20,30)").datum(parliData[data]).call(parliament);
    
    
    
    
    //legends
   
    var legd = svg;
    legd.append('circle').attr('cx',width).attr('cy',40).attr('r',5).attr('fill','blue');
    legd.append('circle').attr('cx',width).attr('cy',80).attr('r',5).attr('fill','green');
    legd.append('circle').attr('cx',width).attr('cy',120).attr('r',5).attr('fill','white');
    legd.append('circle').attr('cx',width).attr('cy',160).attr('r',5).attr('fill','yellow');
    
    legd.selectAll('text').data(parliData[data]).enter().append('text').attr('x',width-100).attr('y',function(d,i){return ((i*40)+45);}).text(function(d){ return d.id;});
    legd.append('text').attr('x',width-100).attr('y',65).text(function(){return parliData[data][0]['seats']+ "% seats"});
    legd.append('text').attr('x',width-100).attr('y',105).text(parliData[data][1]['seats']+ "% seats");
    legd.append('text').attr('x',width-100).attr('y',145).text(parliData[data][2]['seats']+ "% seats");
    legd.append('text').attr('x',width-100).attr('y',185).text(parliData[data][3]['seats']+ "% seats");
    

/*var barHeight = Math.floor(height / data.length);

var margin = {top: 20, right: 10, bottom: 30, left: 10},
    charPx = $('#parChart').css('width');
var charWidth = parseInt (charPx,10);
    width =  charWidth - margin.left - margin.right,
    height = charWidth/2 - margin.top - margin.bottom;

var candidateData = {"2010":[{"candidates":1084,"partyAbb":"USDP"},{"candidates":975,"partyAbb":"NUP"},{"candidates":158,"partyAbb":"NDF"},{"candidates":153,"partyAbb":"SNDP"},{"candidates":78,"partyAbb":"Inde"},{"candidates":48,"partyAbb":"DPM"},{"candidates":38,"partyAbb":"CPP"},{"candidates":33,"partyAbb":"AMRDP"},{"candidates":29,"partyAbb":"KPP"},{"candidates":27,"partyAbb":"88GSY"}],"2012":[{"candidates":45,"partyAbb":"USDP"},{"candidates":44,"partyAbb":"NLD"},{"candidates":22,"partyAbb":"NUP"},{"candidates":11,"partyAbb":"NDF"},{"candidates":7,"partyAbb":"Inde"},{"candidates":4,"partyAbb":"UPP"},{"candidates":3,"partyAbb":"DPMNS"},{"candidates":3,"partyAbb":"MNC"},{"candidates":3,"partyAbb":"NNDP"},{"candidates":3,"partyAbb":"UDP"}],"2015":[{"candidates":1092,"partyAbb":"USDP"},{"candidates":1091,"partyAbb":"NLD"},{"candidates":743,"partyAbb":"NUP"},{"candidates":349,"partyAbb":"NDP"},{"candidates":282,"partyAbb":"Inde"},{"candidates":282,"partyAbb":"MFDP"},{"candidates":262,"partyAbb":"NDF"},{"candidates":190,"partyAbb":"SNDP"},{"candidates":147,"partyAbb":"SNLD"},{"candidates":112,"partyAbb":"KPP"}],"2017":[{"candidates":19,"partyAbb":"NLD"},{"candidates":18,"partyAbb":"USDP"},{"candidates":7,"partyAbb":"Inde"},{"candidates":7,"partyAbb":"SNDP"},{"candidates":7,"partyAbb":"SNLD"},{"candidates":6,"partyAbb":"NDP"},{"candidates":5,"partyAbb":"NDF"},{"candidates":4,"partyAbb":"DP"},{"candidates":3,"partyAbb":"NUP"},{"candidates":2,"partyAbb":"LNDP"}],"2018":[{"candidates":12,"partyAbb":"NLD"},{"candidates":9,"partyAbb":"USDP"},{"candidates":6,"partyAbb":"Inde"},{"candidates":4,"partyAbb":"PLP"},{"candidates":3,"partyAbb":"ALD"},{"candidates":3,"partyAbb":"MPDP"},{"candidates":3,"partyAbb":"NUDP"},{"candidates":3,"partyAbb":"UEPFDP"},{"candidates":2,"partyAbb":"CLD"},{"candidates":2,"partyAbb":"DPM"}]};

yrData = candidateData [data];

var x = d3.scaleBand()
          .range([50, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 20]); 

x.domain(yrData.map(function(d) { return d.partyAbb; }));
y.domain([0, d3.max(yrData, function(d) { return d.candidates; })]);



d3.select('#parChart').style('height',charWidth/2);

svg.style("background","#484e55").style('height',charWidth/2);

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
        .attr("transform", "translate(45," + 0 + ")")
        .call(d3.axisLeft(y));
    
    // add x label
    svg.append("text")
        .style("font-size","12")
        .attr("class","x label")
        .attr("text-anchor","end")
        .attr("x", width/2)
        .attr("y", height + 40)
        .text("Parties")
    
    
    svg.append("text")
        .attr("transform","rotate(-90)")    
        .style("font-size","12")
        .attr("class","y label")
        .attr("text-anchor","end")
        .attr("x", -height/2)
        .attr("y", 15)
        .text("Candidates")
*/