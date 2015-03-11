var randomRunRequested = false;

// Radius of the earth in m : 20000000/Pi 
// -> the originally proposed definition of the meter
var EarthRadius = 6366198;
var EvenMagicRatio = 1.3416407864998738178455042012388; // 3/sqrt(5)
var OddMagicRatio = 1.4142135623730950488016887242097; // sqrt(2)
var RadToDegRatio = 57.295779513082320876798154814105; // 180/PI
var DegToRadRatio = 0.01745329251994329576923690768489; // PI/180
var LatitudeTolerance = 0.00001;
var LongitudeTolerance = 0.00001;
var isRunLoaded = false;
var currentRunLength;
var timerInSeconds;
var timerIntervalId;

var runRoute;
var runStartedAt;
var runEndedAt;
var runRating = 0;
var runDurationInMs;
var runCompleted; //TODO
var runAttempted = false;

var directionsDisplay;
var directionsService;

var detailsHtmlDisabled = "More Details &#x25BC;";
var detailsHtmlEnabled = "More Details &#x25B2;";
var detailsShown = false;

$(document).ready(init);

function init() {
    $('#imgRandomRunner').hover(function(){
        $(this).addClass("hoverLogo").removeClass("staticLogo");
    }, function(){
        if(!randomRunRequested)
            $(this).addClass("staticLogo").removeClass("hoverLogo");
    });
    $('#imgRandomRunner').click(function(){randomRunRequested = true;});
    
    $('#divEditableCountdown').hide();
    
    $('#divInfo').hide();
    $('#btnMoreDetails').html(detailsHtmlDisabled).click(function(){
        $('#pDetails').slideToggle();
        $(this).html(detailsShown 
        ? detailsHtmlDisabled 
        : detailsHtmlEnabled);
        detailsShown = !detailsShown;
    });
    $('#pDetails').hide();
    $('#divButtons').hide();
    $('#btnSkip').button();
    $('#btnStartEnd').button();
    $('#btnStartEnd').click(startTimer);
    $('#btnVoteUp').click(function() { setRating(1); });
    $('#btnVoteDown').click(function() { setRating(-1); });
    $('#divVotingButtons').buttonset();
    $('#run_instance_rating').val(runRating);
    $('#run_instance_attempted').val(runAttempted);
    if(window.location.pathname === '/randomruns/new') {
        //alert('getLocation');
        getLocation();
    } else if(window.location.pathname.indexOf('/randomruns/') === 0 
            && $('#randomrun_id').val()) {
        //alert('getRoute');
        directionsService = new google.maps.DirectionsService();
        getRoute();
    } else {
        //alert('Nothing');
    }
}

function getRoute() {
    var routeString = $('#random_run_route').val();
    var routeStringSplit = routeString.split('|');
    var startpoint;
    var endpoint;
    var waypoints = [];
    for(var i = 0; i < routeStringSplit.length; i++) {
        var latlng = routeStringSplit[i].split(',');
        if(i == 0) {
            startpoint = new google.maps.LatLng(parseFloat(latlng[0]),
            parseFloat(latlng[1]));
        } else if(i == routeStringSplit.length - 1) {
            endpoint = new google.maps.LatLng(parseFloat(latlng[0]),
            parseFloat(latlng[1]));
        } else {
            waypoints.push({location: new google.maps.LatLng(parseFloat(latlng[0]),
            parseFloat(latlng[1])), stopover: false});
        }
    }
    var angle = parseFloat($('#random_run_angle').val());
    var length = parseFloat($('#random_run_desired_length').val());
    showRoute(startpoint, endpoint, waypoints, angle, length);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(computeRun);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function computeRun(position) {
    var startLatLng = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);
    var randomLength = Math.floor(Math.pow(Math.random(), 4)*20000 + 100);
    //alert('Getting random run');
    getRandomRun(startLatLng, startLatLng, randomLength);
}

