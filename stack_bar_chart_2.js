
var margin_3 = {top_3: 20, right_3: 200, bottom_3: 30, left_3: 120},
  width_3  = 800 - margin_3.left_3 - margin_3.right_3,
  height_3 = 600  - margin_3.top_3  - margin_3.bottom_3;

var x_3 = d3.scale.ordinal()
  .rangeRoundBands([0, width_3], .1);

var y = d3.scale.linear()
  .rangeRound([height_3, 0]);

var xAxis_3 = d3.svg.axis()
  .scale(x_3)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");
//                  "#87B9E5", "#6094CE","#446DAB","#315088",

var color_3= d3.scale.ordinal()
        .range([ "#B96B66",
                  "#765D66",
//                  "#5D6F85", 
                  "#A35D9B",
                  
                
//                                  "#87B9E5", "#6094CE","#446DAB","#315088",
                //"#E3EFCA","#C8DF95","#ADCF60","#8DB438",
//                "#DAE3E5","#BBD1EA","#A1C6EA","#507DBC",
                "#ACAFBD","#8B90A3","#6A7089","#49516F",
                
//                "#B9929F","#987883","#765D66","#554349",
//                "#81A0A1","#678081","#4D6061","#344041",
//                "#4C4F60","#383B4E","#25283D","#222538",
                "#F2F3AE", "#EDD382","#FC9E4F","#F55541",
                
                  "#E0B1CB","#BE95C4","#9F86C0","#5E548E"]);


var svg_3 = d3.select("#stack_bar_chart_2").append("svg")
  .attr("width",  width_3  + margin_3.left_3 + margin_3.right_3)
  .attr("height", height_3 + margin_3.top_3  + margin_3.bottom_3)
.append("g")
  .attr("transform", "translate(" + margin_3.left_3 + "," + margin_3.top_3 + ")");

//var tip = d3.tip()
//  .attr('class', 'd3-tip')
//  .offset([-10, 0])
//  .html(function(d) {
//    return "<strong>value:</strong> <span style='color_3:red'>" + d.name + "</span>";
//  })

d3.csv("data/output_new_2.csv", function (error, data) {

    var labelVar = 'year';
    var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});
    color_3.domain(varNames);

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

    x_3.domain(data.map(function (d) { return d.year; }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]);

    svg_3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_3 + ")")
        .call(xAxis_3);

    svg_3.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of Killed");

    var selection = svg_3.selectAll(".series")
        .data(data)
      .enter().append("g")
        .attr("class", "series")
        .attr("transform", function (d) { return "translate(" + x_3(d.year) + ",0)"; });

    selection.selectAll("rect")
      .data(function (d) { return d.mapping; })
    .enter().append("rect")
      .attr("width", x_3.rangeBand())
      .attr("y", function (d) { return y(d.y1); })
      .attr("height", function (d) { return y(d.y0) - y(d.y1); })
      .attr("class", function(d) {return "attack_country" + d.name.substring(0,4);})
      .style("fill", function (d) { return color_3(d.name); })
      .style("fill-opacity", 0.8)
//      .on('mouseover', tip.show)
//      .on('mouseout', tip.hide);
      .append("svg:title")
      .text(function(d){return "Country: " + d.name + "\n" + "Killed: " + (d.y1 -d.y0);});
//      .on("mouseover", function (d) { showPopover.call(this, d); })
//      .on("mouseout",  function (d) { removePopovers(); })
      

    var legend = svg_3.selectAll(".legend")
        .data(varNames.slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(25," + i * 30 + ")"; });

    legend.append("rect")
        .attr("x", width_3 - 15)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color_3)
        .attr("class", function(d) {return "attack_country" + d.substring(0,4);});

    legend.append("text")
        .attr("x", width_3)
        .attr("y", 6)
        .attr("dy", ".35em")
        //.style("text-anchor", "end")
        .text(function (d) { return d; })
        .on("mouseover", function(d) {
                svg_3.selectAll("rect.attack_country" + d.substring(0,4)).style("fill-opacity", 1.0).style("stroke", "#1C2541");
            })
        .on("mouseout", function(d) {
                svg_3.selectAll("rect.attack_country" + d.substring(0,4)).style("fill-opacity", 0.8)
                .style("stroke","none");
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
//        placement: 'auto top_3',
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
