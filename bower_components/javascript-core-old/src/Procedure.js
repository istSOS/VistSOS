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
 * @param {String} systemType (insitu-fixed-point || insitu-mobile-point)
 * @param {String} sensorType
 * @constructor
 */
istsos.Procedure = function (service, name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType) {
    istsos.ProcedureBase.call(this, name, description, keywords, foi_name, epsg, x, y, z, outputs);
    this.systemType = (systemType === "insitu-fixed-point" || systemType === "insitu-mobile-point") ?
        systemType : null;
    this.sensorType = sensorType || "";
    this.service = service;
    service.addProcedure(this);
    service.getOfferingsProperty()[0].getMemberProceduresProperty().push(this);
};
goog.inherits(istsos.Procedure, istsos.ProcedureBase);

istsos.Procedure.prototype = {
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
    getProcedureJSON: function () {
        var procedureJSON = istsos.ProcedureBase.prototype.getProcedureBaseJSON.call(this);
        procedureJSON["classification"] = [{
            "name": "System Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:systemType",
            "value": (this.systemType === "insitu-mobile-point" || this.systemType === "insitu-fixed-point") ? this.systemType : null
        }, {
            "name": "Sensor Type",
            "definition": "urn:ogc:def:classifier:x-istsos:1.0:sensorType",
            "value": this.sensorType
        }];
        return procedureJSON
    },
    /**
     * @fires istsos.Procedure#istsos.events.EventType: UPDATE_PROCEDURE
     * @param {String} name
     * @param {String} description
     * @param {String} keywords
     * @param {String} foi_name
     * @param {int} epsg
     * @param {int} x
     * @param {int} y
     * @param {int} z
     * @param {Array<istsos.Output>} outputs
     * @param {String} systemType (insitu-fixed-point || insitu-mobile-point)
     * @param {String} sensorType
     */
    updateProcedure: function (name, description, keywords, foi_name, epsg, x, y, z, outputs, systemType, sensorType) {
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
        this.systemType = (systemType === "insitu-fixed-point" || systemType === "insitu-mobile-point") ?
            systemType : null;
        this.sensorType = sensorType || "";
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/procedures/" + oldName;
        this.executeRequest(url, istsos.events.EventType.UPDATE_PROCEDURE, "PUT", JSON.stringify(this.getProcedureJSON()));
    },
    /**
     * @fires istsos.Procedure#istsos.events.EventType: DELETE_PROCEDURE
     */
    deleteProcedure: function () {
        var procedures = this.service.getProceduresProperty();
        var obj = this.getProcedureJSON();
        procedures.forEach(function (p) {
            if (p.getProcedureJSON()["system"] === obj["system"]) {
                procedures.splice(procedures.indexOf(p), 1);
            }
        });
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/procedures/" + this.name;
        this.executeRequest(url, istsos.events.EventType.DELETE_PROCEDURE, "DELETE");
    },
    /**
     * @fires istsos.Procedure#istsos.events.EventType: ADD_TO_OFFERING
     * @param {istsos.Offering} offering
     */
    addMembershipToOffering: function (offering) {
        offering.getMemberProceduresProperty().push(this);
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures";
        this.executeRequest(url, istsos.events.EventType.ADD_TO_OFFERING, "POST", JSON.stringify([{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getProcedureJSON()["system"]
        }]));
    },
    /**
     * @fires istsos.Procedure#istsos.events.EventType: REMOVE_FROM_OFFERING
     * @param {istsos.Offering} offering
     */
    removeMembershipFromOffering: function (offering) {
        var procedures = offering.getMemberProceduresProperty();
        var pname = this.name;
        procedures.forEach(function (p) {
            if (p.name === pname) {
                procedures.splice(procedures.indexOf(p), 1);
            }
        });
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/offerings/" +
            offering.getOfferingJSON()["name"] + "/procedures/" + this.getProcedureJSON()["system"];
        this.executeRequest(url, istsos.events.EventType.REMOVE_FROM_OFFERING, "DELETE", JSON.stringify([{
            "offering": offering.getOfferingJSON()["name"],
            "procedure": this.getProcedureJSON()["system"]
        }]));
    },
    /**
     * @returns {Array<istsos.Output>}
     */
    getOutputsProperty: function () {
        return istsos.ProcedureBase.prototype.getOutputsProperty.call(this);
    }
};