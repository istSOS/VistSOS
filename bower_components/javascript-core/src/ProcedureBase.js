goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
/** istsos.ProcedureBase class - ABSTRACT */
/**
 * @param {String} name
 * @param {String} description
 * @param {String} keywords
 * @param {String} foi_name
 * @param {int} epsg
 * @param {int} x
 * @param {int} y
 * @param {int} z
 * @param {Array<istsos.Output>} outputs
 * @constructor
 */
istsos.ProcedureBase = function (name, description, keywords, foi_name, epsg, x, y, z, outputs) {
    this.name = name;
    this.description = description || "";
    this.keywords = keywords || "";
    this.foi_name = foi_name;
    this.epsg = epsg;
    this.coordinates = [x, y, z];
    this.outputs = outputs || [];

};

istsos.ProcedureBase.prototype = {
    /**
     * @returns {Array<istsos.Output>}
     */
    getOutputsProperty: function () {
        return this.outputs;
    },
    /**
     * @returns {JSON}
     */
    getProcedureBaseJSON: function () {
        var procedureBaseJSON = {
            "system_id": this.name,
            "system": this.name,
            "description": this.description,
            "keywords": this.keywords,
            "location": {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": this.coordinates.toString().split(",")
                },
                "crs": {
                    "type": "name",
                    "properties": {
                        "name": this.epsg.toString()
                    }
                },
                "properties": {
                    "name": this.foi_name
                }
            },
            "outputs": [
                {
                    "name": "Time",
                    "definition": "urn:ogc:def:parameter:x-istsos:1.0:time:iso8601",
                    "uom": "iso8601",
                    "description": "",
                    "constraint": {}
                }
            ],
            "inputs": [],
            "history": [],
            "contacts": [],
            "documentation": [],
            "capabilities": []
        };
        this.outputs.forEach(function (out) {
            procedureBaseJSON["outputs"].push(out.getOutputJSON());
        });
        return procedureBaseJSON;

    },
    /**
     * @param {String} individualName
     * @param {String} voice
     * @param {String} fax
     * @param {String} email
     * @param {String} web
     * @param {String} deliveryPoint
     * @param {String} city
     * @param {String} administrativeArea
     * @param {String} postalCode
     * @param {String} country
     * @returns {JSON}
     */
    createContactForm: function (individualName, voice, fax, email, web, deliveryPoint, city, administrativeArea, postalCode, country) {
        return {
            "individualName": individualName || "",
            "voice": voice || "",
            "fax": fax || "",
            "email": email || "",
            "web": web || "",
            "deliveryPoint": deliveryPoint || "",
            "city": city || "",
            "administrativeArea": administrativeArea || "",
            "postalCode": postalCode || "",
            "country": country || ""
        };
    },
    /**
     * @returns {Array<String>}
     */
    getCapabilitiesUom: function () {
        return ["µs", "ms", "s", "min", "h", "d"];
    },
    /**
     * @returns {Array<JSON>}
     */
    getCapabilitiesJson: function () {
        return [
            {
                "name": "Memory Capacity",
                "definition": "urn:x-ogc:def:classifier:x-istsos:1.0:memoryCapacity",
                "uom": "Byte",
                "combo": "Memory Capacity (Byte)"
            }, {
                "name": "Battery Current",
                "definition": "urn:x-ogc:def:phenomenon:x-istsos:1.0:batteryCurrent",
                "uom": "A.h",
                "combo": "Battery Current (A.h)"
            }
        ];
    },
    /**
     * @returns {Array<JSON>}
     */
    getIdentificationNames: function () {
        return [
            {
                "name": "Short Name",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:shortName"
            },
            {
                "name": "Long Name",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:longName"
            },
            {
                "name": "Manufacturer Name",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:manufacturerName"
            },
            {
                "name": "Model Number",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:modelNumber"
            },
            {
                "name": "Serial Number",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:serialNumber"
            },
            {
                "name": "Device ID",
                "definition": "urn:x-ogc:def:identifier:x-istsos:1.0:deviceID"
            }
        ]
    }
};