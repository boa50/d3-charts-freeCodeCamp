getData = async () =>
    await d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")


const WIDTH = 1300
const HEIGHT = 450

const PADDING = {
    left: 12,
    right: 12,
    top: 12,
    bottom: 6
}

const svg = d3
    .select("body")
    .append("svg")
    .attr("id", "chart")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)


getData().then(data => {
    const root = d3
        .hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)

    d3.treemap()
        .size([
            WIDTH - PADDING.left - PADDING.right,
            HEIGHT - PADDING.top - PADDING.bottom
        ])
        .padding(1)
        (root)

    const consoleDomain = []
    root.children.forEach(d => {
        consoleDomain.push(d.data.name)
    })

    const consoleColours = d3
        .scaleOrdinal(d3.schemeTableau10)
        .domain(consoleDomain)

    const groups = svg
        .selectAll(".group")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("class", "group")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    groups.each(function (d) {
        const group = d3.select(this)

        group
            .append("rect")
            .attr("x", d.x0 + PADDING.left)
            .attr("y", d.y0 + PADDING.top)
            .attr("width", d.x1 - d.x0)
            .attr("height", d.y1 - d.y0)
            .attr("class", "tile")
            .style("fill", consoleColours(d.data.category))
            .attr("data-name", d.data.name)
            .attr("data-category", d.data.category)
            .attr("data-value", d.data.value)

        group
            .append("text")
            .attr("x", d => d.x0 + PADDING.left + 3)
            .attr("y", d => d.y0 + PADDING.top + 11)
            .text(d => d.data.name)
            .call(wrap, d.x1 - d.x0)
            .attr("font-size", "0.7em")
            .attr("fill", "white")
    })

    const legend = d3
        .select("body")
        .append("div")
        .attr("id", "legend")
        .append("svg")
        .attr("width", 375)
        .attr("height", 150)


    const legendRectSize = 20
    legend
        .selectAll(".squares")
        .data(consoleDomain)
        .enter()
        .append("rect")
        .attr("x", (_, i) => 150 * (i % 3))
        .attr("y", (_, i) =>
            (Math.floor(i / 3) * (legendRectSize + 5)))
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .attr("class", "legend-item")
        .style("fill", d => consoleColours(d))

    legend
        .selectAll(".categories-names")
        .data(consoleDomain)
        .enter()
        .append("text")
        .attr("x", (_, i) => (150 * (i % 3)) + 25)
        .attr("y", (_, i) =>
            15 + (Math.floor(i / 3) * (legendRectSize + 5)))
        .text(d => d)
        .style("fill", d => consoleColours(d))
        .attr("font-size", "0.9em")
})