goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/** istsos.Service class */
/**
 * @param {istsos.Server} server
 * @param {String} serviceName
 * @param {istsos.Database} opt_db
 * @param {istsos.Configuration} opt_config
 * @param {int} opt_epsg
 * @constructor
 */
istsos.Service = function (serviceName, server, opt_db, opt_config, opt_epsg) {
    this.serviceName = serviceName;
    this.db = opt_db || server.getDefaultDbProperty();
    this.epsg = opt_epsg || null;
    this.config = opt_config || new istsos.Configuration(serviceName, server); // configsections
    this.server = server;
    this.offerings = [];
    this.procedures = [];
    this.virtualProcedures = [];
    this.observedProperties = [];
    this.uoms = [];
    this.dataQualities = [];
    server.addService(this);
    var temporary_offering = new istsos.Offering("temporary",
        "temporary offering to hold self-registered procedures/sensors waiting for service adimistration acceptance",
        true, "", this);
};

istsos.Service.prototype = {
    /**
     * @param {String} url
     * @param {istsos.events.EventType} eventType
     * @param {String} method
     * @param {JSON} opt_data
     * @param {function} opt_otherData
     */
    executeRequest: function (url, eventType, method, opt_data, opt_otherData) {
        goog.net.XhrIo.send(url, function (e) {
            var obj = e.target.getResponseJson();
            console.log(obj);
            istsos.fire(eventType, e.target, opt_otherData);
        }, method, opt_data);
    },
    /**
     * @returns {JSON}
     */
    getServiceJSON: function () {
        var serviceJSON = {
            "service": this.serviceName
        };
        if (this.epsg) {
            serviceJSON["epsg"] = this.epsg.toString();
        }
        if (this.db !== this.server.getDefaultDbProperty()) {
            serviceJSON["dbname"] = this.db["dbname"];
            serviceJSON["host"] = this.db["host"];
            serviceJSON["user"] = this.db["user"];
            serviceJSON["password"] = this.db["password"];
            serviceJSON["port"] = this.db["port"].toString();
        }
        return serviceJSON;
    },
    /**
     * @returns {Array<istsos.Offering>}
     */
    getOfferingsProperty: function () {
        return this.offerings;
    },
    /**
     * @returns {Array<istsos.Procedure>}
     */
    getProceduresProperty: function () {
        return this.procedures;
    },
    /**
     * @returns {Array<istsos.VirtualProcedure>}
     */
    getVirtualProceduresProperty: function () {
        return this.virtualProcedures;
    },
    /**
     * @returns {Array<istsos.ObservedProperty>}
     */
    getObservedPropertiesProperty: function () {
        return this.observedProperties;
    },
    /**
     * @returns {Array<istsos.UnitOfMeasure>}
     */
    getUomsProperty: function () {
        return this.uoms;
    },
    /**
     * @returns {Array<istsos.DataQuality>}
     */
    getDataQualitiesProperty: function () {
        return this.dataQualities;
    },
    /**
     * @param {istsos.Offering} offering
     */
    addOffering: function (offering) {
        this.getOfferingsProperty().push(offering);
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: NEW_OFFERING
     * @param {istsos.Offering} offering
     */
    registerOffering: function (offering) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/offerings";
        this.executeRequest(url, istsos.events.EventType.NEW_OFFERING, "POST", JSON.stringify(offering.getOfferingJSON()));
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: OFFERING_NAMES
     */
    getOfferingNames: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/offerings/operations/getlist";
        this.executeRequest(url, istsos.events.EventType.OFFERING_NAMES, "GET");
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: OFFERING_LIST
     */
    getOfferings: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/offerings";
        this.executeRequest(url, istsos.events.EventType.OFFERING_LIST, "GET");
    },
    /**
     * @param {istsos.Procedure} procedure
     */
    addProcedure: function (procedure) {
        this.getProceduresProperty().push(procedure);
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: NEW_PROCEDURE
     * @param {istsos.Procedure} procedure
     */
    registerProcedure: function (procedure) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/procedures";
        this.executeRequest(url, istsos.events.EventType.NEW_PROCEDURE, "POST", JSON.stringify(procedure.getProcedureJSON()));
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: PROCEDURE
     * @param {istsos.Procedure} procedure
     */
    getProcedure: function(procedure) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/procedures/" + procedure.getProcedureJSON()["system"];
        this.executeRequest(url, istsos.events.EventType.PROCEDURE, "GET");
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: PROCEDURES
     */
    getProcedures: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/procedures/operations/getlist";
        this.executeRequest(url, istsos.events.EventType.PROCEDURES, "GET");
    },
    /**
     * @param {istsos.VirtualProcedure} v_procedure
     */
    addVirtualProcedure: function (v_procedure) {
        this.getVirtualProceduresProperty().push(v_procedure);
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: NEW_VIRTUAL_PROCEDURE
     * @param {istsos.VirtualProcedure} v_procedure
     */
    registerVirtualProcedure: function (v_procedure) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/procedures";
        this.executeRequest(url, istsos.events.EventType.NEW_VIRTUAL_PROCEDURE, "POST", JSON.stringify(v_procedure.getVirtualProcedureJSON()));
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: VIRTUAL_PROCEDURE
     * @param {istsos.VirtualProcedure} v_procedure
     */
    getVirtualProcedure: function(v_procedure) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/virtualprocedures/" + v_procedure.getVirtualProcedureJSON()["system"];
        this.executeRequest(url, istsos.events.EventType.VIRTUAL_PROCEDURE, "GET");
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: VIRTUAL_PROCEDURES
     */
    getVirtualProcedures: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/virtualprocedures/operations/getlist";
        this.executeRequest(url, istsos.events.EventType.VIRTUAL_PROCEDURES, "GET");
    },
    /**
     * @param {istsos.ObservedProperty} property
     */
    addObservedProperty: function (property) {
        this.getObservedPropertiesProperty().push(property)
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: NEW_OBSERVED_PROPERTY
     * @param {istsos.ObservedProperty} property
     */
    registerObservedProperty: function (property) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] +
            "/observedproperties";
        this.executeRequest(url, istsos.events.EventType.NEW_OBSERVED_PROPERTY, "POST", JSON.stringify(property.getObservedPropertyJSON()));
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: OBSERVED_PROPERTIES
     */
    getObservedProperties: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName +  "/observedproperties";
        this.executeRequest(url, istsos.events.EventType.OBSERVED_PROPERTIES, "GET");
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: OBSERVED_PROPERTY
     * @param {istsos.ObservedProperty} property
     */
    getObservedProperty: function (property) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/observedproperties/" +
            property.getObservedPropertyJSON()["definition"];
        this.executeRequest(url, istsos.events.EventType.OBSERVED_PROPERTY, "GET");
    },
    /**
     * @param {istsos.UnitOfMeasure} uom
     */
    addUom: function (uom) {
        this.getUomsProperty().push(uom);
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: NEW_UOM
     * @param {istsos.UnitOfMeasure} uom
     */
    registerUom: function (uom) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/uoms";
        this.executeRequest(url, istsos.events.EventType.NEW_UOM, "POST", JSON.stringify(uom.getUomJSON()));
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: UOMS
     */
    getUoms: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/uoms";
        this.executeRequest(url, istsos.events.EventType.UOMS, "GET");
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: UOM
     * @param {istsos.UnitOfMeasure} uom
     */
    getUom: function (uom) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/uoms/" +
            uom.getUomJSON()["name"];
        this.executeRequest(url, istsos.events.EventType.UOM, "GET");
    },
    /**
     * @param {istsos.DataQuality} dataQuality
     */
    addDataQuality: function (dataQuality) {
        this.getDataQualitiesProperty().push(dataQuality);
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: NEW_DATAQUALITY
     * @param {istsos.DataQuality} dataQuality
     */
    registerDataQuality: function (dataQuality) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] +
            "/dataqualities";
        this.executeRequest(url, istsos.events.EventType.NEW_DATAQUALITY, "POST", JSON.stringify(dataQuality.getDataQualityJSON()));
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: DATAQUALITIES
     */
    getDataQualities: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] +
            "/dataqualities";
        this.executeRequest(url, istsos.events.EventType.DATAQUALITIES, "GET");
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: DATA_QUALITY
     * @param {istsos.DataQuality} dataQuality
     */
    getDataQuality: function (dataQuality) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] +
            "/dataqualities/" + dataQuality.getDataQualityJSON()["code"];
        this.executeRequest(url, istsos.events.EventType.DATAQUALITY, "GET");
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: SYSTEM_TYPES
     */
    getSystemTypes: function () {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.getServiceJSON()["service"] + "/systemtypes";
        this.executeRequest(url, istsos.events.EventType.SYSTEM_TYPES, "GET");
    },
    /**
     * @returns {istsos.Database}
     */
    getDatabaseProperty: function () {
        return this.db;
    },
    /**
     * @fires istsos.Database#istsos.events.EventType: DATABASE
     */
    getDatabase: function () {
        this.db.getDb(this.getServiceJSON()["service"], this.server);
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: GETOBSERVATIONS
     * @param {istsos.Offering} offering
     * @param {Array<istsos.Procedure|istsos.VirtualProcedure>} procedures
     * @param {Array<istsos.ObservedProperty>} observed_properties
     * @param {istsos.Date} begin_time
     * @param {istsos.Date} end_time
     */
    getObservations: function (offering, procedures, observed_properties, begin_time, end_time) {
        var proc_names = [];
        for(var p = 0; p < procedures.length; p++) {
            if (procedures[p].systemType === "virtual") {
                proc_names.push(procedures[p].getVirtualProcedureJSON()["system"]);
            } else if (procedures[p].systemType === "insitu-fixed-point" || procedures[p].systemType === "insitu-mobile-point") {
                proc_names.push(procedures[p].getProcedureJSON()["system"]);
            } else {
                console.log(procedures[p] + ": WRONG TYPE!" );
            }
        }

        var urns = [];
        for (var i = 0; i < observed_properties.length; i++) {
            urns.push(observed_properties[i].getObservedPropertyJSON()["definition"]);
        }
        var begin = (begin_time instanceof istsos.Date) ? begin_time.getDateString() : begin_time;
        var end = (end_time instanceof istsos.Date) ? end_time.getDateString() : end_time;
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/operations/getobservation/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures/" + proc_names.toString() + "/observedproperties/" + urns.toString() +
            "/eventtime/" + begin + "/" + end;
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.GETOBSERVATIONS, "GET");
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: GETOBSERVATIONS_BY_PROPERTY
     * @param {istsos.Offering} offering
     * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
     * @param {istsos.ObservedProperty} observed_property
     * @param {istsos.Date} begin_time
     * @param {istsos.Date} end_time
     */
    getObservationsBySingleProperty: function (offering, procedure, observed_property, begin_time, end_time) {
        var proc_name;
        if (procedure.systemType === "virtual") {
            proc_name = procedure.getVirtualProcedureJSON()["system"];
        } else if (procedure.systemType === "insitu-fixed-point" || procedure.systemType === "insitu-mobile-point") {
            proc_name = procedure.getProcedureJSON()["system"]
        } else {
            console.log("WRONG TYPE");
        }
        var begin = (begin_time instanceof istsos.Date) ? begin_time.getDateString() : begin_time;
        var end = (end_time instanceof istsos.Date) ? end_time.getDateString() : end_time;
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/operations/getobservation/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures/" + proc_name + "/observedproperties/" +
            observed_property.getObservedPropertyJSON()["definition"] + "/eventtime/" + begin +
            "/" + end;
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.GETOBSERVATIONS_BY_PROPERTY, "GET");
    },
    //lessThan, lessThanAndEqual, equal, greaterThanAndEqual, greatherThan, between
    getObservationsByQualityIndexConstraint: function (offering, procedure, observed_property, begin_time, end_time, constraintType, qualityIndexNumber) {
        var proc_name;
        if (procedure.systemType === "virtual") {
            proc_name = procedure.getVirtualProcedureJSON()["system"];
        } else if (procedure.systemType === "insitu-fixed-point" || procedure.systemType === "insitu-mobile-point") {
            proc_name = procedure.getProcedureJSON()["system"]
        } else {
            console.log("WRONG TYPE");
        }
        var begin = (begin_time instanceof istsos.Date) ? begin_time.getDateString() : begin_time;
        var end = (end_time instanceof istsos.Date) ? end_time.getDateString() : end_time;
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName + "/operations/getobservation/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures/" + proc_name + "/observedproperties/" + observed_property.getObservedPropertyJSON()["definition"] +
            "/eventtime/" + begin + "/" + end;
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.GETOBSERVATIONS_BY_QUALITY, "GET", null, {"QI_CONSTRAINT": "TRUE", "type": constraintType, "quality": qualityIndexNumber});
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: GEOJSON
     * @param {int} opt_epsg
     * @param {istsos.Offering} opt_offering
     * @param {istsos.Procedure|istsos.VirtualProcedure} opt_procedure
     */
    getFeatureCollection: function (opt_epsg, opt_offering, opt_procedure) {
        var url = this.server.getUrl() + "wa/istsos/services/" + this.serviceName +
            "/procedures/operations/geojson";
        if(opt_epsg) {
            url += "?epsg=" + opt_epsg.toString();
            if(opt_offering || opt_procedure) {
                if(opt_offering) {
                    url += "&offering=" + opt_offering.getOfferingJSON()["name"];
                }
                if(opt_procedure && opt_procedure instanceof istsos.Procedure) {
                    url += "&procedure=" + opt_procedure.getProcedureJSON()["system"];
                } else if (opt_procedure && opt_procedure instanceof istsos.VirtualProcedure) {
                    url += "&procedure=" + opt_procedure.getVirtualProcedureJSON()["system"];
                }
            }
        }
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.GEOJSON, "GET");
    }
};