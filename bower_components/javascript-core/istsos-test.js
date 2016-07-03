istsos.on(istsos.events.EventType.ABOUT, function (ev) {
    log(ev.getData(), 'ABOUT')
});

istsos.on(istsos.events.EventType.SERVICE, function (ev) {
    log(ev.getData(), 'SERVICE')
});

istsos.on(istsos.events.EventType.STATUS, function (ev) {
    log(ev.getData(), 'STATUS')
});

istsos.on(istsos.events.EventType.CONFIGSECTIONS, function (ev) {
    log(ev.getData(), 'CONFIGURATION SECTIONS');
});

istsos.on(istsos.events.EventType.SERVICES, function (ev) {
    log(ev.getData(), 'LIST OF SERVICES')
});

istsos.on(istsos.events.EventType.PROVIDER, function (ev) {
    log(ev.getData(), 'SERVICE PROVIDER')
});


istsos.on(istsos.events.EventType.PROXY, function (ev) {
    log(ev.getData(), 'PROXY')
});

istsos.on(istsos.events.EventType.IDENTIFICATION, function (ev) {
    log(ev.getData(), 'SERVICE IDENTIFICATION');
});

istsos.on(istsos.events.EventType.OBSERVATION_CONF, function (ev) {
    log(ev.getData(), 'OBSERVATION CONFIGURATION')
});

istsos.on(istsos.events.EventType.MQTT, function (ev) {
    log(ev.getData(), 'MQTT')
});

istsos.on(istsos.events.EventType.CRS, function (ev) {
    log(ev.getData(), 'COORDINATE SYSTEMS');
});

istsos.on(istsos.events.EventType.SYSTEM_TYPES, function (ev) {
    log(ev.getData(), 'SYSTEM TYPES')
});

istsos.on(istsos.events.EventType.EPSG_CODES, function (ev) {
    log(ev.getData(), 'EPSG CODES')
});

istsos.on(istsos.events.EventType.OFFERING_NAMES, function (ev) {
    log(ev.getData(), 'OFFERING NAMES')
});

istsos.on(istsos.events.EventType.OFFERING_LIST, function (ev) {
    log(ev.getData(), 'OFFERING LIST')
});

istsos.on(istsos.events.EventType.PROCEDURE, function (ev) {
    log(ev.getData(), 'PROCEDURE')
});

istsos.on(istsos.events.EventType.PROCEDURES, function (ev) {
    log(ev.getData(), 'PROCEDURES')
});

istsos.on(istsos.events.EventType.OFFERING_LIST, function (ev) {
    log(ev.getData(), 'OFFERINGS')
});

istsos.on(istsos.events.EventType.OFFERING_NAMES, function (ev) {
    log(ev.getData(), 'OFFERING NAMES')
});

istsos.on(istsos.events.EventType.VIRTUAL_PROCEDURE, function (ev) {
    log(ev.getData(), 'VIRTUAL PROCEDURE')
});

istsos.on(istsos.events.EventType.VIRTUAL_PROCEDURES, function (ev) {
    log(ev.getData(), 'VIRTUAL PROCEDURES')
});

istsos.on(istsos.events.EventType.OBSERVED_PROPERTIES, function (ev) {
    log(ev.getData(), 'OBSERVED PROPERTIES')
});

istsos.on(istsos.events.EventType.OBSERVED_PROPERTY, function (ev) {
    log(ev.getData(), 'OBSERVED PROPERTY')
});

istsos.on(istsos.events.EventType.DATAQUALITIES, function (ev) {
    log(ev.getData(), 'DATA QUALITIES')
});

istsos.on(istsos.events.EventType.DATAQUALITY, function (ev) {
    log(ev.getData(), 'DATA QUALITY')
});

istsos.once(istsos.events.EventType.UOMS, function (ev) {
    log(ev.getData(), 'UNITS OF MEASURE')
});

istsos.once(istsos.events.EventType.UOM, function (ev) {
    log(ev.getData(), 'UNIT OF MEASURE')
});

istsos.on(istsos.events.EventType.DATABASE, function (ev) {
    log(ev.getData(), 'DATABASE');
});

istsos.on(istsos.events.EventType.MEMBERLIST, function (ev) {
    log(ev.getData(), 'MEMBER PROCEDURES');
});

