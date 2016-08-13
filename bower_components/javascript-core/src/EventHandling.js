goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');

istsos.events.EventType = {
    ABOUT: 'aboutReceived',
    STATUS: 'statusReceived',
    CONFIGSECTIONS: 'configSectionsReceived',
    PROVIDER: 'providerReceived',
    UPDATE_PROVIDER: 'PUT ProviderReceived',
    IDENTIFICATION: 'identificationReceived',
    UPDATE_IDENTIFICATION: 'PUT identificationReceived',
    MQTT: 'mqttReceived',
    UPDATE_MQTT: 'PUT mqttReceived',
    CRS: 'crsReceived',
    UPDATE_CRS: 'PUT crsReceived',
    OBSERVATION_CONF: 'observationConfigurationReceived',
    UPDATE_OBSERVATION_CONF: 'PUT observationConfigurationReceived',
    PROXY: 'proxyReceived',
    UPDATE_PROXY: 'PUT proxyReceived',
    SERVICE: 'serviceReceived',
    SERVICES: 'servicesListReceived',
    NEW_SERVICE: 'POST serviceReceived',
    DELETE_SERVICE: 'DELETE serviceReceived',
    DATABASE: 'databaseReceived',
    UPDATE_DATABASE: 'PUT databaseReceived',
    VALIDATE_DB: 'POST validateDbReceived',
    EPSG_CODES: 'epsgsReceived',
    SYSTEM_TYPES: 'systemTypesReceived',
    NEW_OFFERING: 'POST offeringReceived',
    OFFERING_NAMES: 'offeringNamesReceived',
    OFFERING_LIST: 'offeringListReceived',
    DELETE_OFFERING: 'DELETE offeringReceived',
    UPDATE_OFFERING: 'PUT offeringReceived',
    MEMBERLIST: 'memberlistReceived',
    NONMEMBERLIST: 'nonmemberlistReceived',
    OBSERVED_PROPERTIES: 'observedPropertiesReceived',
    OBSERVED_PROPERTY: 'observedPropertyReceived',
    NEW_OBSERVED_PROPERTY: 'POST observedPropertyReceived',
    UPDATE_OBSERVED_PROPERTY: 'PUT observedPropertyReceived',
    DELETE_OBSERVED_PROPERTY: 'DELETE observedPropertyReceived',
    DATAQUALITIES: 'dataQualitiesReceived',
    DATAQUALITY: 'dataQualityReceived',
    NEW_DATAQUALITY: 'POST dataQualityReceived',
    UPDATE_DATAQUALITY: 'PUT dataQualityReceived',
    DELETE_DATAQUALITY: 'DELETE dataQualityReceived',
    UOM: 'unitOfMeasureReceived',
    UOMS: 'unitsOfMeasureReceived',
    NEW_UOM: 'POST unitOfMeasureReceived',
    UPDATE_UOM: 'PUT unitOfMeasureReceived',
    DELETE_UOM: 'DELETE unitOfMeasureReceived',
    GET_CODE: 'codeReceived',
    NEW_CODE: 'POST codeReceived',
    UPDATE_CODE: 'PUT codeReceived',
    DELETE_CODE: 'DELETE codeReceived',
    RATING_CURVE: 'ratingCurveReceived',
    NEW_RATING_CURVE: 'POST ratingCurveReceived',
    DELETE_RATING_CURVE: 'DELETE ratingCurveReceived',
    NEW_PROCEDURE: 'POST procedureReceived',
    UPDATE_PROCEDURE: 'PUT procedureReceived',
    DELETE_PROCEDURE: 'DELETE procedureReceived',
    ADD_TO_OFFERING: 'POST addToOfferingReceived',
    REMOVE_FROM_OFFERING: 'DELETE removeFromOfferingReceived',
    VIRTUAL_PROCEDURES: 'virtualProceduresReceived',
    VIRTUAL_PROCEDURE: 'virtualProcedureReceived',
    NEW_VIRTUAL_PROCEDURE: 'POST virtualProcedureReceived',
    UPDATE_V_PROCEDURE: 'PUT virtualProcedureReceived',
    DELETE_V_PROCEDURE: 'DELETE virtualProcedureReceived',
    PROCEDURES: 'proceduresReceived',
    PROCEDURE: 'procedureReceived',
    GEOJSON: 'geojsonReceived',
    GETOBSERVATIONS: 'getobservationsReceived',
    GETOBSERVATIONS_AGG: 'getobservationsAggregationReceived',
    GETOBSERVATIONS_BY_PROPERTY: 'getobservationsDataReceived',
    GETOBSERVATIONS_BY_QUALITY: 'getObservationsByQualityIndexReceived'
};
/**
 * @param type
 * @param xhrIo
 * @param opt_data
 * @constructor
 */
