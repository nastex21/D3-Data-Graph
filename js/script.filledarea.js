var link = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

var svg = d3.select("svg");
var margin = { top: 20, right: 20, bottom: 30, left: 50 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y-%m-%d");

//set the range of the graph dimensions x = 0 => width; y = 0 => height;
var x = d3.scaleTime().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);

//make line, plots every piece of data
var line = d3.line()
    .x(function (d) { return x(d[0]) })
    .y(function (d) { return y(d[1]) });

//define area underneath line
var area = d3.area()
    .x(function (d) { return x(d[0]); })
    .y0(height)
    .y1(function (d) { return y(d[1]) });

fetch(link).then(function (response) {
    if (response.status !== 200) {
        console.log('Looks like there was a problem. Status code: ' + response.status);
        return;
    }

    response.json().then(function (dataJSON) {
        dataset = dataJSON.data;

        //format data
        dataset.forEach(function (d) {
            d[0] = parseTime(d[0]);
        })

        //set the range of the data
        x.domain(d3.extent(dataset, function (d) { return d[0] }));
        y.domain([0, d3.max(dataset, function (d) { return d[1] })]);

        //create x-axis label
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .select(".domain");

        //create y-axis label
        g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")

        g.append("path")
            .datum(dataset)
            .attr("class", "area")
            .attr("d", area)

        g.append("path")
            .datum(dataset)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    })
})
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    })