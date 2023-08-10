async function getData() {
    let res = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
    let resJson = await res.json();
    let dataset = resJson.data
                         .map(x => [new Date(x[0] + "T00:00:00Z"), x[1]]);
    
    console.log(dataset[1])
    console.log(dataset[1][0].toISOString().substring(0, 10))
    console.log(dataset[1][0].getFullYear())
    console.log(dataset[1][0].getMonth() + 1)
    return dataset
  }
  
  const WIDTH = 500;
  const HEIGHT = 250;
  const PADDING = 48;
  
  d3.select("body")
    .append("h1")
    .attr("id", "title")
    .text("Chart Title");
  
  d3.select("body")
    .append("svg")
    .attr("id", "chart")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);
  
  getData().then(dataset => {
    const xScale = d3.scaleTime()
               .domain([d3.min(dataset, d => d[0]), d3.max(dataset, d => d[0])])
               .range([PADDING, WIDTH - PADDING]);
    
    const yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset, d => d[1])])
               .range([HEIGHT - PADDING, PADDING]);
    
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    const svg = d3.select("svg");
    
    const tooltip = d3.select("body")
      .append("div")
      .style("opacity", 0)
      .attr("id", "tooltip")
      .style("background-color", "white")
      .style("position", "absolute")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");
    
    const mouseover = function(event, d) {
      tooltip
        .style("opacity", 1)
        .attr("data-date", d[0].toISOString().substring(0, 10))
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    const mousemove = function(event, d) {
      tooltip
        .html("The exact value of<br>this cell is: " + d[1])
        .style("left", (d3.pointer(event)[0] + 20) + "px")
        .style("top", (d3.pointer(event)[1] + 50) + "px")
    }
    const mouseleave = function(event, d) {
      tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
    }
    
    svg.selectAll("rect")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", d => xScale(d[0]))
       .attr("y", d => yScale(d[1]))
       .attr("width", 1)
       .attr("height", d => HEIGHT - yScale(d[1]) - PADDING)
       .attr("data-date", d => d[0].toISOString().substring(0, 10))
       .attr("data-gdp", d => d[1])
       .on("mouseover", mouseover)
       .on("mousemove", mousemove)
       .on("mouseleave", mouseleave);
    
    svg.append("g")
       .attr("id", "x-axis")
       .attr("transform", "translate(0, " + (HEIGHT - PADDING) + ")")
       .call(xAxis);
    svg.append("g")
       .attr("id", "y-axis")
       .attr("transform", "translate(" + PADDING + ", 0)")
       .call(yAxis);
  })