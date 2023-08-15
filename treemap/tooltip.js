const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")

const mouseover = function (_, d) {
    tooltip
        .style("opacity", 1)
        .attr("data-value", d.data.value)
    d3
        .select(this)
        .style("opacity", 1)
}

const mousemove = function (event, d) {
    tooltip
        .html(`Game: ${d.data.name}
        <br>Platform: ${d.data.category}
        <br>Sales: ${d.data.value}`)
        .style("left", (d3.pointer(event)[0] + 20) + "px")
        .style("top", (d3.pointer(event)[1] + 50) + "px")
}

const mouseleave = function (_, d) {
    tooltip
        .style("opacity", 0)
}