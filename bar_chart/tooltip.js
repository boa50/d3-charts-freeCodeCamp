const getQuarter = dt => `Q${Math.floor(dt.getMonth() / 3 + 1)} ${dt.getFullYear()}`

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
})

const tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")

const mouseover = function (event, d) {
    tooltip
        .style("opacity", 1)
        .attr("data-date", d[0].toISOString().substring(0, 10))
    d3.select(this)
        .style("opacity", 1)
}

const mousemove = function (event, d) {
    tooltip
        .html(`${getQuarter(d[0])} <br> GDP: ${currencyFormatter.format(d[1])}B`)
        .style("left", (d3.pointer(event)[0] + 20) + "px")
        .style("top", (d3.pointer(event)[1] + 50) + "px")
}

const mouseleave = function (event, d) {
    tooltip
        .style("opacity", 0)
}