istsos.on(istsos.events.EventType.NONMEMBERLIST, function (ev) {
    log(ev.getData(), 'NON-MEMBER PROCEDURES')
});

istsos.on(istsos.events.EventType.GET_CODE, function (ev) {
    log(ev.getData(), 'CODE');
});

istsos.on(istsos.events.EventType.RATING_CURVE, function (ev) {
    log(ev.getData(), 'RATING CURVE');
});

istsos.on(istsos.events.EventType.GEOJSON, function (ev) {
    log(ev.getData(), 'GET FEATURE COLLECTION');
});

istsos.on(istsos.events.EventType.GETOBSERVATIONS, function (ev) {
    log(ev.getData(), 'GET OBSERVATIONS');
});

istsos.on(istsos.events.EventType.GETOBSERVATIONS_BY_PROPERTY, function (ev) {
    log(ev.getData(), 'GET OBSERVATIONS DATA BY SINGLE PROPERTY')
});

istsos.on(istsos.events.EventType.NEW_SERVICE, function (ev) {
    console.log(ev.getData());
    server.getStatus();
});

istsos.on(istsos.events.EventType.DELETE_SERVICE, function (ev) {
    console.log("DELETE SERVICE");
    server.getStatus();
});

istsos.on(istsos.events.EventType.UPDATE_PROVIDER, function (ev) {
    console.log(ev.getData());
    service_local.config.getProvider();
});

istsos.on(istsos.events.EventType.UPDATE_IDENTIFICATION, function (ev) {
    console.log(ev.getData());
    service_local.config.getIdentification();
});

istsos.on(istsos.events.EventType.UPDATE_CRS, function (ev) {
    console.log(ev.getData());
    service_local.config.getCrs();
});

istsos.on(istsos.events.EventType.UPDATE_OBSERVATION_CONF, function (ev) {
    console.log(ev.getData());
    service_local.config.getObservationConf();
});

istsos.on(istsos.events.EventType.UPDATE_MQTT, function (ev) {
    console.log(ev.getData());
    service_local.config.getMqtt();
});

istsos.on(istsos.events.EventType.UPDATE_PROXY, function (ev) {
    console.log(ev.getData());
    service_local.config.getProxy();
});

istsos.on(istsos.events.EventType.UPDATE_DATABASE, function (ev) {
    console.log(ev.getData());
    service_local.db.getDb(service_local.serviceName, server_local);
});

istsos.on(istsos.events.EventType.VALIDATE_DB, function (ev) {
    log(ev.getData(), 'TEST CONNECTION');
});

istsos.on(istsos.events.EventType.NEW_OFFERING, function (ev) {
    console.log(ev.getData());
    service.getOfferingNames();
});

istsos.on(istsos.events.EventType.UPDATE_OFFERING, function (ev) {
    service.getOfferingNames();
});

istsos.on(istsos.events.EventType.DELETE_OFFERING, function (ev) {
    console.log("DELETE OFFERING");
    service.getOfferingNames();
});

istsos.on(istsos.events.EventType.NEW_DATAQUALITY, function (ev) {
    service.getDataQuality(newDataQuality);
});

istsos.on(istsos.events.EventType.UPDATE_DATAQUALITY, function (ev) {
    service.getDataQuality(newDataQuality);
});

istsos.on(istsos.events.EventType.DELETE_DATAQUALITY, function (ev) {
    console.log("DELETE DATA QUALITY");
    service.getDataQualities();
});

istsos.on(istsos.events.EventType.NEW_UOM, function (ev) {
    service.getUoms();
});

istsos.on(istsos.events.EventType.UPDATE_UOM, function (ev) {
    service.getUoms();
});

istsos.on(istsos.events.EventType.DELETE_UOM, function (ev) {
    console.log("DELETE UNIT OF MEASURE");
    service.getUoms();
});

istsos.on(istsos.events.EventType.NEW_OBSERVED_PROPERTY, function (ev) {
    service.getObservedProperty(obs_property_null_constraints);
});

istsos.on(istsos.events.EventType.UPDATE_OBSERVED_PROPERTY, function (ev) {
    service.getObservedProperty(obs_property_null_constraints);
});

istsos.on(istsos.events.EventType.DELETE_OBSERVED_PROPERTY, function (ev) {
    console.log("DELETE OBSERVED PROPERTY");
    service.getObservedProperties();
});

