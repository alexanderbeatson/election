// d3.tip
// Copyright (c) 2013 Justin Palmer
// ES6 / D3 v4 Adaption Copyright (c) 2016 Constantin Gavrilete
// Removal of ES6 for D3 v4 Adaption Copyright (c) 2016 David Gotz
//
// Tooltips for d3.js SVG visualizations

d3.functor = function functor(v) {
  return typeof v === "function" ? v : function() {
    return v;
  };
};

d3.tip = function() {

  var direction = d3_tip_direction,
      offset    = d3_tip_offset,
      html      = d3_tip_html,
      node      = initNode(),
      svg       = null,
      point     = null,
      target    = null

  function tip(vis) {
    svg = getSVGNode(vis)
    point = svg.createSVGPoint()
    document.body.appendChild(node)
  }

  // Public - show the tooltip on the screen
  //
  // Returns a tip
  tip.show = function() {
    var args = Array.prototype.slice.call(arguments)
    if(args[args.length - 1] instanceof SVGElement) target = args.pop()

    var content = html.apply(this, args),
        poffset = offset.apply(this, args),
        dir     = direction.apply(this, args),
        nodel   = getNodeEl(),
        i       = directions.length,
        coords,
        scrollTop  = document.documentElement.scrollTop || document.body.scrollTop,
        scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

    nodel.html(content)
      .style('position', 'absolute')
      .style('opacity', 1)
      .style('pointer-events', 'all')

    while(i--) nodel.classed(directions[i], false)
    coords = direction_callbacks[dir].apply(this)
    nodel.classed(dir, true)
      .style('top', (coords.top +  poffset[0]) + scrollTop + 'px')
      .style('left', (coords.left + poffset[1]) + scrollLeft + 'px')

    return tip
  }

  // Public - hide the tooltip
  //
  // Returns a tip
  tip.hide = function() {
    var nodel = getNodeEl()
    nodel
      .style('opacity', 0)
      .style('pointer-events', 'none')
    return tip
  }

  // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
  //
  // n - name of the attribute
  // v - value of the attribute
  //
  // Returns tip or attribute value
  tip.attr = function(n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return getNodeEl().attr(n)
    } else {
      var args =  Array.prototype.slice.call(arguments)
      d3.selection.prototype.attr.apply(getNodeEl(), args)
    }

    return tip
  }

  // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
  //
  // n - name of the property
  // v - value of the property
  //
  // Returns tip or style property value
  tip.style = function(n, v) {
    // debugger;
    if (arguments.length < 2 && typeof n === 'string') {
      return getNodeEl().style(n)
    } else {
      var args = Array.prototype.slice.call(arguments);
      if (args.length === 1) {
        var styles = args[0];
        Object.keys(styles).forEach(function(key) {
          return d3.selection.prototype.style.apply(getNodeEl(), [key, styles[key]]);
        });
      }
    }

    return tip
  }

  // Public: Set or get the direction of the tooltip
  //
  // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
  //     sw(southwest), ne(northeast) or se(southeast)
  //
  // Returns tip or direction
  tip.direction = function(v) {
    if (!arguments.length) return direction
    direction = v == null ? v : d3.functor(v)

    return tip
  }

  // Public: Sets or gets the offset of the tip
  //
  // v - Array of [x, y] offset
  //
  // Returns offset or
  tip.offset = function(v) {
    if (!arguments.length) return offset
    offset = v == null ? v : d3.functor(v)

    return tip
  }

  // Public: sets or gets the html value of the tooltip
  //
  // v - String value of the tip
  //
  // Returns html value or tip
  tip.html = function(v) {
    if (!arguments.length) return html
    html = v == null ? v : d3.functor(v)

    return tip
  }

  // Public: destroys the tooltip and removes it from the DOM
  //
  // Returns a tip
  tip.destroy = function() {
    if(node) {
      getNodeEl().remove();
      node = null;
    }
    return tip;
  }

  function d3_tip_direction() { return 'n' }
  function d3_tip_offset() { return [0, 0] }
  function d3_tip_html() { return ' ' }

  var direction_callbacks = {
    n:  direction_n,
    s:  direction_s,
    e:  direction_e,
    w:  direction_w,
    nw: direction_nw,
    ne: direction_ne,
    sw: direction_sw,
    se: direction_se
  };

  var directions = Object.keys(direction_callbacks);

  function direction_n() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.n.y - node.offsetHeight,
      left: bbox.n.x - node.offsetWidth / 2
    }
  }

  function direction_s() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.s.y,
      left: bbox.s.x - node.offsetWidth / 2
    }
  }

  function direction_e() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.e.y - node.offsetHeight / 2,
      left: bbox.e.x
    }
  }

  function direction_w() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.w.y - node.offsetHeight / 2,
      left: bbox.w.x - node.offsetWidth
    }
  }

  function direction_nw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.nw.y - node.offsetHeight,
      left: bbox.nw.x - node.offsetWidth
    }
  }

  function direction_ne() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.ne.y - node.offsetHeight,
      left: bbox.ne.x
    }
  }

  function direction_sw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.sw.y,
      left: bbox.sw.x - node.offsetWidth
    }
  }

  function direction_se() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.se.y,
      left: bbox.e.x
    }
  }

  function initNode() {
    var node = d3.select(document.createElement('div'))
    node
      .style('position', 'absolute')
      .style('top', '0')
      .style('opacity', '0')
      .style('pointer-events', 'none')
      .style('box-sizing', 'border-box')

    return node.node()
  }

  function getSVGNode(el) {
    el = el.node()
    if(el.tagName.toLowerCase() === 'svg')
      return el

    return el.ownerSVGElement
  }

  function getNodeEl() {
    if(node === null) {
      node = initNode();
      // re-add node to DOM
      document.body.appendChild(node);
    };
    return d3.select(node);
  }

  // Private - gets the screen coordinates of a shape
  //
  // Given a shape on the screen, will return an SVGPoint for the directions
  // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
  // sw(southwest).
  //
  //    +-+-+
  //    |   |
  //    +   +
  //    |   |
  //    +-+-+
  //
  // Returns an Object {n, s, e, w, nw, sw, ne, se}
  function getScreenBBox() {
    var targetel   = target || d3.event.target;

    while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
        targetel = targetel.parentNode;
    }

    var bbox       = {},
        matrix     = targetel.getScreenCTM(),
        tbbox      = targetel.getBBox(),
        width      = tbbox.width,
        height     = tbbox.height,
        x          = tbbox.x,
        y          = tbbox.y

    point.x = x
    point.y = y
    bbox.nw = point.matrixTransform(matrix)
    point.x += width
    bbox.ne = point.matrixTransform(matrix)
    point.y += height
    bbox.se = point.matrixTransform(matrix)
    point.x -= width
    bbox.sw = point.matrixTransform(matrix)
    point.y -= height / 2
    bbox.w  = point.matrixTransform(matrix)
    point.x += width
    bbox.e = point.matrixTransform(matrix)
    point.x -= width / 2
    point.y -= height / 2
    bbox.n = point.matrixTransform(matrix)
    point.y += height
    bbox.s = point.matrixTransform(matrix)

    return bbox
  }

  return tip
};


//------------------------------------------------------


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:black'>" + d.candidates + "</span>";
  })

svg.call(tip);

















//---------------------------------------------------------
var tooltip = d3.select("body").append("div").attr("class", "toolTip");
var barHeight = Math.floor(height / data.length);

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
svg.text('');
svg.append('style').text('.bar {fill: skyblue;}');
/*svg.selectAll('rect')
  .data(data)
  .enter().append('rect')
    .attr('width', function(d) { return d * width; })
    .attr('height', barHeight)
    .attr('y', function(d, i) { return i * barHeight; })
    .attr('fill', 'steelblue');*/

d3.select('#parChart').style('height',charWidth/2);

svg.style("background","#484e55").style('height',charWidth/2);
svg.selectAll("rect")
        .data(yrData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.partyAbb); })
        .attr("width", x.bandwidth())
        .attr("y", function(d){return y(0);})
        .attr("height",0)
        .on("mouseover",tip.show)
        .on("mouseout",tip.hide)
        .transition()
        .duration(1000)
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
        .text("Candidates");






//d3.selectAll('div').on("click", function() {console.log("pass");});



