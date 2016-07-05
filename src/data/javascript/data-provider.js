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
      var measurement = new Object();
      for (var j = 0; j < values[i].length; j++) {
        var propertyName = fields[j].name;
        for (var k = 0; k < propsNames.length; k ++) {
          if (propertyName.includes(propsNames[k]) && !propertyName.includes(":")) {
            propertyName = propsNames[k];
          }
        }
        // Don't include measurements equal to -999, this should change after Javascript Core API accepts QI paramemetees
        var value = values[i][j];
        if (!value.includes("-999")) {
          measurement[propertyName] = values[i][j];   
        }
      } 
      measurements.push(measurement);
    }
    callback(measurements);
  });
}