istsos.on(istsos.events.EventType.NEW_PROCEDURE, function (ev) {
    service.getProcedure(newProcedure);
});

istsos.on(istsos.events.EventType.UPDATE_PROCEDURE, function (ev) {
    service.getProcedure(newProcedure);
});

istsos.on(istsos.events.EventType.DELETE_PROCEDURE, function (ev) {
    console.log("DELETE PROCEDURE");
    service.getProcedures();
});

istsos.on(istsos.events.EventType.ADD_TO_OFFERING, function (ev) {
    offering_proc.getMemberProcedures();
});

istsos.on(istsos.events.EventType.REMOVE_FROM_OFFERING, function (ev) {
    offering_proc.getNonMemberProcedures();
});

istsos.on(istsos.events.EventType.NEW_VIRTUAL_PROCEDURE, function (ev) {
    service_local.getVirtualProcedure(newVirtualProcedure_local)
});

istsos.on(istsos.events.EventType.UPDATE_V_PROCEDURE, function (ev) {
    service_local.getVirtualProcedure(newVirtualProcedure_local);
});

istsos.on(istsos.events.EventType.DELETE_V_PROCEDURE, function (ev) {
    console.log("DELETE VIRTUAL PROCEDURE");
    service_local.getVirtualProcedures();
});

istsos.on(istsos.events.EventType.NEW_CODE, function (ev) {
    newVirtualProcedure_local.getCode()
});

istsos.on(istsos.events.EventType.UPDATE_CODE, function (ev) {
    newVirtualProcedure_local.getCode()
});

istsos.on(istsos.events.EventType.DELETE_CODE, function (ev) {
    console.log("DELETE VIRTUAL PROCEDURE CODE");
});


istsos.on(istsos.events.EventType.NEW_RATING_CURVE, function (ev) {
    newVirtualProcedure_local.getRatingCurve();
});

istsos.on(istsos.events.EventType.DELETE_RATING_CURVE, function (ev) {
    console.log("DELETE VIRTUAL PROCEDURE RATING CURVE");
});



/** ==================================================================================================== */

var ist = new istsos.IstSOS();
var default_db = new istsos.Database('istsos', 'localhost', 'postgres', 'postgres', 5432);
var server = new istsos.Server('test', 'http://istsos.org/istsos/', default_db);
var server_local = new istsos.Server("test", "http://localhost/istsos/", default_db);
ist.addServer(server);
ist.addServer(server_local);
var default_conf = new istsos.Configuration("default", server_local);
var service = new istsos.Service("demo", server);
var service_local = new istsos.Service("test", server_local);
var procedure = new istsos.Procedure(service, "BELLINZONA", "", "", "foi", 3857, 25, 35, 45, [], "insitu-fixed-point", "");
var v_procedure = new istsos.VirtualProcedure(service, "V_GNOSCA", "", "", "foi", 3857, 26, 36, 46, [], "virtual", "");
var observed_prop = new istsos.ObservedProperty(service, "air-temperature", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature", "", "between", [0, 1]);

var dataQuality = new istsos.DataQuality(service, 100, "raw", "format is correct");
var uom = new istsos.UnitOfMeasure(service, "mm", "milimeter");
var offering = new istsos.Offering("BELLINZONA", "", true, null, service);
var v_offering = new istsos.Offering("V_GNOSCA", "", true, null, service);
var beginTime = new istsos.Date(2014, 05, 27, 00, 00, 00, 2, "");
var endTime = new istsos.Date(2014, 06, 5, 00, 00, 00, 2, "");
/** GET REQUEST TESTS */
//server methods
function getServiceReq() {
    server.getService(service);
}

function getStatusReq() {
    server.getStatus();
}

function getAbout() {
    server.getAboutInfo();
}

function getConf() {
    server.getConfig();
}

function getDb() {
    server.getDefaultDb();
}

function getList() {
    server.getServices();
}

//configuration methods
function getConfigurationReq() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getConf();
    } else {
        var service_conf = new istsos.Configuration(resp, server);
        service_conf.getConf();
    }
}

function getProviderReq() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getProvider();
    } else {
        var service_conf = new istsos.Configuration(resp, server_local);
        service_conf.getProvider();
    }
}


