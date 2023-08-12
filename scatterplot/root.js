async function getData() {
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    let res = await fetch(url)
    let dataset = await res.json()

    return dataset
}

const WIDTH = 750
const HEIGHT = 500

const PADDING = {
    left: 100,
    right: 16,
    top: 48,
    bottom: 48
}

const title = d3.select("body")
    .append("h2")
    .attr("id", "title")
    .text("Doping in Professional Bicycle Racing")
    .append("h6")
    .attr("id", "subtitle")
    .text("35 Fastest times up Alpe d'Huez")

const svg = d3.select("body")
    .append("svg")
    .attr("id", "chart")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)

svg.append("text")
    .attr("class", "axis-text")
    .attr("transform", "rotate(-90)")
    .attr("y", PADDING.left / 2)
    .attr("x", 0 - ((HEIGHT - ((PADDING.bottom + PADDING.top) / 2)) / 2))
    .text("Time (in minutes)")

const getDateTime = (seconds) => {
    let date = new Date('1900-01-01T00:00:00Z')
    date.setSeconds(seconds)

    return date
}

const legend = svg.append("g")
    .attr("id", "legend")
    .attr("transform", "translate(30, 20)")
    .style("font-size", ".8em")

legend.append("text")
    .style("fill", "#f57c00")
    .text("Doping allegations")

legend.append("text")
    .attr("x", 110)
    .style("fill", "#757575")
    .text("|")

legend.append("text")
    .attr("x", 120)
    .style("fill", "#1976d2")
    .text("No doping allegations")

getData().then(dataset => {
    const xScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d.Year) - 1,
        d3.max(dataset, d => d.Year) + 1])
        .range([PADDING.left, WIDTH - PADDING.right])

    const yScale = d3.scaleTime()
        .domain([d3.min(dataset, d => getDateTime(d.Seconds)),
        d3.max(dataset, d => getDateTime(d.Seconds))])
        .range([PADDING.top, HEIGHT - PADDING.bottom])

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.utcFormat("%M:%S"))

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", d => d.Doping === "" ? "dot no-doping" : "dot dopping")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(getDateTime(d.Seconds)))
        .attr("r", 5)
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => getDateTime(d.Seconds))
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    svg.append("g")
        .attr("id", "x-axis")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + (HEIGHT - PADDING.bottom) + ")")
        .call(xAxis)

    svg.append("g")
        .attr("id", "y-axis")
        .attr("class", "axis")
        .attr("transform", "translate(" + PADDING.left + ", 0)")
        .call(yAxis)

})