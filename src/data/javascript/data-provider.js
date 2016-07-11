function getObservations(serverName, serviceName, offeringName, procedureName, propsNames, from, until, callback) {
  var istsosContainer = new istsos.IstSOS();
  var default_db = new istsos.Database("istsos", "localhost", "postgres", "postgres", 5432);
  var server = new istsos.Server("istSOS-server", serverName, default_db);

  istsosContainer.addServer(server);
  
  var service = new istsos.Service(serviceName, server);
  var offering = new istsos.Offering(offeringName, "", true, null, service);
  var procedure = new istsos.Procedure(service, procedureName, "", "", "", 4326, 0, 0, 0, [], "insitu-fixed-point", "");
 
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
  if (from.includes("+")) {
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
  if (until.includes("+")) {
    untilOffset = parseInt(until.substr(until.indexOf("+") + 1, 2));
  }
  var end = new istsos.Date(untilYear, untilMonth, untilDay, untilHour, untilMin, untilSec, untilOffset, "");

  service.getObservations(offering, procedure, props, begin, end);
  istsos.on(istsos.events.EventType.GETOBSERVATIONS, function(ev) {
    var measurements = [];
    var uoms = new Object();
    var values = ev.getData()[0].result.DataArray.values;
    var fields = ev.getData()[0].result.DataArray.field;
    
    for (var i = 0; i < values.length; i++) {
      // Discard sub-arrays with measuremente values equal to -999.00000. Should be removed once Javascript Core supports QI parameters
      if (!(values[i].indexOf("-999.000000") > -1)) {
        for (var j = 0; j < propsNames.length; j ++) {
          var propertyName = propsNames[j];
          var measurement = new Object();
          for (var k = 0; k < values[i].length; k++) {
            // Take property name from Fields array
            var fieldName = fields[k].name;
            // Value obtained from array retrieved by getObservations
            var value = values[i][k]; 

            if (fieldName === "Time") { 
              measurement[fieldName] = value;   
            } else if (fieldName.includes(propertyName) && !fieldName.includes(":")) {
              // Inserts measurement value 
              measurement[propertyName] = parseFloat(value); 
              // Obtains Unit of Measurement
              var uom = fields[k].uom;
              // Add Unit of Measurement. This attribute will be the included in the axes titles
              //measurement["uom"] = uom;
              if (!uoms.hasOwnProperty(propertyName)){ 
                uoms[propertyName] = uom; 
              }
            } else if (fieldName.includes(propertyName)) {
              measurement[fieldName] = value;   
            }
            measurement["symbol"] = propertyName;
          }
          measurements.push(measurement);
        }
      }
    }

    callback(measurements, uoms);
  });
}
