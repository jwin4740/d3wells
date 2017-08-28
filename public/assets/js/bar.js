var barParsedData = [];
// constructor function for points
function Bar(feature, value) {
    this.feature = feature;
    this.value = value;
}

function getBarNames(data) {
    var domainArray = [];
    for (var i in data) {
        domainArray.push(i);

    }

    return domainArray;
}

function getValuesAsArray(data) {
    var valueArray = [];
    for (var i in data) {
        valueArray.push(data[i]);

    }

    return valueArray;

}

function formatBarData(data) {

    for (var i in data) {
        var tempBar = new Bar(i, data[i]);
        barParsedData.push(tempBar);
    }

}
var margin = {
        top: 15,
        right: 30,
        bottom: 60,
        left: 50
    },
    width = (screenWidth / 2.8) - margin.left - margin.right,
    height = (screenHeight / 2.5) - margin.top - margin.bottom;



var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

var y = d3.scale.linear().range([height, 5]);

var xAxis3 = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

var chart3 = d3.select("#barDiv").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/sample_bar.json", function(error, data) {
    formatBarData(data);
    x.domain(getBarNames(data));


    // clean up maxValue function using formatted bar data
    var maxValue = d3.max(getValuesAsArray(data));
    var domainStructure = maxValue + (maxValue / 5);
    y.domain([0, domainStructure]);

    chart3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis3)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-60)");

    chart3.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("font-weight", "bolder")
        .style("text-anchor", "end")
        .style("font-size", "13px")
        .text("Value");

    chart3.selectAll("bar")
        .data(barParsedData)
        .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function(d) {
            return x(d.feature);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {

            return y(d.value);
        })
        .attr("height", function(d) {
            return height - y(d.value);
        });


    var legend3 = chart3.selectAll(".legend3")
        .data(["Random Forest"])
        .enter().append("g")
        .attr("class", "legend3")
        .attr("transform", function(d, i) {
            return "translate(0," + (i * 20 + 125) + ")";
        });

    // draw legend3 colored rectangles
    legend3.append("rect")
        .attr("x", width - 15)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", "steelblue");

    // draw legend3 text
    legend3.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });

    chart3.append("text")
        .attr("x", (width / 2))
        .attr("y", 7)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("VARIABLE IMPORTANCE");

});