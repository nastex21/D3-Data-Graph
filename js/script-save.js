//4-26
//why save? To mess around with axis ticks, etc for grid

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
        .domain(d3.extent(dataset, function (d) { return d[0] })).nice()
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, function (d) { return d[1] })).nice()
        .range([height, 0]);

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale)
            .ticks(15)
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
            .tickSize(-height)
            .tickFormat("")
        )

    // add the Y gridlines
    chart.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

    chart.selectAll("rect")
        .data(dataset)
        .enter()
        .append('rect')
        .attr("class", "bar")
        .attr('x', (d) => xScale(d[0]))
        .attr('width', width / dataset.length)
        .attr('y', (d) => yScale(d[1]))
        .attr('height', (d) => height - yScale(d[1]))

    chart.append('g')
        .attr('transform', "translate(0, " + height + ")")
        .attr("id", "x-axis")
        .call(d3.axisBottom(xScale));

    chart.append('g')
        .attr("id", "y-axis")
        .call(d3.axisLeft(yScale));
});