var path = "localhost/istsos/test?" +
           "service=SOS&version=1.0.0&" +
           "request=GetObservation&" + 
           "offering=offering1&" +
           //"procedure=MI_Lambrate_Temperatura&" +
           "procedure=MI_Lambrate_Precipitazione&" +
           "eventTime=2015-06-15T00:00:00+0200/2015-06-30T23:00:00+0200&" +
           "observedProperty=rainfall&" +
           "qualityIndex=True&" +
           "qualityFilter=>110&" +
           "responseFormat=application/json";

var request = require("request"), 
    login = "",
    password = "",
    url = "http://" + login + ":" + password + "@" + path;

request({ url: url },
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonResponse = JSON.parse(body);
      var data = jsonResponse["ObservationCollection"].member[0].result.DataArray;
      var values = data["values"].slice();
      var measurements = [];
      
      for (var i = 0; i < values.length; i++) {
        var measurement = {
          "x": i,
          //"temperature": values[i][1]
          "y": values[i][1]
        }
        measurements.push(measurement);
      }

      //require("fs").writeFile("data/temp6months.json", 
      require("fs").writeFile("data/rainfallJune15days.json", 
        JSON.stringify(measurements),
        "utf8",
        function(err) {
          if (err) {
            console.error("Something bad happened");
          }
        }
      );
    } else if (error){
      console.log(error);
    } else {
      console.log("Unknown error");
    }
  }
);
