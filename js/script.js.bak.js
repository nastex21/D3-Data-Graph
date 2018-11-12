var link = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var margin = {
    top: 50,
    bottom: 60,
    left: 60,
    right: 20
};
var width = 800;
var height = 800;
var dataset;
var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%B %Y");

var svg = d3.select('body')
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .attr('id', "svg")

var chart = svg
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


d3.json(link).then(function (data) {
    // format the data
    dataset = data.data;
    dataset.forEach(function (d) {
        d[0] = parseTime(d[0]);        
        d[1] = +d[1];
    });

    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, function (d) { return d[0] }))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, function (d) { return d[1] })).nice()
        .range([height, 0]);

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale)
            .ticks(20)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale)
            .ticks(10)
    }

    // add the X gridlines
    chart.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

    // add the Y gridlines
    chart.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    chart.selectAll("rect")
        .data(dataset)
        .enter()
        .append('rect')
        .attr("class", "bar")
        .attr('data-date', (d) => formatTime(d[0]))
        .attr('data-gdp', (d) => d[1])
        .attr('Date: ', (d) => xScale(d[0]))
        .attr('width', width / dataset.length)
        .attr('GDP: ', (d) => yScale(d[1]))
        .attr('height', (d) => height - yScale(d[1]))
        .attr('fill', "green")
        .on("mousemove", function (d) { 
            //mouse is on chart and info pops up
            d3.select('#tooltip')
                .style("left", d3.event.x + "px")
                .style("top", (d3.event.y + 50) + "px")
                .html("x: " + formatTime(d[0]) + "<br/>" + "y: " + d[1])
                .attr("data-date", formatTime(d[1]));

            d3.select("#tooltip").classed("hidden", false);
        }
        )
        //when mouse is out of range of chart
        .on("mouseout", function () {
            d3.select("#tooltip").classed("hidden", true);
        })

    //vertical side of chart
    chart.append('g')
        .attr('transform', "translate(0, " + height + ")")
        .attr("id", "x-axis")
        .call(d3.axisBottom(xScale));

    //labels on bottom of chart
    chart.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top) + ")")
        .style("text-anchor", "middle")
        .text("YEAR");

    //ticks on left (vertical) side of chart
    chart.append('g')
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale).ticks(20));

    //label on left side of chart
    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("GDP (Per Billions of Dollars)");

});

window.addEventListener('resize', function() {
    console.log("The window was resized!");
  });