import * as d3 from 'd3';
import $ from 'jquery';

import {
  WIDTH,
  HEIGHT
} from './../utils';

let CONSTANT = WIDTH * 0.3;

var TimeKnots = {
  draw: function(id, events, options){
    var cfg = {
      width: 900,
      height: 1600,
      radius: 10,
      lineWidth: 4,
      color: "#999",
      background: "#FFF",
      dateFormat: "%Y/%m/%d %H:%M:%S",
      horizontalLayout: true,
      showLabels: false,
      labelFormat: "%Y/%m/%d %H:%M:%S",
      addNow: false,
      seriesColor: d3.scaleOrdinal(d3.schemeCategory20),
      dateDimension: true
    };

    const SEPARATION_AMOUNT = 150;
    const DISP_Y = 75;
    var returnColor;
    var returnRadius;

    //default configuration overrid
    if(options != undefined){
      for(var i in options){
        cfg[i] = options[i];
      }
    }
    if(cfg.addNow != false){
      events.push({date: new Date(), name: cfg.addNowLabel || "Today"});
    }
    var tip = d3.select(id)
    .append('div')
    .attr("class", "timeline-div")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("font-family", "Helvetica Neue")
    .style("font-weight", "300")
    .style("background","rgba(0,0,0,0.5)")
    .style("color", "white")
    .style("padding", "5px 10px 5px 10px")
    .style("-moz-border-radius", "8px 8px")
    .style("border-radius", "8px 8px");
    var svg = d3.select(id).append('svg').attr("class", "timeline-svg").attr("width", WIDTH).attr("height", cfg.height + 360);
    //Calculate times in terms of timestamps
    if(!cfg.dateDimension){
      var timestamps = events.map(function(d){return  d.value});//new Date(d.date).getTime()});
      var maxValue = d3.max(timestamps);
      var minValue = d3.min(timestamps);
    }else{
      var timestamps = events.map(function(d){return  Date.parse(d.date);});//new Date(d.date).getTime()});
      var maxValue = Date.parse(cfg.globalMax);
      var minValue = Date.parse(cfg.globalMin);
    }
    var margin = (d3.max(events.map(function(d){return d.radius})) || cfg.radius)*1.5+cfg.lineWidth;
    var step = (cfg.horizontalLayout)?((cfg.width-2*margin)/(maxValue - minValue)):((cfg.height-2*margin)/(maxValue - minValue));

    var series = [];
    if(maxValue == minValue){step = 0;if(cfg.horizontalLayout){margin=cfg.width/2}else{margin=cfg.height/2}}

    var linePrevious = {
      x1 : null,
      x2 : null,
      y1 : null,
      y2 : null
    }

    var count = 0;
    var count2 = 0;
    var lastY = 0;
    var lastScalar = false;
    var lastScalarY = false;

    svg.selectAll("line")
    .data(events).enter().append("line")
    .attr("class", "timeline-line")
      .attr("x1", function(d){
                      var ret;
                      if(cfg.horizontalLayout){
                        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                        ret = Math.floor(step*(datum - minValue) + margin)
                      }
                      else{
                        const val = cfg.displacement == 0 ? cfg.radius*2 : cfg.width*cfg.displacement
                        ret = Math.floor(val);
                      }
                      linePrevious.x1 = ret
                      return ret + CONSTANT
                      })
    .attr("x2", function(d){
                      if (linePrevious.x1 != null){
                          return linePrevious.x1 + CONSTANT
                      }
                      if(cfg.horizontalLayout){
                        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                        ret = Math.floor(step*(datum - minValue ))
                      }
                      const val = cfg.displacement == 0 ? cfg.radius*2 : cfg.width*cfg.displacement;
                      return Math.floor(val);
                      })
    .attr("y1", function(d){
                      var ret;
                      if(cfg.horizontalLayout){
                        ret = Math.floor(cfg.height/2)
                      }
                      else{
                        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                        ret = Math.floor(step*(datum - minValue)) + margin
                      }
                      linePrevious.y1 = ret
                      return ret + DISP_Y
                      })
    .attr("y2", function(d){
                      if (linePrevious.y1 != null){
                        return linePrevious.y1 + DISP_Y
                      }
                      if(cfg.horizontalLayout){
                        return Math.floor(cfg.height/2) + DISP_Y
                      }
                      var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
                      return Math.floor(step*(datum - minValue)) + DISP_Y
                      })
    .style("stroke", function(d){
                      if(d.color != undefined){
                        return d.color
                      }
                      if(d.series != undefined){
                        if(series.indexOf(d.series) < 0){
                          series.push(d.series);
                        }
                        return cfg.seriesColor(series.indexOf(d.series));
                      }
                      return cfg.color})
    .style("stroke-width", cfg.lineWidth);
    if (cfg.globalMax != cfg.expectedGrad.timestamp) {
      svg.append("line")
      .attr("x1", CONSTANT/5)
      .attr("y1", function(d){
        var ret;
        var datum = new Date(cfg.expectedGrad.timestamp).getTime();
        ret = Math.floor(step*(datum - minValue)) + margin
        linePrevious.y1 = ret
        return ret + DISP_Y
      })
      .attr("x2", WIDTH - CONSTANT/10)
      .attr("y2", function(d){
        var ret;
        var datum = new Date(cfg.expectedGrad.timestamp).getTime();
        ret = Math.floor(step*(datum - minValue)) + margin
        linePrevious.y1 = ret
        return ret + DISP_Y
      })
      .style("stroke", "grey")
      .style("stroke-dasharray", "5,5")
    }

    count = 0;
    lastScalar = false;
    svg.selectAll("line_2")
      .data(events).enter().append("line")
      .attr("class", function(d) {
        return "timeline-line " + d.timestamp + "-" + d.id;
      })
      .attr("x1", function(d) {
        if(cfg.horizontalLayout){
          var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
          var x=  Math.floor(step*(datum - minValue) + margin);
          return x + CONSTANT;
        }
        const val = cfg.displacement == 0 ? cfg.radius*2 : cfg.width*cfg.displacement
        return Math.floor(val) + CONSTANT
      })
      .attr("x2", function(d) {
        var scalar = 1/2;
        if(count > 0) {
          const currentY = calculateY(d);
          const distance = currentY - lastY;
          if (distance <= 142) {
            scalar = lastScalar ? 1/2 : 2.5;
            lastScalar = !lastScalar;
          }
        }
        count++;
        lastY = calculateY(d);
        if(cfg.horizontalLayout){
          var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
          var x=  Math.floor(step*(datum - minValue) + margin);
          return x + (scalar * SEPARATION_AMOUNT) + CONSTANT;
        }
        const val = cfg.displacement == 0 ? cfg.radius*2 : cfg.width*cfg.displacement
        return Math.floor(val) + (scalar * SEPARATION_AMOUNT)/2 + CONSTANT;
      })
      .attr("y1", function(d) {
        if(cfg.horizontalLayout){
          return Math.floor(cfg.height/2) + DISP_Y
        }
        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
        return Math.floor(step*(datum - minValue) + margin) + DISP_Y
      })
      .attr("y2", function(d) {
        const displacement = d.radius ? d.radius : cfg.radius;
        if(cfg.horizontalLayout){
          return Math.floor(cfg.height/2) + DISP_Y
        }
        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
        return Math.floor(step*(datum - minValue) + margin) + DISP_Y;
      })
      .style("stroke", function(d){
                        if(d.color != undefined){
                          return d.color
                        }
                        if(d.series != undefined){
                          if(series.indexOf(d.series) < 0){
                            series.push(d.series);
                          }
                          return cfg.seriesColor(series.indexOf(d.series));
                        }
                        return cfg.color})
      .style("stroke-width", cfg.lineWidth);

      count = 0;
      count2 = 0;
      var countY1 = 0;
      var countY2 = 0;
      lastScalar = false;
      var lastScalar2 = false;
      lastScalarY = false;
      var lastScalarY2 = false;
      svg.selectAll("line_3")
        .data(events).enter().append("line")
        .attr("class", function(d) {
          return "timeline-line " + d.timestamp + "-" + d.id;
        })
        .attr("x1", function(d) {
          var scalar = 1/2;
          if(count2 > 0) {
            const currentY = calculateY(d);
            const distance = currentY - lastY;
            if (distance <= 142) {
              scalar = lastScalar ? 1/2 : 2.5;
              lastScalar = !lastScalar;
            }
          }
          count2++;
          lastY = calculateY(d);
          if(cfg.horizontalLayout){
            var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
            var x=  Math.floor(step*(datum - minValue) + margin);
            return x + (scalar * SEPARATION_AMOUNT) + CONSTANT;
          }
          const val = cfg.displacement == 0 ? cfg.radius*2 : cfg.width*cfg.displacement
          return Math.floor(val) + (scalar * SEPARATION_AMOUNT)/2 + CONSTANT;
        })
        .attr("x2", function(d) {
          var scalar = 1/2;
          if(count > 0) {
            const currentY = calculateY(d);
            const distance = currentY - lastY;
            if (distance <= 142) {
              scalar = lastScalar2 ? 1/2 : 2.5;
              lastScalar2 = !lastScalar2;
            }
          }
          count++;
          lastY = calculateY(d);
          if(cfg.horizontalLayout){
            var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
            var x=  Math.floor(step*(datum - minValue) + margin);
            return x + (scalar * SEPARATION_AMOUNT) + CONSTANT;
          }
          const val = cfg.displacement == 0 ? cfg.radius*2 : cfg.width*cfg.displacement
          return Math.floor(val) + (scalar * SEPARATION_AMOUNT) + CONSTANT;
        })
        .attr("y1", function(d) {
          var bias = 0
          if(countY1 > 0) {
            const currentY = calculateY(d);
            const distance = currentY - lastY;
            if (distance <= 142) {
              bias = lastScalarY ? 0 : 75;
              lastScalarY = !lastScalarY;
            }
          }
          countY1++;
          lastY = calculateY(d);
          if(cfg.horizontalLayout){
            return Math.floor(cfg.height/2) + bias + DISP_Y;
          }
          var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
          return Math.floor(step*(datum - minValue) + margin) + bias + DISP_Y;
        })
        .attr("y2", function(d) {
          var bias = 0
          if(countY2 > 0) {
            const currentY = calculateY(d);
            const distance = currentY - lastY;
            if (distance <= 142) {
              bias = lastScalarY2 ? 0 : 75;
              lastScalarY2 = !lastScalarY2;
            }
          }
          countY2++;
          lastY = calculateY(d);
          const displacement = d.radius ? d.radius : cfg.radius;
          if(cfg.horizontalLayout){
            return Math.floor(cfg.height/2) + bias + DISP_Y;
          }
          var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
          return Math.floor(step*(datum - minValue) + margin) + bias + DISP_Y;
        })
        .style("stroke", function(d){
                          if(d.color != undefined){
                            return d.color
                          }
                          if(d.series != undefined){
                            if(series.indexOf(d.series) < 0){
                              series.push(d.series);
                            }
                            return cfg.seriesColor(series.indexOf(d.series));
                          }
                          return cfg.color})
        .style("stroke-width", cfg.lineWidth);

        count = 0;
        count2 = 0;
        countY1 = 0;
        countY2 = 0;
        lastScalar = false;
        lastScalar2 = false;
        lastScalarY = false;
        lastScalarY2 = false;
        svg.selectAll("connector")
          .data(events).enter().append("line")
          .attr("class", function(d) {
            return "timeline-line " + d.timestamp + "-" + d.id;
          })
          .attr("x1", function(d) {
            var scalar = 1/2;
            if(count > 0) {
              const currentY = calculateY(d);
              const distance = currentY - lastY;
              if (distance <= 142) {
                scalar = lastScalar ? 1/2 : 2.5;
                lastScalar = !lastScalar;
              }
            }
            count++;
            lastY = calculateY(d);
            if(cfg.horizontalLayout){
              var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
              var x=  Math.floor(step*(datum - minValue) + margin);
              return x + (scalar * SEPARATION_AMOUNT) + CONSTANT;
            }
            const val = cfg.displacement == 0 ? cfg.radius*2 : cfg.width*cfg.displacement
            return Math.floor(val) + (scalar * SEPARATION_AMOUNT)/2 + CONSTANT;
          })
          .attr("x2", function(d) {
            var scalar = 1/2;
            if(count2 > 0) {
              const currentY = calculateY(d);
              const distance = currentY - lastY;
              if (distance <= 142) {
                scalar = lastScalar2 ? 1/2 : 2.5;
                lastScalar2 = !lastScalar2;
              }
            }
            count2++;
            lastY = calculateY(d);
            if(cfg.horizontalLayout){
              var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
              var x=  Math.floor(step*(datum - minValue) + margin);
              return x + (scalar * SEPARATION_AMOUNT) + CONSTANT;
            }
            const val = cfg.displacement == 0 ? cfg.radius*2 : cfg.width*cfg.displacement
            return Math.floor(val) + (scalar * SEPARATION_AMOUNT)/2 + CONSTANT;
          })
          .attr("y1", function(d) {
            if(cfg.horizontalLayout){
              return Math.floor(cfg.height/2)
            }
            var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
            return Math.floor(step*(datum - minValue) + margin) + DISP_Y
          })
          .attr("y2", function(d) {
            var bias = 0
            if(countY2 > 0) {
              const currentY = calculateY(d);
              const distance = currentY - lastY;
              if (distance <= 142) {
                bias = lastScalarY ? 0 : 75;
                lastScalarY = !lastScalarY;
              }
            }
            countY2++;
            lastY = calculateY(d);
            const displacement = d.radius ? d.radius : cfg.radius;
            if(cfg.horizontalLayout){
              return Math.floor(cfg.height/2) + bias + DISP_Y;
            }
            var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
            return Math.floor(step*(datum - minValue) + margin) + bias + DISP_Y;
          })
          .style("stroke", function(d){
                            if(d.color != undefined){
                              return d.color
                            }
                            if(d.series != undefined){
                              if(series.indexOf(d.series) < 0){
                                series.push(d.series);
                              }
                              return cfg.seriesColor(series.indexOf(d.series));
                            }
                            return cfg.color})
          .style("stroke-width", cfg.lineWidth);

    svg.selectAll("circle")
    .data(events).enter()
    .append("circle")
    .attr("class", function(d) {
      return "timeline-line " + d.timestamp + "-" + d.id;
    })
    .attr("r", function(d){if(d.radius != undefined){return d.radius} return cfg.radius})
    .style("stroke", function(d){
                    if(d.color != undefined){
                      return d.color
                    }
                    if(d.series != undefined){
                      if(series.indexOf(d.series) < 0){
                        series.push(d.series);
                      }
                      return cfg.seriesColor(series.indexOf(d.series));
                    }
                    return cfg.color}
    )
    .style("stroke-width", function(d){if(d.lineWidth != undefined){return d.lineWidth} return cfg.lineWidth})
    .style("fill", function(d){if(d.background != undefined){return d.background} return cfg.background})
    .attr("cy", function(d){
        if(cfg.horizontalLayout){
          return Math.floor(cfg.height/2)
        }
        var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
        return Math.floor(step*(datum - minValue) + margin) + DISP_Y
    })
    .attr("cx", function(d){
        if(cfg.horizontalLayout){
          var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
          var x=  Math.floor(step*(datum - minValue) + margin);
          return x + CONSTANT;
        }
        const val = cfg.displacement == 0 ? cfg.radius*2 : cfg.width*cfg.displacement
        return Math.floor(val) + CONSTANT
    }).on("mouseover", function(d){
      if(cfg.dateDimension){
        returnColor = $(this).css('fill');
        returnRadius = $(this).attr('r');
        var format = d3.timeFormat(cfg.dateFormat);
        var datetime = format(new Date(d.date));
        var dateValue = (datetime != "")?(d.event +" <small>("+datetime+")</small>"):d.event;
      }else{
        var format = function(d){return d}; // TODO
        var datetime = d.value;
        var dateValue = d.event +" <small>("+d.value+")</small>";
      }
      d3.select(this)
      .style("fill", function(d){if(d.color != undefined){return d.color} return cfg.color}).transition()
      .duration(100).attr("r",  function(d){if(d.radius != undefined){return Math.floor(d.radius*1.5)} return Math.floor(cfg.radius*1.5)});
      tip.html("");
      if(d.img != undefined){
        tip.append("img").style("float", "left").style("margin-right", "4px").attr("src", d.img).attr("width", "64px");
      }
      tip.append("div").style("float", "left").html(dateValue);
      tip.transition()
      .duration(100)
      .style("opacity", .9);
    })
    .on("mouseout", function(d){
        d3.select(this)
        .style("fill", function(d){return returnColor}).transition()
        .duration(100).attr("r", function(d){return returnRadius});
        tip.transition()
        .duration(100)
        .style("opacity", 0)})

    //Adding start and end labels
    if(cfg.showLabels != false){
      if(cfg.dateDimension){
        var format = d3.timeFormat(cfg.labelFormat);
        var startString = format(new Date(minValue));
        var endString = format(new Date(maxValue));
      }else{
        var format = function(d){return d}; //Should I do something else?
        var startString = minValue;
        var endString = maxValue;
      }
      svg.append("text")
         .text(startString).style("font-size", "24px")
         .attr("x", function(d){if(cfg.horizontalLayout){return d3.max([0, (margin-this.getBBox().width/2)])} return Math.floor(this.getBBox().width/2)})
         .attr("y", function(d){if(cfg.horizontalLayout){return Math.floor(cfg.height/2+(margin+this.getBBox().height))}return margin+this.getBBox().height/2 + DISP_Y});
      if (cfg.globalMax != cfg.expectedGrad.timestamp) {
        svg.append("text")
          .text(`Expected Graduation (${cfg.expectedGrad.timestamp}) Line`).style("font-size", "16px")
          .attr("x", CONSTANT/5)
          .attr("y", function(d){
            var ret;
            var datum = new Date(cfg.expectedGrad.timestamp).getTime();
            ret = Math.floor(step*(datum - minValue)) + margin
            linePrevious.y1 = ret
            return ret + DISP_Y - 10
          })
      }

      svg.append("text")
         .text(endString).style("font-size", "24px")
         .attr("x", function(d){if(cfg.horizontalLayout){return  cfg.width -  d3.max([this.getBBox().width, (margin+this.getBBox().width/2)])} return Math.floor(this.getBBox().width/2)})
         .attr("y", function(d){if(cfg.horizontalLayout){return Math.floor(cfg.height/2+(margin+this.getBBox().height))}return cfg.height-margin+this.getBBox().height/2 + DISP_Y})
    }

    count = 0;
    count2 = 0;
    lastY = 0;
    lastScalar = false;
    lastScalarY = false;

    svg.selectAll('foreignObject')
      .data(events).enter().append('foreignObject')
      .attr("x", function(d){
          var scalar = 1/2;
          if(count > 0) {
            const currentY = calculateY(d);
            const distance = currentY - lastY;
            if (distance <= 142) {
              scalar = lastScalar ? 1/2 : 2.5;
              lastScalar = !lastScalar;
            }
          }
          count++;
          lastY = calculateY(d);
          if(cfg.horizontalLayout){
            var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
            var x=  Math.floor(step*(datum - minValue) + margin);
            return x + (scalar * SEPARATION_AMOUNT) + CONSTANT;
          }
          const val = cfg.displacement == 0 ? cfg.radius*2 : cfg.width*cfg.displacement;
          return Math.floor(val) + (scalar * SEPARATION_AMOUNT) + CONSTANT;
      })
      .attr("y", function(d){
          var bias = 0
          if(count2 > 0) {
            const currentY = calculateY(d);
            const distance = currentY - lastY;
            if (distance <= 142) {
              bias = lastScalarY ? 0 : 75;
              lastScalarY = !lastScalarY;
            }
          }
          count2++;
          lastY = calculateY(d);
          const displacement = d.radius ? d.radius : cfg.radius;
          if(cfg.horizontalLayout){
            return Math.floor(cfg.height/2) - displacement + bias + DISP_Y;
          }
          var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
          return Math.floor(step*(datum - minValue) + margin) - displacement + bias + DISP_Y;
      })
      .attr("width", 300)
      .attr("height", 142)
      .append("xhtml:div")
        .attr("class", function(d) {
          return "card " + d.class;
        })
        .attr("id", function(d) {
          return d.timestamp + "-" + d.id;
        })
        .style("border", "1px solid #4a4a4a")
        .style("border-radius", "5px")
        .style("overflow", "hidden")
      .append("div")
        .attr("class", "card-header")
        .style("background-color", "#f8f8f8")
        .style("height", "40px")
        .style("display", "flex")

    function calculateY(d) {
      const displacement = d.radius ? d.radius : cfg.radius;
      if(cfg.horizontalLayout){
        return Math.floor(cfg.height/2) - displacement;
      }
      var datum = (cfg.dateDimension)?new Date(d.date).getTime():d.value;
      return Math.floor(step*(datum - minValue) + margin) - displacement;
    }

    svg.selectAll(".card")
      .data(events)
      .append("div")
        .attr("class", "card-body")
        .style("height", "100px")
        .style("background-color", "white")
        .style("width", "100%")
        .text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")

    svg.selectAll(".card-header")
      .data(events)
      .append("div")
        .attr("class", "indicator-container")
      .append("img")
        .attr("class", "indicator")
        .attr("src", function(d) {
          return d.image;
        })


    svg.selectAll(".card-header")
      .data(events)
      .append("div")
      .html(function(d) {
        if(cfg.dateDimension){
          var format = d3.timeFormat(cfg.dateFormat);
          var datetime = format(new Date(d.date));
          var dateValue = (datetime != "")?(d.event + "\xa0<small>("+datetime+")</small>"):d.event;
          return dateValue;
        }else{
          var format = function(d){return d}; // TODO
          var datetime = d.value;
          var dateValue = d.event + "\xa0<small>("+d.value+")</small>";
          return dateValue;
        }
      })
      .attr("class", "card-header-text");

    svg.selectAll(".card-header")
      .data(events)
      .append("div")
      .attr("class", "filler")

    svg.on("mousemove", function(){
        var tipPixels = parseInt(tip.style("height").replace("px", ""));
    return tip.style("top", (d3.event.pageY-tipPixels-margin)+"px").style("left",(d3.event.pageX+20)+"px");})
    .on("mouseout", function(){return tip.style("opacity", 0).style("top","0px").style("left","0px");});

    $('.card-body').each(function(i, e) {
      $(e).hide();
    });

    $('.card-header').off().on('click', function() {
      const elem = $(this).parent('.card').children('.card-body');
      const id = elem.parent('.card').attr('id');
      const classElem = elem.parent('.card').attr('class').split(" ")[1];
      var color = returnColorCode(classElem);
      const radius = options.radius ? options.radius : cfg.radius;
      $("." + id).each(function(i, e) {
        if ($(e).attr("r") == 20) {
          if (e.nodeName == "circle") {
            d3.select(this)
            .style("fill", "white").transition()
            .duration(100).attr("r", 1.5*radius);
          }
        }else{
          if (e.nodeName == "circle") {
            d3.select(this)
            .style("fill", "white").transition()
            .duration(100).attr("r", radius);
          }
        }
      });
      elem.slideToggle();
    });


    function returnColorCode(classElem) {
      switch (classElem) {
        case 'smooth':
          return '#ADD8E6';
          break;
        case 'success':
          return 'green';
          break;
        case 'warning':
          return 'orange';
          break;
        case 'danger':
          return 'red';
          break;
        default:
          return '#ADD8E6';
      }
    }

    function formatMonths(month) {
      switch (month) {
        case 0:
          return 'January';
        case 1:
          return 'February';
        case 2:
          return 'March';
        case 3:
          return 'April';
        case 4:
          return 'May';
        case 5:
          return 'June';
        case 6:
          return 'July';
        case 7:
          return 'August';
        case 8:
          return 'September';
        case 9:
          return 'October';
        case 10:
          return 'November';
        case 11:
          return 'December';
        default:
          return;
      }
    }
  }
}

export default TimeKnots;
