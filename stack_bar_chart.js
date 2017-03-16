
var margin = {top: 20, right: 100, bottom: 30, left: 290},
  width  = 870 - margin.left - margin.right,
  height = 600  - margin.top  - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var color= d3.scale.ordinal()
        .range([
            "#ededed","#d3d3d3",
//            "#cc4c02", "#88419d","#fc4e2a","#fe9929","#df65b0","#5EB1BF","#5574a6","#114B5F","#F45B69","#644B77","#FA7921","#848982","#457B9D","#E63946",
            "#716168",
            "#46465A",
        "#737373",
//        "#87B9E5","#6094CE","#446DAB","#315088",
//        "#DAE3E5","#BBD1EA","#A1C6EA","#507DBC",
//        "#F2F3AE", "#EDD382","#FC9E4F","#F55541",
        "#525252","#252525","#D14E61",
        "#CC3A50","#C7273F","#B5243A","#A32034",
        "#911D2E","#7F1929","#6D1623","#5B121D"]);


var svg = d3.select("#stack_bar_chart").append("svg")
  .attr("width",  width  + margin.left + margin.right)
  .attr("height", height + margin.top  + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//var tip = d3.tip()
//  .attr('class', 'd3-tip')
//  .offset([-10, 0])
//  .html(function(d) {
//    return "<strong>value:</strong> <span style='color:red'>" + d.name + "</span>";
//  })

d3.csv("data/fixed_year_data_output_3.csv", function (error, data) {

    var labelVar = 'year';
    var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});
    color.domain(varNames);

    data.forEach(function (d) {
      var y0 = 0;
      d.mapping = varNames.map(function (name) { 
        return {
          name: name,
          label: d[labelVar],
          y0: y0,
          y1: y0 += +d[name]
        };
      });
      d.total = d.mapping[d.mapping.length - 1].y1;
    });

    x.domain(data.map(function (d) { return d.year; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Killed");

    var selection = svg.selectAll(".series")
        .data(data)
      .enter().append("g")
        .attr("class", "series")
        .attr("transform", function (d) { return "translate(" + x(d.year) + ",0)"; });

    selection.selectAll("rect")
      .data(function (d) { return d.mapping; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function (d) { return y(d.y1); })
      .attr("height", function (d) { return y(d.y0) - y(d.y1); })
      .attr("class", function(d) {return "terror_group" + d.name.substring(d.name.length - 4, d.name.length);})
      .style("fill", function (d) { return color(d.name); })
      .style("fill-opacity", 0.8)
//      .on('mouseover', tip.show)
//      .on('mouseout', tip.hide);
      .append("svg:title")
      .text(function(d){return "Group: " + d.name + "\n" + "Killed: " + (d.y1 -d.y0);});
//      .on("mouseover", function (d) { showPopover.call(this, d); })
//      .on("mouseout",  function (d) { removePopovers(); })
      

    var legend = svg.selectAll(".legend")
        .data(varNames.slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(-70," + i * 30 + ")"; });

    legend.append("rect")
        .attr("x", 0)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color)
        .attr("class", function(d) {return "terror_group" + d.substring(d.length - 4, d.length);});

    legend.append("text")
        .attr("x", -1)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; })
        .on("mouseover", function(d) {
                svg.selectAll("rect.terror_group" + d.substring(d.length - 4, d.length)).style("fill-opacity", 1.0).style("stroke", "#1C2541");
            })
        .on("mouseout", function(d) {
                svg.selectAll("rect.terror_group" + d.substring(d.length - 4, d.length)).style("fill-opacity", 0.8).style("stroke","none");
        });

//    function removePopovers () {
//      $('.popover').each(function() {
//        $(this).remove();
//      }); 
//    }
//
//    function showPopover (d) {
//      $(this).popover({
//        title: d.name,
//        placement: 'auto top',
//        container: 'body',
//        trigger: 'manual',
//        html : true,
//        content: function() { 
//          return "year: " + d.label + 
//                 "<br/>Killed: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
//      });
//      $(this).popover('show')
//    }
});
