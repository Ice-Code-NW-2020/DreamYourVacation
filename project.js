$(document).ready(function () {
    var searchHistory = [];
    var APIKey = "b212266a3b5800f1c727bf9539b273bb";
    $('#search-button').on('click', function (event) {
        event.preventDefault();
        $(".lead").empty();
        $(".display-4").empty();
        $(".card-deck").empty();
        $(".card-deck2").empty();
        var location = $('#input').val().toUpperCase();
        console.log(location);
        //if the user inputs a number we are looking to give an error message and modal
        //if(checkInput(location) = true){
            searchHistory.push(location);
            getWeatherData(location);
            getTripAdvisorData(location);
            localStorage.setItem('cities', JSON.stringify(searchHistory));
            var textInputElement = document.querySelector("#input");
            textInputElement.value = "";
        //}
    })
    var getWeatherData = function (location) {
        var currentDay = moment().format('dddd, MMMM Do');
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var temperature = Math.floor(((response.main.temp) - 273.15) * 1.80 + 32)
            var humidity = response.main.humidity
            var windspeed = response.wind.speed
            var cityName = response.name;
            var icon = response.weather[0].icon
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            $('.display-4').html(cityName)
            $('.display-4').append(" " + currentDay);
            $('.display-4').append(` <img src='http://openweathermap.org/img/wn/${icon}.png' class="img-fluid" alt="Responsive image">`);
            $('.lead').append("Temperature: " + temperature + "°F");
            $('.lead').append('<br>Humidity: ' + humidity + "%");
            $('.lead').append('<br>Windspeed: ' + windspeed + "MPH");
            getFiveDayForecast(lat, lon);
        })
    }
    var getFiveDayForecast = function (lat, lon) {
        var queryURL2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response) {
            console.log(response.daily[0].uvi);
            for (var i = 1; i < 8; i++) {
                var nextDay = moment().add(i, 'days').format('L');
                var cardIcon = response.daily[i].weather[0].icon
                var cardTemp = Math.floor(((response.daily[i].temp.day) - 273.15) * 1.80 + 32);
                var cardHumidity = response.daily[i].humidity;
                $('.card-deck').append(`<div class='card'>
             <div class='card-body'>
                 <h6 class='card-title'>${nextDay}</h6>
                 <p class='card-text'id ="card${i}"> 
                 <img src='http://openweathermap.org/img/wn/${cardIcon}.png' class="img-fluid" alt="Responsive image"> <br>${cardTemp}°F <br> ${cardHumidity}% </p>
             </div>`);
            }
            var uvi = response.daily[0].uvi
            if (uvi > 8) {
                $('.lead').append(`<br> <div class="text-danger"> UV index : ${uvi}</div>`)
            }
            else if (uvi < 8 && uvi > 5) {
                $('.lead').append(`<br> <div class="text-warning"> UV index :   ${uvi}</div>`)
            }
            else {
                $('.lead').append(`<br> <div class="text-success"> UV index :   ${uvi}</div>`)
            }
        });
    };
    var search = function () {
        var searched = JSON.parse(localStorage.getItem("cities"));
        console.log(searched)
        if (searched !== null) {
            searchHistory = searched;
            for (var i = 0; i < searched.length; i++) {
                $('.list-group').append(`<li class='list-group-item btn' id='button' value='${searched[i]}'>${searched[i]}</li>`);
            }
        }
        if (searchHistory !== null) {
            var lastLocation = searchHistory[searchHistory.length - 1]
            getWeatherData(lastLocation);
            getTripAdvisorData(lastLocation);
        }
    }
    //--------------------------------------------------------
    var getTripAdvisorData = function (location) {
        //endpoint: locations/search
        var settings = {
            "async": true,
            "crossDomain": true,
            "cors": true,
            "url": `https://tripadvisor1.p.rapidapi.com/locations/search?location_
            id=1&limit=30&sort=relevance&offset=0&lang=en_US&currency=USD&units=km&query=${location}`,
            "method": "GET",
            "headers": {
                'Access-Control-Allow-Origin': '*',
                "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
                "x-rapidapi-key": "363c7fbecfmshcbe4cfd3ee41b5fp142feajsn760531d33ab1"
            }
        }
        $.ajax(settings).done(function (response) {
            //      console.log(response);
            var i = 0;
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].result_type === "geos" && response.data[i].result_object.name.toUpperCase() === location) {
                    console.log(response);
                    console.log(response.data[i].result_object.name.toUpperCase());
                    console.log(response.data[i].result_object.location_id);
                    // alert(response.data[i].result_object.location_id);
                    var cityId = response.data[i].result_object.location_id;
                    console.log("cityId: ",cityId);
                    getTripAdvisorData2(cityId);
                }
                else {
                   // alert("Trip Advisor Info Not Found 404");
                    break;
                }
            }
            //$('.trip-advisor-api').append(`<br><img src="${imageURL}" class="img-fluid" alt="Responsive image"></img width="${imageWidth}">`);
       
        
        });
    }
    //------------------------------------------------------------------------
    // Trip Advisor
    // Endpoint: attractions/ list 
    var getTripAdvisorData2 = function (cityId) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "cors": true,
            "url": `https://tripadvisor1.p.rapidapi.com/attractions/list?lang=en_US&currency=USD&sort=recommended&lunit=km&location_id=${cityId}`,
