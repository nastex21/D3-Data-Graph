var link = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var dataset;
const w = 800,
    h = 500;
const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
var minDate, maxDate, xScale, xAxis, yScale, yAxis, minNum, maxNum;
const padding = 60;

var ylabel = function () {
    svg.append("g")
        .attr("transform", "translate(" + padding + "," + 0 + ")")
        .call(yAxis);
}

var xlabel = function () {
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    ylabel();
}

var runThis = function () {
    svg.selectAll("circle")
        .data(dataset.data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(new Date(d[0])))
        .attr("cy", (d) => yScale(d[1]))
        .attr("r", (d) => 4)
    /* svg.selectAll("rect")
        .data(dataset.data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 30)
        .attr("y", (d, i) => h - d[1])
        .attr("width", 25)
        .attr("height",(d, i) => h - (d[1] / 100)) */

    xlabel();
}

fetch(link)
    .then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }

            response.json().then(function (dataJSON) {
                dataset = dataJSON;
                minDate = d3.min(dataJSON.data, (d) => d[0]);
                maxDate = d3.max(dataJSON.data, (d) => d[0]);
                xScale = d3.scaleTime()
                    .domain([new Date(minDate), new Date(maxDate)])
                    .range([padding, w - padding]);

                xAxis = d3.axisBottom(xScale);

                minNum = d3.min(dataJSON.data, (d) => d[1]);
                maxNum = d3.max(dataJSON.data, (d) => d[1]);
                yScale = d3.scaleLinear()
                    .domain([0, maxNum])
                    .range([h - padding, padding]);

                yAxis = d3.axisLeft(yScale);
                runThis();
            });
        }
    )
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    });
