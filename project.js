$(document).ready(function () {
    var location = '';
    $('#go-weather').on('click', function (event) {
        event.preventDefault();
        location = $("#len1").val();
        getWeatherData(location);
        getTripAdvisorData(location);
    })
    var getWeatherData = function (location) {
        var APIKey = "b212266a3b5800f1c727bf9539b273bb";
        location = $('#len1').val();
        location = 'Chicago';
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var cityName = response.name;
            $('.weather-api').append('<br>' + cityName);

        })
        //------------------------------------------------------------------

//var getTripAdvisorData = function(location){
    var settings = {

        //endpoint: locations/search
                    "async": true,
                    "crossDomain": true,
                    "url": `https://tripadvisor1.p.rapidapi.com/locations/search?location_
                    id=1&limit=30&sort=relevance&offset=0&lang=en_US&currency=USD&units=km&query=${location}`,
        
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
                        "x-rapidapi-key": "83c24764bamsh4ab0e0175aae739p1180b7jsn62d3645b374e"
                    }
                }
                $.ajax(settings).done(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].result_type === "geos" && response.data[i].result_object.name === cityName) {
                            console.log(response.data[i].result_object.name);
                            console.log(response.data[i].result_object.name);
                            var city2 = response.data[i].result_object.name;
                        }
                    }
        
        
        
                      //$('.trip-advisor-api').append(`<br><img src="${imageURL}" class="img-fluid" alt="Responsive image"></img width="${imageWidth}">`);
                });
//}
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //trip advisor



})





