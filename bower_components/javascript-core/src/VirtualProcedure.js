goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/**
 * @param {istsos.Service} service
 * @param {String} name
 * @param {String} description
 * @param {String} keywords
 * @param {String} foi_name
 * @param {int} epsg
 * @param {int} x
 * @param {int} y
 * @param {int} z
 * @param {Array<istsos.Output>} outputs
 * @param {String} systemType (virtual)
 * @param {String} sensorType
 * @param {String} code
 * @param {JSON} ratingCurve
 * @constructor
 */
istsos.VirtualProcedure = function (service, name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType, code, ratingCurve) {
    istsos.ProcedureBase.call(this, name, description, keywords, foi_name, epsg, x, y, z, outputs);
    this.systemType = (systemType === "virtual") ?
        systemType : null;
    this.sensorType = sensorType || "";
    this.code = {"code": code} || {};
    this.ratingCurve = ratingCurve || {};
    this.service = service;
    service.addVirtualProcedure(this);
    service.getOfferingsProperty()[0].getMemberProceduresProperty().push(this);
};
goog.inherits(istsos.VirtualProcedure, istsos.ProcedureBase);

istsos.VirtualProcedure.prototype = {
    /**
     * @param {String} url
     * @param {istsos.events.EventType} eventType
     * @param {String} method
     * @param {JSON} opt_data
     * @param {function} opt_callback
     */
    executeRequest: function (url, eventType, method, opt_data, opt_callback) {
        goog.net.XhrIo.send(url, function (e) {
            var obj = e.target.getResponseJson();
            console.log(obj);
            istsos.fire(eventType, e.target);
        }, method, opt_data);
    },
    /**
     * @returns {JSON}
     */
    getVirtualProcedureJSON: function () {
        var vProcedureJSON = istsos.ProcedureBase.prototype.getProcedureBaseJSON.call(this);
        vProcedureJSON["classification"] = [{
            "name": "System Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
            "value": (this.systemType === "virtual") ? this.systemType : null
        }, {
            "name": "Sensor Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
            "value": this.sensorType
        }];
        return vProcedureJSON;
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: GET_CODE
     */
    getCode: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.GET_CODE, "GET");
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: NEW_CODE
     */
    registerCode: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.NEW_CODE, "POST", JSON.stringify(this.getCodeProperty()));
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: UPDATE_CODE
     * @param {String} newCode
     */
    updateCode: function (newCode) {
        this.code = {"code" : newCode} || this.code;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.UPDATE_CODE, "PUT", JSON.stringify(this.getCodeProperty()));
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: DELETE_CODE
     */
    deleteCode: function () {
        this.code = "";
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/code";
        this.executeRequest(url, istsos.events.EventType.DELETE_CODE, "DELETE");
    },
    /**
     * @returns {JSON}
     */
    getCodeProperty: function () {
        return this.code;
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: RATING_CURVE
     */
    getRatingCurve: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/ratingcurve";
        console.log(url);
        this.executeRequest(url, istsos.events.EventType.RATING_CURVE, "GET");
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: NEW_RATING_CURVE
     */
    registerRatingCurve: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/ratingcurve";
        this.executeRequest(url, istsos.events.EventType.NEW_RATING_CURVE, "POST", JSON.stringify(this.getRatingCurveProperty()));
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: DELETE_RATING_CURVE
     */
    deleteRatingCurve: function () {
        this.ratingCurve = {};
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/virtualprocedures/" + this.getVirtualProcedureJSON()["system"] + "/ratingcurve";
        this.executeRequest(url, istsos.events.EventType.DELETE_RATING_CURVE, "DELETE");
    },
    /**
     * @returns {JSON}
     */
    getRatingCurveProperty: function () {
        return this.ratingCurve;
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: UPDATE_V_PROCEDURE
     * @param {String} name
     * @param {String} description
     * @param {String} keywords
     * @param {String} foi_name
     * @param {int} epsg
     * @param {int} x
     * @param {int} y
     * @param {int} z
     * @param {Array<istsos.Output>} outputs
     * @param {String} systemType (virtual)
     * @param {String} sensorType
     */
    updateVirtualProcedure: function (name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType) {
        var oldName = this.name;
        this.name = name || this.name;
        this.description = description || this.description;
        this.keywords = keywords || this.keywords;
        this.foi_name = foi_name || this.foi_name;
        this.epsg = epsg || this.epsg;
        this.coordinates = [x, y, z] || this.coordinates;
        var outputs_array = this.outputs;
        if (outputs || outputs.length !== 0) {
            outputs_array.splice(1, outputs_array.length - 1);
            outputs.forEach(function (out) {
                outputs_array.push(out)
            });
        }
        this.systemType = (systemType === "virtual") ? systemType : this.systemType;
        this.sensorType = sensorType || this.sensorType;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/virtualprocedures/" + oldName;
        this.executeRequest(url, istsos.events.EventType.UPDATE_V_PROCEDURE, "PUT", JSON.stringify(this.getVirtualProcedureJSON()));
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: DELETE_V_PROCEDURE
     */
    deleteVirtualProcedure: function () {
        var v_procedures = this.service.getVirtualProceduresProperty();
        var obj = this.getVirtualProcedureJSON();
        v_procedures.forEach(function (p) {
            if (p.getVirtualProcedureJSON()["system"] === obj["system"]) {
                v_procedures.splice(v_procedures.indexOf(p), 1);
            }
        });
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/virtualprocedures/" + this.name;
        this.executeRequest(url, istsos.events.EventType.DELETE_V_PROCEDURE, "DELETE");
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: ADD_TO_OFFERING
     * @param {istsos.Offering} offering
     */
    addMembershipToOffering: function (offering) {
        offering.getMemberProceduresProperty().push(this);
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures";
        this.executeRequest(url, istsos.events.EventType.ADD_TO_OFFERING, "POST", JSON.stringify([{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getVirtualProcedureJSON()["system"]
        }]));
    },
    /**
     * @fires istsos.VirtualProcedure#istsos.events.EventType: REMOVE_FROM_OFFERING
     * @param offering
     */
    removeMembershipFromOffering: function (offering) {
        var procedures = offering.getMemberProceduresProperty();
        var vp_name = this.name;
        procedures.forEach(function (p) {
            if (p.name === vp_name) {
                procedures.splice(procedures.indexOf(p), 1);
            }
        });
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures/" + this.getVirtualProcedureJSON()["system"];
        this.executeRequest(url, istsos.events.EventType.REMOVE_FROM_OFFERING, "DELETE", JSON.stringify([{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getVirtualProcedureJSON()["system"]
        }]));
    },
    /**
     * @returns {Array<istsos.Output>}
     */
    getOutputsProperty: function () {
        return istsos.ProcedureBase.prototype.getOutputsProperty.call(this);
    }
};