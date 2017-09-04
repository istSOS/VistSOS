goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/**
 * @param {istsos.ObservedProperty} property
 * @param {istsos.UnitOfMeasure} uom
 * @param {String} description
 * @param {String} opt_constraintType
 * @param {Array|int} opt_constraintValue
 * @constructor
 */
istsos.Output = function (property, uom, description, opt_constraintType, opt_constraintValue) {
    this.observedProperty = property;
    this.uom = uom;
    this.description = description || "";
    this.constraint = {};
    var check = this.validateConstraintInput(opt_constraintType, opt_constraintValue);
    if (check === true) {
        this.constraint["role"] = "urn:ogc:def:classifiers:x-istsos:1.0:qualityIndex:check:reasonable";
        this.constraint[istsos.observedProperty.ConstraintInputs[opt_constraintType]] = (opt_constraintValue.constructor === Array) ?
            opt_constraintValue.toString().split(",") : opt_constraintValue.toString();
    } else {
        console.log("Input constraintType and constraintValue are incorrect or intentionally null/undefined!!! ");
    }
};

istsos.Output.prototype = {
    /**
     * @param {String} constraintType
     * @param {Array<int>|int}constraintValue
     * @returns {boolean}
     */
    validateConstraintInput: function (constraintType, constraintValue) {
        switch (constraintType) {
            case 'between':
                if (constraintValue.constructor !== Array) {
                    return false;
                } else {
                    return true;
                }
            case 'lessThan':
                if (constraintValue !== parseInt(constraintValue, 10)) {
                    return false;
                } else {
                    return true;
                }
            case 'greaterThan':
                if (constraintValue !== parseInt(constraintValue, 10)) {
                    return false;
                } else {
                    return true;
                }
            case 'valueList':
                if (constraintValue.constructor !== Array) {
                    return false;
                } else {
                    return true;
                }
            default:
                console.log('Constraint type must be "between", "lessThan", "greaterThan" or "valueList"');
                return false;
        }
    },
    /**
     * @returns {JSON}
     */
    getOutputJSON: function () {
        var outputJSON = {
            "name": this.observedProperty.getObservedPropertyJSON()["name"],
            "definition": this.observedProperty.getObservedPropertyJSON()["definition"],
            "uom": this.uom.getUomJSON()["name"],
            "description": this.description || "",
            "constraint": this.constraint
        };
        return outputJSON;
    }
};