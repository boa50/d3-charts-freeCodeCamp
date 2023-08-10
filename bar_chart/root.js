async function getData() {
    let res = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    let resJson = await res.json()
    let dataset = resJson.data
        .map(x => [new Date(x[0] + "T00:00:00Z"), x[1]])
    return dataset
}

const WIDTH = 1000
const HEIGHT = 350

const PADDING = {
    left: 100,
    right: 16,
    top: 16,
    bottom: 48
}

const title = d3.select("body")
    .append("h2")
    .attr("id", "title")
    .text("USA GDP")

const svg = d3.select("body")
    .append("svg")
    .attr("id", "chart")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)

svg.append("text")
    .attr("class", "axis-text")
    .attr("transform", "rotate(-90)")
    .attr("y", PADDING.left / 4)
    .attr("x", 0 - ((HEIGHT - ((PADDING.bottom + PADDING.top) / 2)) / 2))
    .text("GDP (in billions)")

svg.append("text")
    .attr("class", "caption")
    .attr("y", HEIGHT - 10)
    .attr("x", WIDTH - PADDING.right)
    .text("Source: https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")

getData().then(dataset => {
    const xScale = d3.scaleTime()
        .domain([d3.min(dataset, d => d3.timeDay.offset(d[0], -150)),
        d3.max(dataset, d => d3.timeDay.offset(d[0], 150))])
        .range([PADDING.left, WIDTH - PADDING.right])

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d[1])])
        .range([HEIGHT - PADDING.bottom, PADDING.top])

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format("$,.2f"))

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d3.timeDay.offset(d[0], -75)))
        .attr("y", d => yScale(d[1]))
        .attr("width", d => xScale(d3.timeDay.offset(d[0], 100)) - xScale(d[0]))
        .attr("height", d => HEIGHT - yScale(d[1]) - PADDING.bottom)
        .attr("data-date", d => d[0].toISOString().substring(0, 10))
        .attr("data-gdp", d => d[1])
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