//            "url": `https://tripadvisor1.p.rapidapi.com/attractions/list?lang=en_US&currency=USD&sort=recommended&lunit=km&location_id=42139`,
            "method": "GET",
            "headers": {
                'Access-Control-Allow-Origin': '*',
                "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
                "x-rapidapi-key": "0cd2c0f9famsh2558fe85925d9e8p19aa40jsn4b596027b6b5"
            }
        }
        $.ajax(settings).done(function (response) {
            console.log(response);
            var lengthResponse = response.data.length;
            console.log(lengthResponse);
            //random number array without duplication
            var randomArray = randoSequence(lengthResponse-1);
            console.log(randomArray);

            if (lengthResponse < 10){
                var iEnd = lengthResponse;
            }
            else {
                var iEnd = 10;
            }
            for (var i = 0; i < iEnd; i++) {
                var randomAttractions = randomArray[i];  
                if (response.data[randomAttractions].name !== undefined) {
                    console.log(response.data[randomAttractions]);
                    var imageURL = response.data[randomAttractions].photo.images.medium.url;
                    var imageWidth = response.data[randomAttractions].photo.images.medium.width;
                
                    $('.card-deck2').append(`<div class='card'>
                        <div class='card-body'>
                        <h2 class='card-title' style="text-decoration: underline; color: red" >${response.data[randomAttractions].name}<h5> Rating: ${response.data[randomAttractions].rating}</h5></h2>
                        <p class='card-text'id ="card">
                        <img src="${imageURL}" class="img-fluid" alt="Responsive image">
                        <hr>
                        ${response.data[randomAttractions].description}
                        <br>
                        <hr>
                        <a href="${response.data[randomAttractions].website}">${response.data[randomAttractions].website}</a></p>
                        <hr>
                    </div>`);
                }
                else{
                    iEnd++; 
                }
            }
        });
    }

    search();

    //--------------------------------------------------------
    $(document).on('click', '#button', function () {
        $(".card-deck").empty();
        $(".lead").empty();
        $(".display-4").empty();
        $(".card-deck2").empty();
        newLocation = $(this).attr("value").toUpperCase();
        console.log(newLocation)
        getWeatherData(newLocation);
        getTripAdvisorData(newLocation)
    });
});
//if the user inputs a number we are looking to give an error message and modal
//error throwing to terminate array being pushed into and present the modal
//error catching frm API
//-----------------------------------------------------------------

    // $('.trip-advisor-api').append('<br> Attraction Name: ' + response.data[randomAttractions].name);
    // $('.trip-advisor-api').append('<br>Description: ' + response.data[randomAttractions].description);
    // $('.trip-advisor-api').append('<br>Rating: ' + response.data[randomAttractions].rating);
    // $('.trip-advisor-api').append('<br>URL: ' + response.data[randomAttractions].website);
    // $('.trip-advisor-api').append('<br> ------------------ ');

//-----------------------------------------------------------------------------

        // create a copy of the array
    //        var newArray = [];
    //        var imageArray = [];
    //   debugger;
    //         for(var i=0; i<response.data.length; i++){
    //             newArray.push(response.data[i])
    //         }
    //         // then, each time pull from that array and remove the one you use
    //         for (var i =0; i < 10; i++)
    //         {
    //             if(newArray.length>0) {
    //                 var index = Math.floor(Math.random() * newArray.length)
    //                 var randomImage = newArray[index];
    //                 newArray.splice(index, 1);
    //             }
    //         }
    //         console.log(newArray);

 //------------------------------------------------------------------------------ 
 // "x-rapidapi-key": "83c24764bamsh4ab0e0175aae739p1180b7jsn62d3645b374e"  
 //--------------------------------------------------------------------------------
 // var checkInput = function(location){
//     var checkForNumbers = ["0","1","2","3","4","5","6","7","8","9"];
//     for (var i = 0; i < checkForNumbers.length; i++){
//         var check = location.includes(checkForNumbers[i]);
//         if(check === true){
//             alert("Error");
//             return false;
//         }
//         else {
//             return true
//         };
//     }
// }
//------------------------------------------------------
//------------------------------------------------------------------------------------
//var iStart = 0; 
// for (var i = 0; i < 10; i++) {
        //    for (x of response.data) {
        //         if (iStart < 10) {
        //             var randomAttractions = Math.floor(Math.random() * response.data.length);
        //             //random number without duplication
        //             if (response.data[randomAttractions].name !== undefined) {
        //                 console.log(response.data[randomAttractions]);
        //                 var imageURL = response.data[randomAttractions].photo.images.medium.url;
        //                 var imageWidth = response.data[randomAttractions].photo.images.medium.width;
                    
        //                 $('.card-deck2').append(`<div class='card'>
        //                     <div class='card-body'>
        //                     <h2 class='card-title' style="text-decoration: underline; color: red" >${response.data[randomAttractions].name}<h5> Rating: ${response.data[randomAttractions].rating}</h5></h2>
        //                     <p class='card-text'id ="card">
        //                     <img src="${imageURL}" class="img-fluid" alt="Responsive image">
        //                     <hr>
        //                     ${response.data[randomAttractions].description}
        //                     <br>
        //                     <hr>
        //                     <a href="${response.data[randomAttractions].website}">${response.data[randomAttractions].website}</a></p>
        //                     <hr>
        //                 </div>`);
        //             }
        //         }
        //         iStart++;
        //     }
//--------------------------------------------------
