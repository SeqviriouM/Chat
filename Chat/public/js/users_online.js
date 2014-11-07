function loadUserOnlineSection() {
  var width = 280,
    height = 340;

  var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; }),
    root = nodes[0],
    color = d3.scale.category10();


  var svg = d3.select(".users-online").append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.selectAll("circle")
    .data(nodes.slice(1))
    .enter().append("circle")
    .attr("r", function(d) { return d.radius; })
    .style("fill", function(d, i) { return color(i % 3); });
}