function showRoute(startPosition, endPosition, waypoints, angleRad, length) {
    var mapOptions = {
        center: startPosition,
        zoom: 17
    };
    var canvas = $('#map-canvas')[0];
    var map = new google.maps.Map(canvas, mapOptions);
    
    var markerOptions = {
        position: startPosition,
        visible: true,
        map: map
    };
    var marker = new google.maps.Marker(markerOptions);
    
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
//    var textBox = $('#txtDesiredLength');
//    if (textBox.value != "" && !isNaN(textBox.value))
//    {       
//        // It's a number
//        var numValue = parseFloat(textBox.value);
//        getRandomRun(startLatLng, startLatLng, numValue);
//    }
    var request = {
        origin: startPosition,
        destination: endPosition,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING
    };

    //alert('routing');
    directionsService.route(request, function(response, status) {
        //alert(status.toString());
        if (status == google.maps.DirectionsStatus.OK) {
            displayDirections(response, angleRad, length, waypoints);
        }
    });
}

function distance(lon1, lat1, lon2, lat2) {
    if(Math.abs(lon2 - lon1) < LongitudeTolerance) {
        if(Math.abs(lat2 - lat1) < LatitudeTolerance) {
            // Latitudes and longitudes are equal
            return 0;
        }
        // Longitudes are equal
        return distanceLat(lat1, lat2);
    } else if(Math.abs(lat2 - lat1) < LatitudeTolerance) {
        // Latitudes are equal
        return distanceLon(lon1, lon2, lat1);
    }
    var y = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var x = dLon * Math.cos(toRad(lat1+lat2)/2);
    return Math.sqrt(x*x + y*y) * EarthRadius; // Pythagoras
}

function distanceLat(lat1, lat2) {
    var y = toRad(lat2-lat1);
    return y * EarthRadius; // Pythagoras
}

function distanceLon(lon1, lon2, lat) {
    var dLon = toRad(lon2-lon1);
    var x = dLon * Math.cos(toRad(lat));
    return x * EarthRadius; // Pythagoras
}

function getNextPosition(latitude, longitude, angle, distance) {
    angle = Math.PI/2 - angle; // angle of 0 is up. PI/2 is right
    var y = toRad(latitude);
    var x = toRad(longitude) * Math.cos(y);
    var deltaY = Math.sin(angle) * distance/EarthRadius;
    var deltaX = Math.cos(angle) * distance/EarthRadius;
    var position = new google.maps.LatLng(toDeg(y + deltaY),
        toDeg((x + deltaX)/Math.cos(y)));
    return position;
}

function getPathLength(start, end) {
    return EvenMagicRatio * distance(start.lng(),start.lat(), 
        end.lng(),end.lat());
}

function getAngle(start, end) {
    var y = end.lat()-start.lat();
    var dLon = end.lng()-start.lng();
    var x = dLon * Math.cos(toRad(end.lat()+start.lat())/2);
    return Math.atan2(x, y); // PI/2 - atan(y/x) because 0 is up
}

function getRandomRun(start, end, length){
    var pathLength = getPathLength(start, end);
    if(pathLength == 0) {
        var waypoints = [];
        var randAngle = Math.random()*Math.PI*2;
        var randAngleDeg = Math.floor(toDeg(randAngle));
        var corners = 2 + Math.floor(Math.sqrt(length/800));
        var ratio = corners % 2 == 0 ? EvenMagicRatio : OddMagicRatio;
        var legLength = length/(corners*ratio);
        // (corners-2)*Math.PI is the total angle of the polygon
        var legAngle = 2*Math.PI/corners;
        var nextPosition = new google.maps.LatLng(start.lat(),
            start.lng());
        for(var i = 0; i < corners-1; i++) {
            nextPosition = getNextPosition(nextPosition.lat(), 
            nextPosition.lng(), randAngle+i*legAngle, legLength);
            waypoints.push({location:nextPosition, 
                stopover: false});
        }
        
        var routeString = generateRouteString(start, end, waypoints);
//        var startPointStrng = generateLatLngString(start);
//        var endPointString = generateLatLngString(end);
        runRoute = routeString;
        $('#random_run_route').val(routeString);
        $('#random_run_angle').val(randAngle.toString());
        $('#random_run_desired_length').val(length.toString());
        $('#random_run_create').submit();
    } else if(pathLength < length) {
        var dDistance = length - pathLength;
        var angle = getAngle(start, end);
        //TODO
    } else {
        alert("Distance between start and end point (" + 
                pathLength.toString() + 
                ") is greater than requested run-distance (" + 
                length.toString() + ").");
    }
    //alert('called routing');
}

