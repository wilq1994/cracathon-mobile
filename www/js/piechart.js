var $ = jQuery;

function piechart(container, json){
    var data = {
        good: {
            current: 0,
            max: (json.good / 100) * 360,
            hours: (json.good / 100) * 8,
            element: $("#goodArc", container)
        },
        bad: {
            current: 0,
            max: (json.bad / 100) * 360,
            hours: (json.bad / 100) * 8,
            element: $("#badArc", container)
        }
    }

    var radius = 50;
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle){
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);
        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
        return d;
    }

    function goodCircle(x, y, radius, angle) {
        var pos = polarToCartesian(x, y, radius, angle/2);

        $('#goodCircle', container).attr("cx",pos.x);
        $('#goodCircle', container).attr("cy",pos.y);
        $('#goodPath', container).attr("d","M260 160 L"+pos.x+" "+pos.y);
    }

    function badCircle(x, y, radius, angle) {
        var pos = polarToCartesian(x, y, radius, angle/2);

        $('#badCircle', container).attr("cx",pos.x);
        $('#badCircle', container).attr("cy",pos.y);
        $('#badPath', container).attr("d","M40 80 L"+pos.x+" "+pos.y);
    }

    function render(type){
        if(data[type].current < data[type].max){
            data[type].current += 10;
            setTimeout(function(){
                render(type);
            }, 10);
        } else {
            data[type].current = data[type].max;
            if(type==='good') render('bad');
            if(type==='bad'){
                $(container).removeClass('is-hidden');
            }
        }

        if(type==='bad'){
            data[type].element.attr("d", describeArc(150, 120, radius, data.good.max, data.good.max+data[type].current));
        }else{
            data[type].element.attr("d", describeArc(150, 120, radius, 0, data[type].current));
        }
    }
    $('.chart__desc--good strong', container).text(json.good+'%');
    $('.chart__desc--good span', container).text(data.good.hours+'h spent');
    $('.chart__desc--bad strong', container).text(json.bad+'%');
    $('.chart__desc--bad span', container).text(data.bad.hours+'h spent');

    render('good');

    goodCircle(150,120,radius,data.good.max);
    badCircle(150,120,radius,data.good.max+data.good.max+data.bad.max);
}

$(document).ready(function(){
    $.getJSON("http://localhost:8080/positiondata?user=1", function(result){
        piechart('#chart1', result['daily']);
        piechart('#chart2', result['weekly']);
        piechart('#chart3', result['monthly']);
    })
});

// $(document).ready(function(){
//     piechart('#chart1', {
//         good: 50,
//         bad: 50
//     });
//
//     piechart('#chart2', {
//         good: 80,
//         bad: 20
//     });
//
//     piechart('#chart3', {
//         good: 40,
//         bad: 60
//     });
// })
