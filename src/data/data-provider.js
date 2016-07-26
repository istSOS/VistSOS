function getObservations(serverName, serviceName, offeringName, procedures, propsNames, from, until, callback) {

  // BEGIN initialization of istSOS-core objects used to call the API method getObservations
  var istsosContainer = new istsos.IstSOS();
  var default_db = new istsos.Database("istsos", "localhost", "postgres", "postgres", 5432);
  var server = new istsos.Server("istSOS-server", serverName, default_db);

  istsosContainer.addServer(server);
  
  var service = new istsos.Service(serviceName, server);
  var offering = new istsos.Offering(offeringName, "", true, null, service);

  // Instantiate the istSOS procedures using the parameter 'procedures'.
  var procedureArray = [];
  for (var i = 0; i < procedures.length; i++) {
    var procedureName = procedures[i];
    var procedure = new istsos.Procedure(service, procedureName, "", "", "", 4326, 0, 0, 0, [], "insitu-fixed-point", "");
    procedureArray.push(procedure);
  }
 
  var props = [];
  for (var i = 0; i < propsNames.length; i++) {
    var name = "";
    var urn = "";

    if (propsNames[i] == "rainfall") {
      var name = "air-rainfall"; 
      var urn = "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:rainfall";
    } else if (propsNames[i] == "temperature") {
      var name = "air-temperature"; 
      var urn = "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature"; 
    } else if (propsNames[i] == "humidity") {
      var name = "air-relative-humidity";
      var urn = "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:humidity:relative"; 
    } else {}

    var property = new istsos.ObservedProperty(service, name, urn, "", null, null);
    props.push(property);
  }

  var fromYear = moment(from).year();
  var fromMonth = moment(from).month() + 1; // Momentjs returns month number starting from 0
  var fromDay = moment(from).date();
  var fromHour = moment(from).hour();
  var fromMin = moment(from).minute();
  var fromSec = moment(from).second();
  var fromOffset = 0;
  if (from.indexOf("+") > -1) {
    fromOffset = parseInt(from.substr(from.indexOf("+") + 1, 2));
  }
  var begin = new istsos.Date(fromYear, fromMonth, fromDay, fromHour, fromMin, fromSec, fromOffset, "");

  var untilYear = moment(until).year();
  var untilMonth = moment(until).month() + 1;
  var untilDay = moment(until).date();
  var untilHour = moment(until).hour();
  var untilMin = moment(until).minute();
  var untilSec = moment(until).second();
  var untilOffset = 0;
  if (until.indexOf("+") > -1) {
    untilOffset = parseInt(until.substr(until.indexOf("+") + 1, 2));
  }
  var until = new istsos.Date(untilYear, untilMonth, untilDay, untilHour, untilMin, untilSec, untilOffset, "");
  // END initialization of istSOS-core objects used to call the API method getObservations.

  service.getObservations(offering, procedureArray, props, begin, until);

  istsos.on(istsos.events.EventType.GETOBSERVATIONS, function(ev) {
    var measurements = [];
    var uoms = new Object();

    // Get the array that contains the measurements for the list of specified procedures and properties.
    var data = ev.getData();

    // Iterate through the data array to get the measurements for each procedure.
    for (var d = 0; d < data.length; d++) {
      // Variable values will contain the measurements.
      var values = data[d].result.DataArray.values;
      // Variable fields will contain the unit of measurements.
      var fields = data[d].result.DataArray.field;
     
      var procedureName = data[d].name;

      for (var i = 0; i < values.length; i++) {
        // Discard sub-arrays with measuremente values equal to -999.00000 (outlier probably because of experimental error).
        // Should be removed once Javascript Core supports Quality Index parameters.
        if (!(values[i].indexOf("-999.000000") > -1)) {
          for (var j = 0; j < propsNames.length; j ++) {
            var propertyName = propsNames[j];
            var measurement = new Object();
            for (var k = 0; k < values[i].length; k++) {
              // Take property name from Fields array.
              var fieldName = fields[k].name;
              // Value obtained from array retrieved by the API method getObservations.
              var value = values[i][k]; 

              if (fieldName === "Time") { 
                measurement[fieldName] = value;   
              } else if (fieldName.indexOf(propertyName) > -1 && !(fieldName.indexOf(":") > -1)) {
                // Insert measurement value.
                measurement[propertyName] = parseFloat(value); 
                // Obtain Unit of Measurement.
                var uom = fields[k].uom;
                // Add Unit of Measurement. This attribute will be the included in the axes titles.
                if (!uoms.hasOwnProperty(propertyName)){ 
                  uoms[propertyName] = uom; 
                }
              } else if (fieldName.indexOf(propertyName) > -1) {
                measurement[fieldName] = value;   
              }
              measurement["symbol"] = procedureName + ", " + propertyName;
            }
            measurements.push(measurement);
          }
        }
      }
    }
  
    callback(measurements, uoms);
  });
}
