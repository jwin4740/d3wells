const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;


var algorithmsArray = ["Logistic Regression", "Random Forest", "Gradient Boosting", "Naive Bayes"];
var parsedArray2 = [];
// constructor function for points
function Point(algorithm, tpr, fpr) {
    this.algorithm = algorithm;
    this.tpr = tpr;
    this.fpr = fpr;
}

var margin = {
        top: 15,
        right: 30,
        bottom: 60,
        left: 50
    },
    width = (screenWidth / 2.8) - margin.left - margin.right,
    height = (screenHeight / 2.5) - margin.top - margin.bottom;

/* 
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */

// setup x 
var xValue = function(d) {
        return d.fpr;
    }, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display

    xMap = function(d) {

        return xScale(xValue(d));
    }, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) {
        return d.tpr;
    }, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) {
        return yScale(yValue(d));
    }, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) {
    return d.algorithm;
};
color = d3.scale.category10();
// add the graph canvas to the body of the webpage
var chart1 = d3.select("#scatterDiv").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// // load data
d3.json("data/sample2.json", function(error, data) {
    for (var key in data) {

        var qObject = data[key];

        var len = qObject["tpr"].length;

        for (var i = 0; i < len; i++) { // x is first tpr then fpr
            var tempTrue = qObject["tpr"][i];
            var tempFalse = qObject["fpr"][i];


            var pointy = new Point(key, tempTrue, tempFalse);
            parsedArray2.push(pointy);

        }
    }




    var xDom = [d3.min(parsedArray2, xValue) - 0.05, d3.max(parsedArray2, xValue) + 0.05];
    var yDom = [d3.min(parsedArray2, yValue) - 0.05, d3.max(parsedArray2, yValue) + 0.05];

    xScale.domain(xDom);
    yScale.domain(yDom);


    // x-axis
    chart1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("x");

    // y-axis
    chart1.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(0)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("dx", "1em")
        .style("text-anchor", "end")
        .style("color", "white")
        .text("y");

    // draw dots
    chart1.selectAll(".dot")
        .data(parsedArray2)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) {
            return color(cValue(d));
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.algorithm + "<br/> (" + xValue(d) +
                    ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // draw legend
    var legend = chart1.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + (i * 20 + 125) + ")";
        });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });

    chart1.append("text")
        .attr("x", (width / 2))
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("SCATTER PLOT");
});