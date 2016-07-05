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

  var year = moment(from).year();
  var month = moment(from).month() + 1; // Momentjs returns month number starting from 0
  var day = moment(from).date();
  var hour = moment(from).hour();
  var min = moment(from).minute();
  var sec = moment(from).second();
  var offset = 0;
  var begin = new istsos.Date(year, month, day, hour, min, sec, offset, "");

  var year = moment(until).year();
  var month = moment(until).month() + 1;
  var day = moment(until).date();
  var hour = moment(until).hour();
  var min = moment(until).minute();
  var sec = moment(until).second();
  var offset = 0;
  var end = new istsos.Date(year, month, day, hour, min, sec, offset, "");


  service.getObservations(offering, procedure, props, begin, end);
  istsos.on(istsos.events.EventType.GETOBSERVATIONS, function(ev) {
    var measurements = [];
    var values = ev.getData()[0].result.DataArray.values;
    var fields = ev.getData()[0].result.DataArray.field;
    
    for (var i = 0; i < values.length; i++) {
      // Discard sub-arrays with measuremente values equal to -999.00000. Should be removed once Javascript Core supports QI parameters
      if (!(values[i].indexOf("-999.000000") > -1)) {
        for (var j = 0; j < propsNames.length; j ++) {
          var propertyName = propsNames[j];
          var measurement = new Object();
          for (var k = 0; k < values[i].length; k++) {
            var fieldName = fields[k].name; // Take property name from Fields array
            var value = values[i][k]; // Value obtained from array retrieved by getObservations

            if (fieldName === "Time") { 
              measurement[fieldName] = value;   
            } else if (fieldName.includes(propertyName) && !fieldName.includes(":")) {
              measurement[propertyName] = parseFloat(value); 
              measurement["uom"] = fields[k].uom; // Adds Unit of Measurement. This attribute will be the name of the Y axe
            } else if (fieldName.includes(propertyName)) {
              measurement[fieldName] = value;   
            }
            measurement["symbol"] = propertyName;
          }
          measurements.push(measurement);
        }
      }
    }

    callback(measurements);
  });
}
