function getData(offering, procedure, property, from, until, callback) {
  var dataURL = "http://131.175.143.71/istsos/test?" +
                "service=SOS&version=1.0.0&" +
                "request=GetObservation&" + 
                "offering=" +offering + "&" +
                "procedure=" + procedure + "&" + 
                "eventTime=" + from + "/" + until + "&" +
                "observedProperty=" + property + "&" + 
                //"aggregateInterval=PT24H&" + 
                //"aggregateFunction=SUM&" +
                "qualityIndex=True&" +
                "qualityFilter=>110&" +
                "responseFormat=application/json";
 
  var measurements = [];

  $.getJSON(dataURL, function(data) {
    // var data contains values, fields and elementCount
    var data = jQuery.extend({}, data["ObservationCollection"].member[0].result.DataArray);
    var values = data["values"].slice();
    var measurements = [];
      
    for (var i = 0; i < values.length; i++) {
      var measurement = {
        "date": values[i][0],
        "measurement": values[i][1]
      }
      measurements.push(measurement);
    }
    
    callback(measurements);
  });
}
