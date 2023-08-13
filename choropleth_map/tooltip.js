const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")

const mouseover = function (event, d) {
    tooltip
        .style("opacity", 1)
        .attr("data-education", d.bachelorsOrHigher)
}

const mousemove = function (event, d) {
    tooltip
        .html(`${d.area_name}, ${d.state}: ${d.bachelorsOrHigher}%`)
        .style("left", (d3.pointer(event)[0] + 20) + "px")
        .style("top", (d3.pointer(event)[1] + 50) + "px")
}

const mouseleave = function (event, d) {
    tooltip
        .style("opacity", 0)
}