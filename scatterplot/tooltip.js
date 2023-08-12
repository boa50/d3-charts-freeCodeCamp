const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")

const mouseover = function (event, d) {
    tooltip
        .style("opacity", 1)
        .attr("data-year", d.Year)
    d3.select(this)
        .style("opacity", 1)
}

const mousemove = function (event, d) {
    tooltip
        .html(`Year: ${d.Year}<br> Name: ${d.Name}<br> Nationality: ${d.Nationality}<br> Time: ${d.Time}`)
        .style("left", (d3.pointer(event)[0] + 20) + "px")
        .style("top", (d3.pointer(event)[1] + 50) + "px")
}

const mouseleave = function (event, d) {
    tooltip
        .style("opacity", 0)
}