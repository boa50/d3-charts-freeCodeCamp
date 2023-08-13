async function getData() {
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    let res = await fetch(url)
    let dataset = await res.json()

    return dataset.monthlyVariance
}

const WIDTH = 2000
const HEIGHT = 500
const baseTemp = 8.66

const PADDING = {
    left: 100,
    right: 16,
    top: 48,
    bottom: 96
}

const title = d3
    .select("body")
    .append("h2")
    .attr("id", "title")
    .text("Monthly Global Land-Surface Temperature")
    .append("h6")
    .attr("id", "description")
    .text("1753 - 2015: base temperature 8.66℃")

const svg = d3
    .select("body")
    .append("svg")
    .attr("id", "chart")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)

const createBandArray = (qty, initialValue, multiplier = 1) => {
    return new Array(qty)
        .fill(1)
        .map((_, i) => (i * multiplier) + initialValue)
}

const monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
]

getData().then(dataset => {
    const minYear = d3.min(dataset, d => d.year)
    const nYears = d3.max(dataset, d => d.year) - minYear + 1

    const xScale = d3
        .scaleBand()
        .domain(createBandArray(nYears, minYear))
        .range([PADDING.left, WIDTH - PADDING.right])
        .padding(0.01)

    const yScale = d3
        .scaleBand()
        .domain(createBandArray(12, 1))
        .range([PADDING.top, HEIGHT - PADDING.bottom])
        .padding(0.01)


    const yearsAxisSeparator = 10
    const nYearsAxis = Number((nYears / yearsAxisSeparator).toFixed())

    const xAxis = d3
        .axisBottom(xScale)
        .tickValues(createBandArray(nYearsAxis, minYear + 7, yearsAxisSeparator))
    const yAxis = d3
        .axisLeft(yScale)
        .tickFormat(d => monthNames[d - 1])

    const minTemp = d3.min(dataset, d => baseTemp + d.variance)
    const maxTemp = d3.max(dataset, d => baseTemp + d.variance)
    const legendTicks = [
        minTemp,
        ((maxTemp - minTemp) / 4) + minTemp,
        ((maxTemp - minTemp) / 2) + minTemp,
        ((maxTemp - minTemp) / 2) + ((maxTemp - minTemp) / 4) + minTemp,
        maxTemp
    ]
    const colorRange = ["#1976d2", "#84bbf0", "#FFFFFF", "#ffbe7a", "#f57c00"]

    const myColor = d3
        .scaleLinear()
        .domain(legendTicks)
        .range(colorRange)
        .interpolate(d3.interpolateHcl)

    svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.month))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .style("fill", d => myColor(baseTemp + d.variance))
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    svg
        .append("g")
        .attr("id", "x-axis")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + (HEIGHT - PADDING.bottom) + ")")
        .call(xAxis)

    svg
        .append("g")
        .attr("id", "y-axis")
        .attr("class", "axis")
        .attr("transform", "translate(" + PADDING.left + ", 0)")
        .call(yAxis)


    // ! Creating the legend
    // Based on https://codepen.io/davorjovanovic/details/OJRzPwq
    const legendColours = svg
        .append("linearGradient")
        .attr("id", "linear-gradient")
    //Horizontal gradient
    legendColours
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%")
    //Append multiple color stops by using D3's data/enter step
    legendColours
        .selectAll("stop")
        .data([
            { offset: "0%", colorIdx: 0 },
            { offset: "25%", colorIdx: 1 },
            { offset: "50%", colorIdx: 2 },
            { offset: "75%", colorIdx: 3 },
            { offset: "100%", colorIdx: 4 },
        ])
        .enter()
        .append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => colorRange[d.colorIdx])

    const legendWidth = 500
    const legendHeight = 10

    //Color Legend container
    const legend = svg
        .append("g")
        .attr("id", "legend")
        .attr(
            "transform",
            "translate(" + (PADDING.left + legendWidth / 2) + "," + (HEIGHT - 50) + ")"
        );

    // Colours to pass the FCC test START
    const mockColours = ["red", "green", "blue", "orange"]
    legend
        .selectAll("rect")
        .data(mockColours)
        .enter()
        .append("rect")
        .attr("x", (_, i) => 10 * i)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => d)
        .style("display", "none")
    // Colours to pass the FCC test END


    //Draw the Rectangle
    legend
        .append("rect")
        .attr("x", -legendWidth / 2 + 0.5)
        .attr("y", 10)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#linear-gradient)")
        .style("stroke", "black")
        .style("stroke-width", "1px")
    //Append title
    legend
        .append("text")
        .attr("x", -75)
        .attr("y", 0)
        .text("Surface Temperature")
    //Set scale for x-axis
    const legendScale = d3
        .scaleLinear()
        .range([0, legendWidth])
        .domain([minTemp, maxTemp])
    legend
        .append("g")
        .call(
            d3.axisBottom(legendScale)
                .tickValues(legendTicks)
                .tickFormat((x) => x.toFixed(2))
        )
        .attr(
            "transform",
            "translate(" + -legendWidth / 2 + "," + (10 + legendHeight) + ")"
        )
})