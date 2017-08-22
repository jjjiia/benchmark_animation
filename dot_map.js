$(function() {
	queue()
		.defer(d3.csv, "546_0803.csv")
		.defer(d3.json,"topogrid.json")
    .await(dataDidLoad);
})

$("#topDifferences .hideTop").hide()

function dataDidLoad(error,dots,buildings) {
//make 1 svg for everything
    var chart = d3.select("#map").append("div")
    var mapSvg = d3.select("#map").append("svg").attr("width",1200).attr("height",1000)

    drawDots(dots,mapSvg)

}

function drawDots(data,svg){
    var colors = ["#d7ce39",
"#50e19b",
"#69e456",
"#45a980",
"#b3e240",
"#71e3c9",
"#90da84",
"#5fab37",
"#65bfdc",
"#489dd1",
"#76d8ac"]
	var projection = d3.geo.mercator().scale(20000000).center([-71.089447,42.362])
    var r = d3.scale.linear().domain([0,20000]).range([8,20])
    var t = d3.scale.linear().domain([80317101714,80317205959]).range([0,10000])
    var o = d3.scale.linear().domain([0.07,2.82]).range([0,1])
    var c = d3.scale.linear().domain([-0.07,.35]).range([0,colors.length-1])
    
    svg.selectAll(".dots")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","dots")
        .attr("r",function(d){
            return 0
        })
        .attr("cx",function(d){
            var lat = parseFloat(d.lat)
            var lng = parseFloat(d.lng)
            //to get projected dot position, use this basic formula
            var projectedLng = projection([lng,lat])[0]
            return projectedLng
        })
        .attr("cy",function(d){
            var lat = parseFloat(d.lat)
            var lng = parseFloat(d.lng)
            var projectedLat = projection([lng,lat])[1]
            return projectedLat
        })
        .attr("fill",function(d){
          //  return "$000"
            return colors[Math.round(c(d["column o"])) ]
        })
	    .style("opacity",function(d){
	        return o(d["column d"])
	    })
        .transition()
        .duration(1000)
        .delay(function(d){
            return t(d.timestamp)
        })
        .attr("r",function(d){
            d3.select(this).transition()
            .delay(function(d){
            return t(d.timestamp)+1000
        })
        .duration(4000)
        .attr("r",0)
            return r(d["column a"])
        })        
}