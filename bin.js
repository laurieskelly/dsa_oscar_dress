
var emphasis_colors = [
    '#7734B5', //     violet
    '#8E66F8', //     lavender
    '#B71BD0', //     orchid
    '#FF33CC', //     hot pink
    '#D81A63', //     bright red
    '#F45859', //     inferior salmon
    '#FF7D27', //     bright orange
    '#F9BB0B', //     warmer yellow
    '#FDE101', // bright yellow    
    '#A8D64E', //     keylime green
    '#86B702', //     moss green
    '#41A707', //     kelly green
    '#1F98A4', //     pool green
    '#00E1FA', // neon sky blue
    '#0099EC', //     atlantic blue
    '#146EFF', //     'lectric blue
    '#2E3AC4', //     very boring navy blue
    '#302399', //     deep blue violet
    '#6b6b72', //     dark bluey gray
    '#000000', //     black?
    '#ffffff', //     white?
    '#572981', //     dark eggplant
]

function get_area_data(des){
    data = []
    function des_count(year){
	return json
	    .filter(function(d){return d.year == year;})
	    .filter(function(d){return d.des == des;})
	    .length
    };
    d3.range(2004,2015).forEach(function(y){
	data.push({
	    'year':y,
	    'count':des_count(y)
	})
    });
    var max_count = Math.max.apply(null,data.map(
	function(d){return d.count}))
    area_y.domain([0,Math.max(5,max_count)])
    return data
}

// designer family highlighting
click_hold = []
function click_hold_pop(des){
    if(des === undefined){
	des = click_hold[click_hold.length-1]
    }
    var i = click_hold.indexOf(des)
    click_hold.splice(i,1)
    return des
}
var emphasis = function(){
    return emphasis_colors[click_hold.length]
}
function lights_on(des){
    if( $.inArray(des,click_hold)+1 ){ return }
    d3.select('.kbox.'+des)
	.transition()
	.style('stroke','darkgray')
    d3.selectAll('.dot.'+des)
	.transition()
	.style('fill',emphasis)
    d3.selectAll('.dot.win.'+des)
	.transition()
	.attr('r',15)
	.style('fill',emphasis)
	.style('stroke-width','6px')
    update_area(des)
}
function lights_on_me(dot){
    dot_id = $(dot).attr('id')
    des = get_des(dot)
    if( $.inArray(des,click_hold)+1 ){ return }
    d3.select('#'+dot_id)
	.transition()
	.style('fill',emphasis)
    d3.select('#'+dot_id+'.win')
	.transition()
	.attr('r',15)
	.style('fill',emphasis)
	.style('stroke-width','6px')
    update_area(des);
}

function lights_off(des){
    if( $.inArray(des,click_hold)+1 ){ return }
    d3.select('.kbox.'+des)
	.transition()
	.style('stroke','')
	.style('fill','')
    d3.selectAll('.dot.'+des)
	.transition()
	.style('fill','')
    d3.selectAll('.dot.win.'+des)
	.transition()
	.attr('r',r)
	.style('fill','')
	.style('stroke-width','')
}
function lights_off_me(dot){
    dot_id = $(dot).attr('id')
    des = get_des(dot)
    if( $.inArray(des,click_hold)+1 ){ return }	    
    d3.select('#'+dot_id)
	.transition()
	.style('fill','')
    d3.select('#'+dot_id+'.win')
	.transition()
	.attr('r',r)
	.style('stroke-width','')
	.style('fill','')
}

function get_des(thing){
    cls = $(thing).attr('class').split(' ');
    len = cls.length
    return cls[len-1]
}

function update_area(des){
    area_graph
	.datum(get_area_data(des))
	.transition()
	.duration(400)
	.attr('d',area)
    area_ax.transition().duration(400).call(area_yAxis)
}

// hover over a designer
$('rect.kbox').hover(
    //mouseover
    function(){
	lights_on(get_des(this));
	update_area(get_des(this));
    },
    //mouseout
    function(){
	lights_off(get_des(this));
    }
)
// click on a designer 
$('rect.kbox').click(
    function(){
	var des = get_des(this)
	if( !($.inArray(des,click_hold)+1) ){
	    lights_on(des)
	    d3.select('.kbox.'+des)
		.transition()
		.style('fill',emphasis)
	    click_hold.push(des);
	    return
	}
	//otherwise, pop it from the array and turn it off
	des = click_hold_pop(des)
	lights_off(des)
    })
// hover over a dot
$('.dot').hover(
    function(){
	lights_on_me(this);
	update_area(get_des(this));
    },
    function(){
	lights_off_me(this);
    }
)
// click on a dot
$('.dot').click(
    function(){
	dot_id = $(this).attr('id')
	des = d3.select('#'+dot_id).data()[0].des
	if( !($.inArray(des,click_hold)+1) ){
	    lights_on(des)
	    d3.select('.kbox.'+des)
		.transition()
		.style('fill',emphasis)
	    update_area(des)
	    click_hold.push(des);
	    return
	}
	des = click_hold_pop(des)
	lights_off(des)
    }
)
$('.keybttn').click(
    function(){
	while(click_hold.length > 0){
	    des = click_hold_pop()
	    lights_off(des)
	}
    }
)//keybttn click




