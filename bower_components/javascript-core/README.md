# istSOS JavaScript Core Library

The istSOS JavaScript Core Library is mainly a REST API wrapper.
It will expose in JavaScript language the communication with the istSOS WA REST interface.

---

### Usage instructions:
First, import the latest compiled version of th istsos-core-.*.js library:
```HTML
<script src=".../src/compiled/istsos-core-.*.js"></script>
```
When the instances are created for the purpose of getting the data that already
exist on a server, than it is necessary, while instantiating, to correctly specify data required for
interacting with the server. Other info is not that important, for it will not impact the response<br/>
_**example**: When instantiating Service class object, it is important to specify serviceName and Server,
because that will be used for the GET request. Everything else is not that important. You can also take
a look at the "get observations example", you will see that some of the params are obviously incorrect,
but it is not important, because only some of them will be used for interacting with the server._<br/>
<br/>
However, when the instances are created for the purpose of posting the data (POST), or changing the
data (PUT/DELETE) on the server, then it is required, while instantiating, to specify every parameter
correctly. User will not and can't be warned about the correctness of the data, that he plans to post.
<br/>
<br/>
###Usage examples:
_Get Observations example_
```javascript
/*
getObservations() method requires Service, Offering, Procedure || VirtualProcedure,
array of ObservedProperties, begin time and end time to be provided;
*/
// create new server container
var istsosContainer = new istsos.IstSOS();

// create default database
var default_db = new istsos.Database("istsos","localhost","postgres", "postgres", 5432);

// create new server and add it to server container
var server = new istsos.Server("example", "http://istsos.org/istsos/", defaultDb);
istsosContainer.addServer(server);

// FOR SERVERS WITH AUTHENTICATION ENABLED, LOGIN CONFIGURATION OBJECT IS MANDATORY
var loginConfig = {
    user: admin,
    password: istsos
};
var server = new istsos.Server("example", "http://istsos.org/istsos/", defaultDb, null, loginConfig);
istsosContainer.addServer(server);

// create new service, that will be added to specified server automatically upon instatiation
var service = new istsos.Service("demo", server); //params opt_db, opt_config, opt_epsg are optional

// create new offering and procedure
var offering = new istsos.Offering("BELLINZONA", "", true, null, service);
var procedure = new istsos.Procedure(service, "BELLINZONA", "", "", "foi", 3857, 25,35,45, [], "insitu-fixed-point", "");)

// create new observed properties
var observedProperty_rainfall = new istsos.ObservedProperty(service, "air-rainfall", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:rainfall", "", null, null;
var observedProperty_temperature = new istsos.ObservedProperty(service, "air-temperature", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature", "", null, null);

// create begin sampling time and end sampling time, by instatiating Date class objects
var beginTime = new istsos.Date(2014,5,27,0,0,0,2,"Begin sampling time - BELLINZONA"); // OR JUST A STRING "2014-05-27T00:00:00+02:00"
var endTime = new istsos.Date(2014,5,28,0,0,0,2,"End sampling time - BELLINZONA");// OR JUST A STRING "2014-05-28T00:00:00+02:00"
```

PERFORMING STANDARD GET OBSERVATIONS REQUEST

```javascript
service.getObservations(offering, [property], [observedProperty_rainfall, observedProperty_temperature], beginTime, endTime);

istsos.on(istsos.events.EventType.GETOBSERVATIONS, function (ev) { //OR istsos.once(...)
    // ev.getData() returns JSON response object
    document.getElementById("response").innerHTML = JSON.stringify(ev.getData(), null, 3);
});
```

PERFORMING GET OBSERVATIONS REQUEST WITH DATA AGGREGATION

```javascript
var aggFunc = "AVG"; //allowed - "SUM", "MAX", "MIN" OR "AVG";
var aggInterval = "P1DT"; // P1DT - 1 day, PT24H - 24 hours...
service.getObservationsWithAggregation(offering, [property], [observedProperty_rainfall, observedProperty_temperature], beginTime, endTime, aggFunc, aggInterval);

istsos.on(istsos.events.EventType.GETOBSERVATIONS_AGG, function (ev) { //OR istsos.once(...)
    // ev.getData() returns JSON response object
    document.getElementById("response").innerHTML = JSON.stringify(ev.getData(), null, 3);
});
```

PERFORMING GET OBSERVATIONS REQUEST USING SINGLE PROCEDURE AND SINGLE OBSERVED PROPERTY - RESPONSE [{date: <date&time>, measurement: <observation>}]

```javascript
service.getObservationsBySingleProperty(offering, property, observedProperty_temperature, beginTime, endTime);

istsos.on(istsos.events.EventType.GETOBSERVATIONS_BY_PROPERTY, function (ev) { //OR istsos.once(...)
    // ev.getData() returns JSON response object
    document.getElementById("response").innerHTML = JSON.stringify(ev.getData(), null, 3);
});
```
PERFORMING  GET OBSERVATIONS REQUEST USING SINGLE PROCEDURE AND SINGLE OBSERVED PROPERTY WITH QUALITY INDEX CONSTRAINT

```javascript
var constraintType = "between"; // allowed - lessThan, lessThanAndEqual, equal, greaterThanAndEqual, greatherThan, between
var qualityNumber = [150, 300];
service.getObservationsByQualityIndexConstraint(offering, property, observedProperty_temperature, beginTime, endTime, constraintType, qualityNumber);

istsos.on(istsos.events.EventType.GETOBSERVATIONS_BY_QUALITY, function (ev) { //OR istsos.once(...)
    // ev.getData() returns JSON response object
    document.getElementById("response").innerHTML = JSON.stringify(ev.getData(), null, 3);
});

```
