var $ = jQuery;

$(function(){
    var json = {
        good: 60,
        bad: 40
    }

    var data = {
        good: {
            current: 0,
            max: (json.good / 100) * 360,
            hours: (json.good / 100) * 8,
            element: $("#goodArc")
        },
        bad: {
            current: 0,
            max: (json.bad / 100) * 360,
            hours: (json.bad / 100) * 8,
            element: $("#badArc")
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

        $('#goodCircle').attr("cx",pos.x);
        $('#goodCircle').attr("cy",pos.y);
        $('#goodPath').attr("d","M260 160 L"+pos.x+" "+pos.y);
    }

    function badCircle(x, y, radius, angle) {
        var pos = polarToCartesian(x, y, radius, angle/2);

        $('#badCircle').attr("cx",pos.x);
        $('#badCircle').attr("cy",pos.y);
        $('#badPath').attr("d","M40 80 L"+pos.x+" "+pos.y);
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
                $('.chart').removeClass('is-hidden');
            }
        }

        if(type==='bad'){
            data[type].element.attr("d", describeArc(150, 120, radius, data.good.max, data.good.max+data[type].current));
        }else{
            data[type].element.attr("d", describeArc(150, 120, radius, 0, data[type].current));
        }
    }
    $('.chart__desc--good strong').text(json.good+'%');
    $('.chart__desc--good span').text(data.good.hours+'h spent');
    $('.chart__desc--bad strong').text(json.bad+'%');
    $('.chart__desc--bad span').text(data.bad.hours+'h spent');

    render('good');

    goodCircle(150,120,radius,data.good.max);
    badCircle(150,120,radius,data.good.max+data.good.max+data.bad.max);
});
