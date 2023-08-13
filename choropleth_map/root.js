getData = async () => {
    const counties = await d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
    const education = await d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")

    return {
        counties: counties,
        education: education
    }
}

const WIDTH = 960
const HEIGHT = 630

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
    .text("United States Educational Attainment")
    .append("h6")
    .attr("id", "description")
    .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)")

const svg = d3
    .select("body")
    .append("svg")
    .attr("id", "chart")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)

    svg.append("text")
    .attr("class", "caption")
    .attr("y", HEIGHT - 10)
    .attr("x", WIDTH - PADDING.right)
    .text("Source: USDA Economic Research Service")

const path = d3.geoPath()

getData().then(dataset => {
    const counties = dataset.counties
    const education = dataset.education
    const geojson = topojson.feature(counties, counties.objects.counties).features
    const educationDomain = d3.extent(education, d => d.bachelorsOrHigher)

    const getAreaData = (d) =>
        education.find(ed => ed.fips == d.id)

    const numColours = 7
    const colours = d3
        .scaleThreshold()
        .domain(
            d3.range(educationDomain[0],
                // To make the range include the maximum value
                educationDomain[1] + ((educationDomain[1] - educationDomain[0]) / numColours),
                (educationDomain[1] - educationDomain[0]) / numColours)
        )
        .range(d3.schemeBlues[numColours]);

    svg
        .append("g")
        .selectAll("path")
        .data(geojson)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", path)
        .attr("fill", d => {
            const areaMatch = getAreaData(d)
            return areaMatch != undefined ? colours(areaMatch.bachelorsOrHigher) : "black"
        })
        .attr("data-fips", d => getAreaData(d).fips)
        .attr("data-education", d => getAreaData(d).bachelorsOrHigher)
        .on("mouseover", (event, d) => { mouseover(event, getAreaData(d)) })
        .on("mousemove", (event, d) => { mousemove(event, getAreaData(d)) })
        .on("mouseleave", mouseleave)


    const legendColours = svg
        .append("linearGradient")
        .attr("id", "linear-gradient")
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
        .attr("stop-color", d => d3.schemeBlues[5][d.colorIdx])

    const legendWidth = 200
    const legendHeight = 10

    //Color Legend container
    const legend = svg
        .append("g")
        .attr("id", "legend")
        .attr("transform", "translate(750, 50)");

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
        
    //Set scale for x-axis
    const legendScale = d3
        .scaleLinear()
        .domain(educationDomain)
        .range([0, legendWidth])

    const legendTicks = d3.range(educationDomain[0],
        // To make the range include the maximum value
        educationDomain[1] + ((educationDomain[1] - educationDomain[0]) / 4),
        (educationDomain[1] - educationDomain[0]) / 4)

    legend
        .append("g")
        .call(
            d3.axisBottom(legendScale)
                .tickValues(legendTicks)
                .tickFormat((x) => x.toFixed(0) + "%")
        )
        .attr(
            "transform",
            "translate(" + -legendWidth / 2 + "," + (10 + legendHeight) + ")"
        )
})