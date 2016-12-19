goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/** istsos.UnitOfMeasure  class */
/**
 * @param {istsos.Service} service
 * @param {String} name
 * @param {String} description
 * @constructor
 */
istsos.UnitOfMeasure = function (service, name, description) {
    this.name = name;
    this.description = description || "";
    this.proceduresIncluded = [];
    this.service = service;
    service.addUom(this);
    this.updateProceduresIncluded();
};

istsos.UnitOfMeasure.prototype = {
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
    updateProceduresIncluded: function () {
        var procedures = this.service.getProceduresProperty();
        var v_procedures = this.service.getVirtualProceduresProperty();
        var all = procedures.concat(v_procedures);
        var code = this.name;
        if(all.length !== 0) {
            for (var i = 0; i < all.length; i++) {
                for (var j = 0; j < all[i].getOutputsProperty().length; j++) {
                    if(code === all[i].getOutputsProperty()[j]["uom"]) {
                        this.proceduresIncluded.push(all[i]);
                    }
                }
            }
        }
    },
    /**
     * @returns {JSON}
     */
    getUomJSON: function () {
        var uomJSON = {
            "name": this.name,
            "description": this.description
        };
        return uomJSON;

    },
    /**
     * @fires istsos.UnitOfMeasure#istsos.events.EventType: UPDATE_UOM
     * @param {String} newName
     * @param {String} newDescr
     */
    updateUom: function (newName, newDescr) {
        var oldName = this.name;
        this.name = newName || this.name;
        this.description = newDescr || this.description;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/uoms/" + oldName;
        this.executeRequest(url, istsos.events.EventType.UPDATE_UOM, "PUT", JSON.stringify(this.getUomJSON()));
    },
    /**
     * @fires istsos.UnitOfMeasure#istsos.events.EventType: DELETE_UOM
     */
    deleteUom: function () {
        var procedures = this.service.getProceduresProperty();
        var v_procedures = this.service.getVirtualProceduresProperty();
        var uoms_service = this.service.getUomsProperty();
        var all = procedures.concat(v_procedures);
        var outputs = [];
        all.forEach(function (p) {
            outputs.concat(p.getOutputsProperty());
        });
        var code = this.name;
        var connected = false;
        for (var i = 0; i < outputs.length; i++) {
            if (code === outputs[i].getOutputJSON()["uom"]) {
                alert("CONNECTED TO PROCEDURE");
                connected = true;
                break
            }
        }
        if (connected === false) {
            for (var j = 0; j < uoms_service.length; j++) {
                if (this === uoms_service[j]) {
                    uoms_service.splice(j, 1);
                }
            }
        }
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/uoms/" + this.getUomJSON()["name"];
        this.executeRequest(url, istsos.events.EventType.DELETE_UOM, "DELETE", JSON.stringify(this.getUomJSON()));
    }
};