istsos.events.JSONResponse = function (type, xhrIo, opt_data) {
    this.optional = opt_data || null;
    this.type = type;
    goog.base(this, type);
    /**
     * The response in text plain
     * @type {string}
     * @api stable
     */
    this['text'] = xhrIo.getResponseText();
    /**
     * The JSON response object
     * @type {object}
     * @api stable
     */
    this['json'] = xhrIo.getResponseJson();
    /**
     * Show if the response is successfull
     * @type {string}
     * @api stable
     */
    this['success'] = this['json']['success'];

    /**
     * The server message
     * @type {string}
     * @api stable
     */
    this['message'] = this['json']['message'];

};
goog.inherits(istsos.events.JSONResponse, goog.events.Event);

/**
 * @returns {JSON|Array<JSON>}
 */
istsos.events.JSONResponse.prototype.getData = function () {
    var optional = this.optional;
    if(this.type === "geojsonReceived") {
        return this['json'];
    } else if (this.type === "getobservationsDataReceived") {
        var observationObj = this['json']['data'];

        var values = observationObj[0]["result"]["DataArray"]["values"];

        var response = [];
        for (var i = 0; i < values.length; i++) {
            response.push({"date": values[i][0], "measurement": values[i][1]})
        }

        return response;
    } else if (this.type ==="getObservationsByQualityIndexReceived") {
        var observations = this['json']['data'];

        var observationValues = observations[0]["result"]["DataArray"]["values"];

        var responseValues = [];
        for (var j = 0; j < observationValues.length; j++) {
            switch(optional["type"]) {
                case "lessThan":
                    if(observationValues[j][2] < optional["quality"]) {
                        responseValues.push(observationValues[j]);
                    }
                    break;
                case "lessThanAndEqual":
                    if(observationValues[j][2] <= optional["quality"]) {
                        responseValues.push(observationValues[j]);
                    }
                    break;
                case "equal":
                    if(observationValues[j][2] === optional["quality"]) {
                        responseValues.push(observationValues[j]);
                    }
                    break;
                case "greaterThanAndEqual":
                    if(observationValues[j][2] >= optional["quality"]) {
                        responseValues.push(observationValues[j]);
                    }
                    break;
                case "greaterThan":
                    if(observationValues[j][2] > optional["quality"]) {
                        responseValues.push(observationValues[j]);
                    }
                    break;
                case "between":
                    if(observationValues[j][2] >= optional["quality"][0] && observationValues[j][2] <= optional["quality"][1]) {
                        responseValues.push(observationValues[j]);
                    }
                    break;
                default:
                    console.log("WRONG CONSTRAINT TYPE FOR CHECKING QUALITY INDEX!!! SHOULD BE 'lessThan', 'lessThanAndEqual', 'equal', 'greaterThanAndEqual', 'greaterThan' or 'between'");
            }
        }
        this['json']['data'][0]["result"]["DataArray"]["values"] = responseValues;
        return this['json']['data'];
    } else {
        return this['json']['data'];
    }

};

// EVENT HANDLER
istsos.events._Handler = new goog.events.EventTarget();

istsos.on = function (eventType, func, opt_scope) {
    istsos.events._Handler.listen(eventType, func, false, opt_scope);
};

istsos.once = function (eventType, func, opt_scope) {
    istsos.events._Handler.listenOnce(eventType, func, false, opt_scope);
};

istsos.fire = function (eventType, event, opt_data) {
    console.log("Firing event: " + eventType);
    istsos.events._Handler.dispatchEvent(
        new istsos.events.JSONResponse(eventType, event, opt_data)
    );
};