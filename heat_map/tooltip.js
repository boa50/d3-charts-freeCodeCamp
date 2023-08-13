const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")

const mouseover = function (event, d) {
    tooltip
        .style("opacity", 1)
        .attr("data-year", d.year)
    d3
        .select(this)
        .style("opacity", 1)
}

const mousemove = function (event, d) {
    tooltip
        .html(`${d.year} - ${monthNames[d.month - 1]}
        <br> ${(d.variance + baseTemp).toFixed(2)} ºC
        <br> ${d.variance > 0 ? "+" : "-"}${Math.abs(d.variance).toFixed(2)} ºC`)
        .style("left", (d3.pointer(event)[0] + 20) + "px")
        .style("top", (d3.pointer(event)[1] + 50) + "px")
}

const mouseleave = function (event, d) {
    tooltip
        .style("opacity", 0)
}