var link = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

var svg = d3.select("svg");
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y-%m-%d");

//set the ranges
var x = d3.scaleTime()
    .rangeRound([0, width]);
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function (d) { return x(d[0]) })
    .y(function (d) { return y(d[1]) });

fetch(link)
    .then(function (response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
                response.status);
            return;
        }

        response.json().then(function (dataJSON) {
            console.log(dataJSON);
            dataset = dataJSON.data;
            console.log(dataset);

            // format the data
            dataset.forEach(function (d) {
                d[0] = parseTime(d[0]);
                d[1] = +d[1];
            });

            // Scale the range of the data
            x.domain(d3.extent(dataset, function (d) { return d[0] }));
            y.domain([0, d3.max(dataset, function (d) { return d[1] })]);

            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .select(".domain")

            g.append("g")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")

            g.append("path")
                .datum(dataset)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 1.5)
                .attr("d", line);

        });
    }
    )
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    })