function getIdentReq() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getIdentification();
    } else {
        var service_conf = new istsos.Configuration(resp, server_local);
        service_conf.getIdentification();
    }
}

function getCoordSysReq() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getCrs();
    } else {
        var service_conf = new istsos.Configuration(resp, server_local);
        service_conf.getCrs();
    }
}

function mqtt() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getMqtt();
    } else {
        var service_conf = new istsos.Configuration(resp, server_local);
        service_conf.getMqtt();
    }
}

function getOC() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getObservationConf();
    } else {
        var service_conf = new istsos.Configuration(resp, server_local);
        service_conf.getObservationConf();
    }
}

function getProxyReq() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getProxy();
    } else {
        var service_conf = new istsos.Configuration(resp, server_local);
        service_conf.getProxy();
    }
}

function getEPSGS() {
    var resp = prompt("Service name or default?", "default")
    if (resp === "default") {
        default_conf.getEpsgCodes();
    } else {
        var service_conf = new istsos.Configuration(resp, server_local);
        service_conf.getEpsgCodes();
    }
}

//Service methods
function getOffNames() {
    service.getOfferingNames();
}

function getOffs() {
    service.getOfferings();
}

function getProcs() {
    service.getProcedures();
}

function getProc() {
    service.getProcedure(procedure);
}

function getVProcs() {
    service.getVirtualProcedures();
}

function getVProc() {
    service.getVirtualProcedure(v_procedure);
}

function getOPS() {
    service.getObservedProperties();
}

function getOP() {
    service.getObservedProperty(observed_prop);
}

function getDQs() {
    service.getDataQualities();
}

function getDQ() {
    service.getDataQuality(dataQuality);
}

function getUOMs() {
    service.getUoms();
}

function getUOM() {
    service.getUom(uom);
}

function getSysTypes() {
    service.getSystemTypes();
}

function getServiceDatabase() {
    service.getDatabase();
}

function getMembers() {
    offering.getMemberProcedures();
}

function getNonMembers() {
    offering.getNonMemberProcedures();
}

function getRCurve() {
    v_procedure.getRatingCurve();
}

function getCodeReq() {
    v_procedure.getCode();
}