function displayDirections(response, angleRad, length, waypoints) {
    directionsDisplay.setDirections(response);
    var routeLength = 0;
    var route = response.routes[0];
    for(var i = 0; i < route.legs.length; i++) {
        routeLength += route.legs[i].distance.value;
    }
    
    currentRunLength = routeLength;
    if(!$('#random_run_actual_length').val()) {
        $('#random_run_actual_length').val(routeLength.toString());
        $.post(window.location.pathname, $("#random_run_update").serialize());
    }
    
    $('#pDetails').html("For this run, we started with an angle of " 
            + Math.floor(toDeg(angleRad)).toString() + "° clockwise from the north," 
            + " making an equiangular and equilateral polygon with " 
            + (waypoints.length + 1).toString()+ " sides.<br/>" 
            + "The desired length of this run was " + Math.floor(length.toString())
            + "m. The actual length is " + routeLength.toString() + "m." 
            + " The length-deviation in percent is : " 
            + (Math.floor(10000*Math.abs(length-routeLength)/length)/100).toString() 
            + "%.");
    finalizeLoadRun();
}

function toRad(value) {
    return value * DegToRadRatio;
}

function toDeg(value) {
    return value * RadToDegRatio;
}

function finalizeLoadRun() {
    $('#divButtons').show();
    $('#divInfo').show();
    $('#divEditableCountdown').show();
    var timeNeededInSeconds = currentRunLength/3; //3 m/s
    setTimerFromSeconds(timeNeededInSeconds);
}

function startTimer() {
    if($('#btnStartEnd').val() == '0') {
        $('#btnStartEnd').button("option", "label", "Terminate!");
        $('#btnStartEnd').val('1');
        $('#txtHours').attr("readonly","readonly");
        $('#txtMinutes').attr("readonly","readonly");
        $('#txtSeconds').attr("readonly","readonly");
        var hours = parseInt($('#txtHours').val());
        var minutes = parseInt($('#txtMinutes').val());
        var seconds = parseInt($('#txtSeconds').val());
        timerInSeconds = hours*3600 + minutes*60 + seconds;
        timerIntervalId = setInterval(updateTimer, 1000);
        runStartedAt = new Date();
        $('#run_instance_started_at').val(runStartedAt);
        runAttempted = true;
        $('#run_instance_attempted').val(runAttempted);
    } else {
        //TODO timer ended !
        clearInterval(timerIntervalId);
        runEndedAt = new Date();
        $('#run_instance_ended_at').val(runEndedAt);
        runDurationInMs = runEndedAt - runStartedAt;
        $('#run_instance_duration_in_ms').val(runDurationInMs);
        $('#run_instance_create').submit();
    }
}

function updateTimer() {
    if(timerInSeconds <= 0) {
        $('#divEditableCountdown').css('background-color', 'red');
        return;
    }
    timerInSeconds--;
    setTimerFromSeconds(Math.abs(timerInSeconds));
}

function setTimerFromSeconds(timeInSeconds) {
    var seconds = Math.floor(timeInSeconds % 60);
    var minutes = ~~(timeInSeconds / 60) % 60;
    var hours = ~~(timeInSeconds / 3600);
    $('#txtHours').val(hours.toString());
    $('#txtMinutes').val(minutes.toString());
    $('#txtSeconds').val(seconds.toString());
}

function generateLatLngString(latlng){
    return latlng.lat().toPrecision(15) + "," + latlng.lng().toPrecision(15);
}

function generateRouteString(start, end, waypoints){
    var resultString = generateLatLngString(start);
    for(i = 0; i < waypoints.length; i++)
        resultString += "|" + generateLatLngString(waypoints[i].location);
    return resultString + "|" + generateLatLngString(end);
}

function setRating(value) {
    runRating = parseInt(value);
    $('#run_instance_rating').val(runRating);
}