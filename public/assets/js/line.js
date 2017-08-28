var algorithmsArray = [];
var algLen;
var parsedArray = [];
// constructor function for points
function Point(algorithm, tpr, fpr) {
    this.algorithm = algorithm;
    this.tpr = tpr;
    this.fpr = fpr;


}
// Set the dimensions of the canvas / graph
var margin = {
        top: 15,
        right: 30,
        bottom: 60,
        left: 50
    },
    width = (screenWidth / 2.8) - margin.left - margin.right,
    height = (screenHeight / 2.5) - margin.top - margin.bottom;

// Parse the date / time


// Set the ranges
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

// fix this for dynamic colors
const graphColorsArray = ["green", "purple", "green", "brown", "#800000", "#33FFF9"]

// Define the line
var modelLine = d3.svg.line()
    .x(function(d) {
        return xScale(d.fpr);
    })
    .y(function(d) {
        return yScale(d.tpr);
    });

function drawLine(pArray, name) {
    // construct temporary array
    var truncArray = [];


    for (var i = 0; i < pArray.length; i++) {
        if (pArray[i].algorithm === name) {
            truncArray.push(pArray[i]);
        }
    }

    return modelLine(truncArray);

}
// Adds the chart2 canvas
var chart2 = d3.select("#lineDiv")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("data/roc.json", function(error, data) {
    for (var key in data) {
        var qObject = data[key];
        algorithmsArray.push(key);
        var len = qObject["tpr"].length;
        for (var i = 0; i < len; i++) { // x is first tpr then fpr
            var tempTrue = qObject["tpr"][i];
            var tempFalse = qObject["fpr"][i];
            var pointy = new Point(key, tempTrue, tempFalse);
            parsedArray.push(pointy);

        }
    }




    var xDom = [d3.min(parsedArray, xValue) - 0.05, d3.max(parsedArray, xValue) + 0.05];
    var yDom = [d3.min(parsedArray, yValue) - 0.05, d3.max(parsedArray, yValue) + 0.05];
    xScale.domain(xDom);
    yScale.domain(yDom);




    legendSpace = width / parsedArray.length; // spacing for legend

    algLen = algorithmsArray.length;

    for (var i = 0; i < algLen; i++) {

        chart2.append("path")
            .attr("class", "line")
            .attr("stroke-width", "2")
            .style("stroke", graphColorsArray[i])
            .attr("d", drawLine(parsedArray, algorithmsArray[i]));

    }

    // x-axis
    chart2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("FALSE POSITIVE RATE");

    // y-axis
    chart2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("TRUE POSITIVE RATE");

    // draw legend

    var legend2 = chart2.selectAll(".legend2")
        .data(["Random Forest"])
        .enter().append("g")
        .attr("class", "legend2")
        .attr("transform", function(d, i) {
            return "translate(0," + (i * 20 + 125) + ")";
        });

    // draw legend2 colored rectangles
    legend2.append("rect")
        .attr("x", width - 15)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", "green");

    // draw legend2 text
    legend2.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });


    chart2.append("text")
        .attr("x", (width / 2))
        .attr("y", -3)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("ROC curve");

});