function getGEOJSON() {
    //TRY WITH
    //service.getFeatureCollection(3857)
    //service.getFeatureCollection(3857, offering)
    //service.getFeatureCollection(3857, null, procedure)
    //service.getFeatureCollection(3857, null, v_procedure)
    //service.getFeatureCollection(3857, offering, procedure)
    //service.getFeatureCollection(3857, offering, v_procedure)
    service.getFeatureCollection(3857, offering);
}
var air_rainfall = new istsos.ObservedProperty(service, "air-rainfall", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:rainfall", "", null, null);
var air_temperature = new istsos.ObservedProperty(service, "air-temperature", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:temperature", "", null, null);
var air_relative_humidity = new istsos.ObservedProperty(service, "air-relative-humidity", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:relative:humidity", "", null, null);
var air_wind_velocity = new istsos.ObservedProperty(service, "air-wind-velocity", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:wind:velocity", "", null, null);

function getOBSERVATIONS() {
    //TRY WITH
    //service.getObservations(v_offering, v_procedure, [], beginTime, endTime);
    /*air-rainfall (mm)
     air-temperature (°C)
     air-relative-humidity (%)
     air-wind-velocity (m/s)*/
    service.getObservations(offering, procedure, [air_rainfall, air_temperature, air_wind_velocity, air_relative_humidity], beginTime, endTime);
}

function getOBSERVATIONDATA() {
    service.getObservationsBySingleProperty(offering, procedure, air_rainfall, beginTime, endTime);
}

//POST

function registerSERVICE() {
    server_local.registerService(service_local);
}

function deleteSERVICE() {
    server_local.deleteService(service_local);
}


//PUT
function putProviderReq() {
    var resp = prompt("Default or not?", "default")
    if (resp === "default") {
        server_local.config.updateProvider("LukaG", "www.lukaglusica.com", "Luka Glusica", "", "12121212", "12121212",
            "llll@Llll.com", "Street name 3/19", "11080", "Belgrade", "Zemun", "Serbia");
    } else {
        service_local.config.updateProvider("LukaG", "www.lukaglusica.com", "Luka Glusica", "", "12121212", "12121212",
            "llll@Llll.com", "Street name 3/19", "11080", "Belgrade", "Zemun", "Serbia");
    }
}

function putIdentificationReq() {
    var resp = prompt("Default or not?", "default");
    if (resp === "default") {
        server_local.config.updateIdentification("Observation Service", "", "2.0", "x-istsos-belgrade", "NONE", "new", "NONE");
    } else {
        service_local.config.updateIdentification("Observation Service", "", "2.0", "x-istsos-belgrade", "NONE", "new", "NONE");
    }
}

function putCRS() {
    var resp = prompt("Default or not?", "default");
    if (resp === "default") {
        server_local.config.updateCrs("height", "east", "north", "3857,21781", "4326");
    } else {
        service_local.config.updateCrs("height", "east", "north", "3857,21781", "4326");
    }
}
function putMqtt() {
    var resp = prompt("Default or not?", "default");
    if (resp === "default") {
        server_local.config.updateMqtt("somePasword","someUser", "someTopic", "someUrl", "somePort");
    } else {
        service_local.config.updateMqtt("somePasword","someUser", "someTopic", "someUrl", "somePort");
    }
}

function putOC() {
    var resp = prompt("Default or not?", "default");
    if (resp === "default") {
        server_local.config.updateObservationConf("100", "150", "200", "300", "0", "True", "-999");
    } else {
        service_local.config.updateObservationConf("100", "150", "200", "300", "0", "True", "-999");
    }
}

function putProxy() {
    var resp = prompt("Default or not?", "default");
    if (resp === "default") {
        server_local.config.updateProxy("www.newUrl.com");
    } else {
        service_local.config.updateProxy("www.newUrl.com");
    }
}

//DATABASE
function getDatabase() {
    var resp = prompt("Default or not?", "default");
    if(resp === "default") {
        var defaultdb = new istsos.Database("istsos", "localhost", "postgres", "postgres", 5432);
        defaultdb.getDb("default", server_local);
    } else {
        db.getDb("test_post", server_local);
    }
}
var db = new istsos.Database("istsos","localhost", "postgres", "postgres", 5432);
function putDatabase() {
    db.setDb("istsos_test","localhost", "postgres", "postgres", 5432, server_local, service_local);
}

function validateDB() {
    var db = new istsos.Database("istsos","localhost", "postgres", "postgres", 5432);
    db.validateDb(server_local);
}

//SERVICE - OFFERING
var offering_proc = new istsos.Offering("test_membership", "testing procedure membership to an offering", true, "", service);
var offering_proc_local = new istsos.Offering("test_membership", "testing procedure membership to an offering", true, "", service_local);
function regOffering() {
    service_local.registerOffering(offering_proc_local);
}

function putOffering() {
    offering_proc_local.updateOffering("offering_put","TESTED PUT request for offering", true, "");
}

function delOffering() {
    offering_proc_local.deleteOffering();
}

//SERVICE - DATA QUALITY
var newDataQuality = new istsos.DataQuality(service, 1000, "dataQuality test", "testing POST request for data quality");
function registerDQ() {
    service.registerDataQuality(newDataQuality);
}

function updateDQ() {
    newDataQuality.updateDataQuality(1500, "dataQuality update", "testing PUT request for data quality");
}

function deleteDQ() {
    newDataQuality.deleteDataQuality();
}

//SERVICE - UNIT OF MEASURE
var newUom = new istsos.UnitOfMeasure(service, "km", "kilometer");
function registerUOM() {
    service.registerUom(newUom);
}

function putUOM() {
    newUom.updateUom("km2", "square kilometer");
}

function deleteUOM() {
    newUom.deleteUom();
}

//SERVICE - OBSERVED PROPERTY
var obs_property = new istsos.ObservedProperty(service, "air-test", 
    "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:test","Testing POST request - Observed Property", "between", [0, 100]);
var obs_property_null_constraints = new istsos.ObservedProperty(service, "air-test2", 
    "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:test2", "Testing POST request with null constraints");
function registerOP() {
    service.registerObservedProperty(obs_property_null_constraints);
}

function putOP() {
    obs_property_null_constraints.updateObservedProperty("air-test-put", "urn:ogc:def:parameter:x-istsos:1.0:meteo:air:test:put",
        "Testing PUT request - Observed Property", "valueList", [1,2,3]);
}

function deleteOP() {
    obs_property_null_constraints.deleteObservedProperty();
}

//SERVICE - PROCEDURE

var uom_proc = new istsos.UnitOfMeasure(service, "km", "kilometer");
var uom_proc_local = new istsos.UnitOfMeasure(service_local, "km", "kilometer")
var op_proc = new istsos.ObservedProperty(service, "test-procedure", "urn:ogc:def:parameter:x-istsos:1.0:meteo:test:procedure",
    "descirpiton", "between", [100, 200]);
var op_proc_local = new istsos.ObservedProperty(service_local, "test-procedure", "urn:ogc:def:parameter:x-istsos:1.0:meteo:test:procedure",
    "descirpiton", "between", [100, 200]);
var output_proc = new istsos.Output(op_proc, uom_proc, "output descr", "between", [100, 200]);
var output_proc_local = new istsos.Output(op_proc_local, uom_proc_local, "output descr", "between", [100, 200]);
var newProcedure = new istsos.Procedure(service, "test_procedure", "testing POST request for Procedures", "test,procedure",
    "feature", 3857, 25, 25, 25, [output_proc], "insitu-fixed-point", "test_sensor description");
var newVirtualProcedure = new istsos.VirtualProcedure(service, "test_procedure", "testing POST request for Procedures", "test,procedure",
    "feature", 3857, 25, 25, 25, [output_proc], "virtual", "test_sensor description", "print('This is a test')", {});
var rcurve_local = [
    {
        "A": "5.781",
        "C": "1.358",
        "B": "0.250",
        "from": "1982-01-01T00:00+01:00",
        "up_val": "2.5",
        "K": "0",
        "low_val": "0",
        "to": "1983-01-01T00:00+01:00"
    },
    {
        "A": "7.236",
        "C": "1.988",
        "B": "0.200",
        "from": "1983-01-01T00:00+01:00",
        "up_val": "2.5",
        "K": "0",
        "low_val": "0",
        "to": "1984-01-01T00:00+01:00"
    }]
var newVirtualProcedure_local = new istsos.VirtualProcedure(service_local, "test_procedure", "testing POST request for Procedures", "test,procedure",
    "feature", 3857, 25, 25, 25, [output_proc_local], "virtual", "test_sensor description", "print('This is a test')", rcurve_local);

function registerPROCEDURE() {
    service.registerProcedure(newProcedure);
}

function putPROCEDURE() {
    newProcedure.updateProcedure("test_procedure_put", "testing PUT request for Procedures", "test,put", "feature_put", 3857, 
        15, 15, 15, [], "insitu-mobile-point", "test_sensor put description");
}

function deletePROCEDURE() {
    newProcedure.deleteProcedure();
}

function addMembership() {
    newProcedure.addMembershipToOffering(offering_proc);
}

function removeMembership() {
    newProcedure.removeMembershipFromOffering(offering_proc)
}

//SERVICE - VIRTUAL PROCEDURE
function registerVPROCEDURE() {
    service_local.registerVirtualProcedure(newVirtualProcedure_local);
}

function updateVPROCEDURE() {
    newVirtualProcedure_local.updateVirtualProcedure("test_vprocedure_put", "testing PUT request for VirtualProcedures", "test,put, virtual", "feature_put", 3857,
        15, 15, 15, [], "virtual", "test_virtual_proc put description")
}

function deleteVPROCEDURE() {
    newVirtualProcedure_local.deleteVirtualProcedure();
}

function registerCODE() {
    newVirtualProcedure_local.registerCode();
}

function putCODE() {
    newVirtualProcedure_local.updateCode("print('UPDATED CODE')");
}

function deleteCODE() {
    newVirtualProcedure_local.deleteCode();
}

function registerRCURVE() {
    newVirtualProcedure_local.registerRatingCurve();
}


function deleteRCURVE() {
    newVirtualProcedure_local.deleteRatingCurve();
}

function addMembershipVP() {
    newVirtualProcedure_local.addMembershipToOffering(offering_proc_local);
}

function removeMembershipVP() {
    newVirtualProcedure_local.removeMembershipFromOffering(offering_proc_local);
}