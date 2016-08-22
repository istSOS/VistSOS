goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/** istsos.ObservedProperty class */
/**
 * @param {istsos.Service} service
 * @param {String} observedName
 * @param {String} definitionUrn
 * @param {String} observedDescr
 * @param {String} opt_constraintType (allowed_values:"between", "lessThan", "greaterThan", "valueList")
 * @param {Array|int} opt_value (Array or integer, depending on constraint type)
 * @constructor
 */

istsos.ObservedProperty = function (service, observedName, definitionUrn, observedDescr, opt_constraintType, opt_value) {
    this.observedName = observedName;
    this.definitionUrn = definitionUrn;
    this.observedDescr = observedDescr || "";
    this.constraint = null;
    var check = this.validateConstraintInput(opt_constraintType, opt_value);
    if (check === true) {
        this.constraint = {};
        this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
        this.constraint[istsos.observedProperty.ConstraintInputs[opt_constraintType]] = (opt_value.constructor === Array) ?
            opt_value.toString().split(",") : opt_value.toString();
    } else {
        console.log("Input constraintType and constraintValue for property <" + this.observedName.toUpperCase() +
                "> are INCORRECT or INTENTIONALLY NULL!!! ");
    }
    this.service = service;
    this.proceduresIncluded = [];
    this.updateProceduresIncluded();
    service.addObservedProperty(this);
};

istsos.ObservedProperty.prototype = {
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
        var name = this.observedName;
        if(all.length !== 0) {
            for (var i = 0; i < all.length; i++) {
                for (var j = 0; j < all[i].getOutputsProperty().length; j++) {
                    if(name = all[i].getOutputsProperty()[j]["name"]) {
                        this.getProceduresIncluded().push(all[i]);
                    }
                }
            }
        }
    },
    /**
     * @returns {Array<istsos.Procedure|istsos.VirtualProcedure>}
     */
    getProceduresIncluded: function () {
        return this.proceduresIncluded;
    },
    /**
     * @returns {JSON}
     */
    getObservedPropertyJSON: function () {
        var observedJSON = {
            "name": this.observedName,
            "definition": this.definitionUrn,
            "description": this.observedDescr,
            "constraint": this.constraint
        };
        return observedJSON;
    },
    /**
     * @fires istsos.ObservedProperty#istsos.events.EventType: UPDATE_OBSERVED_PROPERTY
     * @param {String} newPropertyName
     * @param {String} newDefinitionUrn
     * @param {String} newPropertyDescr
     * @param {String} opt_constraintType
     * @param {Array<int>|int} opt_value
     */
    updateObservedProperty: function (newPropertyName, newDefinitionUrn, newPropertyDescr, opt_constraintType, opt_value) {
        var oldDefinitionUrn = this.definitionUrn;
        this.observedName = newPropertyName || this.observedName;
        this.definitionUrn = newDefinitionUrn || this.definitionUrn;
        this.observedDescr = newPropertyName || this.observedDescr;
        if (this.validateConstraintInput(opt_constraintType, opt_value) === true) {
            this.constraint = {};
            this.constraint["role"] = "urn:x-ogc:def:classifiers:x-istsos:1.0:qualityIndexCheck:level0";
            this.constraint[istsos.ConstraintInputs[opt_constraintType]] = (opt_value.constructor === Array) ?
                opt_value.toString().split(",") : opt_value.toString();
        } else {
            console.log("Input constraintType and constraintValue for property <" + this.observedName.toUpperCase() +
                "> are INCORRECT or INTENTIONALLY NULL!!! Constraint object will NOT BE CHANGED!!!");
        }
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/observedproperties/" +  oldDefinitionUrn;
        this.executeRequest(url, istsos.events.EventType.UPDATE_OBSERVED_PROPERTY, "PUT", JSON.stringify(this.getObservedPropertyJSON()));
    },
    /**
     * @fires istsos.ObservedProperty#istsos.events.EventType: DELETE_OBSERVED_PROPERTY
     */
    deleteObservedProperty: function () {
        var procedures = this.service.getProceduresProperty();
        var v_procedures = this.service.getVirtualProceduresProperty();
        var properties_service = this.service.getObservedPropertiesProperty();
        var all = procedures.concat(v_procedures);
        var outputs = [];
        all.forEach(function (p) {
            outputs.concat(p.getOutputsProperty());
        });
        var name = this.observedName;
        var connected = false;
        for (var i = 0; i < outputs.length; i++) {
            if (name === outputs[i].getOutputJSON()["name"]) {
                alert("CONNECTED TO PROCEDURE");
                connected = true;
                break
            }
        }
        if (connected === false) {
            for (var j = 0; j < properties_service.length; j++) {
                if (this === properties_service[j]) {
                    properties_service.splice(j, 1);
                }
            }
        }
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] + "/observedproperties/" +
            this.getObservedPropertyJSON()["definition"];
        this.executeRequest(url, istsos.events.EventType.DELETE_OBSERVED_PROPERTY, "DELETE");
    },
    /**
     * @param {String} constraintType
     * @param {Array|int} constraintValue
     * @returns {boolean}
     */
    validateConstraintInput: function (constraintType, constraintValue) {
        switch (constraintType) {
            case "between":
                if (constraintValue.constructor !== Array) {
                    return false;
                } else {
                    return true;
                }
            case "lessThan":
                if (constraintValue !== parseInt(constraintValue, 10)) {
                    return false;
                } else {
                    return true;
                }
            case "greaterThan":
                if (constraintValue !== parseInt(constraintValue, 10)) {
                    return false;
                } else {
                    return true;
                }
            case "valueList":
                if (constraintValue.constructor !== Array) {
                    return false;
                } else {
                    return true;
                }
            default:
                console.log('Constraint type must be "between", "lessThan", "greaterThan" or "valueList"');
                return false;
        }
    }
};

istsos.observedProperty.ConstraintInputs = {
    "between": "interval",
    "lessThan": "max",
    "greaterThan": "min",
    "valueList": "valueList"
};