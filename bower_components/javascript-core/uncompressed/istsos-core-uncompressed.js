goog.provide("istsos");
goog.provide("istsos.events");
goog.provide("istsos.observedProperty");
goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
goog.require("goog.net.XhrIo");

/** istsos.IstSOS class */
/**
 * @constructor
 */
istsos.IstSOS = function () {
    this.servers = [];
};

istsos.IstSOS.prototype = {
    /**
     * @param {istsos.Server} server
     */
    addServer: function (server) {
        this.servers.push(server);
    },
    /**
     * @param {String} old_name
     * @param {String} new_name
     * @param {String} new_url
     * @param {istsos.Configuration} new_config
     * @param {istsos.Database} new_defaultDb
     */
    updateServer: function (old_name, new_name, new_url, new_config, new_defaultDb) {
        var oldServer = this.getServer(old_name);
        oldServer["serverName"] = new_name || oldServer["serverName"];
        oldServer["url"] = new_url || oldServer["url"];
        oldServer["config"] = new_config || oldServer["config"];
        oldServer["defaultDb"] = new_defaultDb || oldServer["defaultDb"];
    },
    /**
     * @param {String} name
     */
    removeServer: function (name) {
        var i;
        for (i = 0; i < this.servers.length; i++) {
            if (this.servers[i]["serverName"] === name) {
                this.servers.splice(i, 1);
            }
        }
    },
    /**
     * @param {String} name
     * @returns {istsos.Server}
     */
    getServer: function (name) {
        for (i = 0; i < this.servers.length; i++) {
            if (this.servers[i]["serverName"] === name) {
                return this.servers[i];
            }
        }
    },
    /**
     * @returns {Array<istsos.Server>}
     */
    getServerList: function () {
        return this.servers
    }
};

/** istsos.Database class */
/**
 * @param {String} dbname
 * @param {String} host
 * @param {String} user
 * @param {String} password
 * @param {int} port
 * @constructor
 */
istsos.Database = function (dbname, host, user, password, port) {
    this.dbname = dbname;
    this.host = host;
    this.user = user;
    this.password = password;
    this.port = port;
};

istsos.Database.prototype = {
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
     * @fires istsos.Database#istsos.events.EventType: DATABASE
     * @param {String} serviceName
     * @param {istsos.Server} server
     */
    getDb: function (serviceName, server) {
        var sname = serviceName || "default";
        var url = server.getUrl() + "wa/istsos/services/" + sname + "/configsections/connection";
        this.executeRequest(url, istsos.events.EventType.DATABASE, "GET");
    },
    /**
     * @fires istsos.Database#istsos.events.EventType: UPDATE_DATABASE
     * @param {String} dbname
     * @param {String} host
     * @param {String} user
     * @param {String} password
     * @param {int} port
     * @param {istsos.Server} server
     * @param {istsos.Service} opt_service
     */
    setDb: function (dbname, host, user, password, port, server, opt_service) {
        this.dbname = dbname || this.dbname;
        this.host = host || this.host;
        this.password = password || this.password;
        this.port = port || this.port;
        var sname = (opt_service) ? opt_service.getServiceJSON()["service"] : "default";
        var url = server.getUrl() + "wa/istsos/services/" + sname + "/configsections/connection";
        this.executeRequest(url, istsos.events.EventType.UPDATE_DATABASE, "PUT", JSON.stringify(this.getDbJSON()));
    },
    /**
     * @fires istsos.Database#istsos.events.EventType: VALIDATE_DB
     * @param {istsos.Server} server
     */
    validateDb: function (server) {
        var url = server.getUrl() + "wa/istsos/operations/validatedb";
        this.executeRequest(url, istsos.events.EventType.VALIDATE_DB, "POST", JSON.stringify(this.getDbJSON()));
    },
    /**
     * @returns {JSON}
     */
    getDbJSON: function () {
        return {
            "dbname": this.dbname,
            "host": this.host,
            "user": this.user,
            "password": this.password,
            "port": this.port.toString(),
        };
    }
};

/** istsos.Configuration class */
/**
 * @param {String} serviceName
 * @param {istsos.Server} server
 * @constructor
 */
istsos.Configuration = function (serviceName, server) {
    this.sname = (serviceName) ? serviceName : "default";
    this.serverUrl = server.getUrl();
};

istsos.Configuration.prototype = {
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
     * @fires istsos.Configuration#istsos.events.EventType: CONFIGSECTIONS
     */
    getConf: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections";
        this.executeRequest(url, istsos.events.EventType.CONFIGSECTIONS, "GET");
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: PROVIDER
     */
    getProvider: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/provider";
        this.executeRequest(url, istsos.events.EventType.PROVIDER, "GET");
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: UPDATE_PROVIDER
     * @param {String} providerName
     * @param {String} providerSite
     * @param {String} contactName
     * @param {String} contactPosition
     * @param {String} contactVoice
     * @param {String} contactFax
     * @param {String} contactEmail
     * @param {String} contactDeliveryPoint
     * @param {String} contactPostalCode
     * @param {String} contactCity
     * @param {String} contactAdminArea
     * @param {String} contactCountry
     */
    updateProvider: function (providerName, providerSite, contactName, contactPosition, contactVoice, contactFax,
                              contactEmail, contactDeliveryPoint, contactPostalCode,
                              contactCity, contactAdminArea, contactCountry) {
        var data = {
            "providername": providerName || "",
            "providersite": providerSite || "",
            "contactname": contactName || "",
            "contactposition": contactPosition || "",
            "contactvoice": contactVoice || "",
            "contactfax": contactFax || "",
            "contactemail": contactEmail || "",
            "contactdeliverypoint": contactDeliveryPoint || "",
            "contactpostalcode": contactPostalCode || "",
            "contactcity": contactCity || "",
            "contactadminarea": contactAdminArea || "",
            "contactcountry": contactCountry || ""
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/provider";
        this.executeRequest(url, istsos.events.EventType.UPDATE_PROVIDER, "PUT", JSON.stringify(data));
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: IDENTIFICATION
     */
    getIdentification: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/identification";
        this.executeRequest(url, istsos.events.EventType.IDENTIFICATION, "GET");
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: UPDATE_IDENTIFICATION
     * @param {String} title
     * @param {String} abstract
     * @param {String} urnVersion
     * @param {String} authority
     * @param {String} fees
     * @param {String} keywords
     * @param {String} accessConstrains
     */
    updateIdentification: function (title, abstract, urnVersion, authority, fees, keywords, accessConstrains) {
        var data = {
            "title": title || "",
            "abstract": abstract || "",
            "urnversion": urnVersion || "",
            "authority": authority || "",
            "fees": fees || "",
            "keywords": keywords || "",
            "accessconstrains": accessConstrains || ""
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/identification";
        console.log(url);
        console.log(JSON.stringify(data));
        this.executeRequest(url, istsos.events.EventType.UPDATE_IDENTIFICATION, "PUT", JSON.stringify(data));
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: MQTT
     */
    getMqtt: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/mqtt";
        this.executeRequest(url, istsos.events.EventType.MQTT, "GET");
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: UPDATE_MQTT
     * @param {String} brokerPassword
     * @param {String} brokerUser
     * @param {String} brokerTopic
     * @param {String} brokerUrl
     * @param {String} brokerPort
     */
    updateMqtt: function (brokerPassword, brokerUser, brokerTopic, brokerUrl, brokerPort) {
        var data = {
            "broker_password": brokerPassword || "",
            "broker_user": brokerUser || "",
            "broker_topic": brokerTopic || "",
            "broker_url": brokerUrl || "",
            "broker_port": brokerPort || ""
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/mqtt";
        this.executeRequest(url, istsos.events.EventType.UPDATE_MQTT, "PUT", JSON.stringify(data));
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: CRS
     */
    getCrs: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/geo";
        this.executeRequest(url, istsos.events.EventType.CRS, "GET");
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: UPDATE_CRS
     * @param {String} z_axis_name
     * @param {String} x_axis_name
     * @param {String} y_axis_name
     * @param {int} allowedEpsg
     * @param {int} istsosEpsg
     */
    updateCrs: function (z_axis_name, x_axis_name, y_axis_name, allowedEpsg, istsosEpsg) {
        var data = {
            "zaxisname": z_axis_name || "",
            "xaxisname": x_axis_name || "",
            "yaxisname": y_axis_name || "",
            "allowedepsg": allowedEpsg.toString() || "",
            "istsosepsg": istsosEpsg.toString() || ""
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/geo";
        this.executeRequest(url, istsos.events.EventType.UPDATE_CRS, "PUT", JSON.stringify(data));
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: OBSERVATION_CONF
     */
    getObservationConf: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/getobservation";
        this.executeRequest(url, istsos.events.EventType.OBSERVATION_CONF, "GET");
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: UPDATE_OBSERVATION_CONF
     * @param {String} correctQi
     * @param {String} statQi
     * @param {String} defaultQi
     * @param {String} aggregateNoDataQi
     * @param {String} maxGoPeriod
     * @param {String} transactionalLog
     * @param {String} aggregateNoData
     */
    updateObservationConf: function (correctQi, statQi, defaultQi, aggregateNoDataQi,
                                     maxGoPeriod, transactionalLog, aggregateNoData) {
        var data = {
            "correct_qi": correctQi || "",
            "stat_qi": statQi || "",
            "defaultqi": defaultQi || "",
            "aggregatenodataqi": aggregateNoDataQi || "",
            "maxgoperiod": maxGoPeriod || "",
            "transactional_log": transactionalLog || "",
            "aggregatenodata": aggregateNoData || ""
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/getobservation";
        this.executeRequest(url, istsos.events.EventType.UPDATE_OBSERVATION_CONF, "PUT", JSON.stringify(data));
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: PROXY
     */
    getProxy: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/serviceurl";
        this.executeRequest(url, istsos.events.EventType.PROXY, "GET");
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: UPDATE_PROXY
     * @param {String} newUrl
     */
    updateProxy: function (newUrl) {
        var data = {
            "url": newUrl || ""
        };
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/configsections/serviceurl";
        this.executeRequest(url, istsos.events.EventType.UPDATE_PROXY, "PUT", JSON.stringify(data));
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: EPSG_CODES
     */
    getEpsgCodes: function () {
        var url = this.serverUrl + "wa/istsos/services/" + this.sname + "/epsgs";
        this.executeRequest(url, istsos.events.EventType.EPSG_CODES, "GET");
    }
};

/** istsos.Date class */
/**
 * @param {int} year
 * @param {int} month
 * @param {int} day
 * @param {int} hours
 * @param {int} minutes
 * @param {int} seconds
 * @param {int} gmt
 * @param {String} opt_description
 * @constructor
 */
istsos.Date = function (year, month, day, hours, minutes, seconds, gmt, opt_description) {
    this.year = year.toString();
    this.month = (month > 9) ? month.toString() : "0" + month.toString();
    this.day = (day > 9) ? day.toString() : "0" + day.toString();
    this.hours = (hours > 9) ? hours.toString() : "0" + hours.toString();
    this.minutes = (minutes > 9) ? minutes.toString() : "0" + minutes.toString();
    this.seconds = (seconds > 9) ? seconds.toString() : "0" + seconds.toString();
    this.gmt = (gmt > 9) ? gmt.toString() : "0" + gmt.toString();
    this.description = opt_description || "Class for converting date&time to proper istSOS format";
};

istsos.Date.prototype = {
    /**
     * @returns {string}
     */
    getDateString: function () {
        return this.year + "-" + this.month + "-" + this.day + "T" +
            this.hours + ":" + this.minutes + ":" + this.seconds + "+" +
            this.gmt + ":" + "00";
    },
    /**
     * @returns {String}
     */
    getDescription: function () {
        return this.description;
    }
};

/** istsos.Server class */
/**
 * @param {String} serverName
 * @param {String} url
 * @param {istsos.Database} defaultDb
 * @param {istsos.Configuration} opt_config
 * @param {JSON} opt_loginConfig
 * @constructor
 */
istsos.Server = function (serverName, url, defaultDb, opt_config, opt_loginConfig) {
    this.serverName = serverName;
    this.url = (url.charAt(url.length - 1) === "/") ? url : url + "/";
    this.defaultDb = defaultDb;
    this.config = opt_config || new istsos.Configuration(null, this);
    this.loginConfig = opt_loginConfig || {};
    this.services = [];
    this.login();
};

istsos.Server.prototype = {
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
     *@fires istsos.Server#istsos.events.EventType: LOGIN
     */
     login: function() {
         var authStr = this.loginConfig.user + ":" + this.loginConfig.password + "@";
         var url = this.url.match(/http:/gi) ?
         [this.url.slice(0,7), authStr, this.url.slice(7), "wa/istsos/operations/status"].join("") : "http://" + authStr + this.url + "wa/istsos/operations/status";
         this.executeRequest(url, istsos.events.EventType.LOGIN, "GET");
     },
    /**
     * @fires istsos.Server#istsos.events.EventType: SERVICE
     * @param {istsos.Service} service
     */
    getService: function (service) {
        var url = this.url + "wa/istsos/services/" + service.getServiceJSON()["service"];
        this.executeRequest(url, istsos.events.EventType.SERVICE, "GET");
    },
    /**
     * @param {istsos.Service} service
     */
    addService: function (service) {
        this.services.push(service);
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: NEW_SERVICE
     * @param {istsos.Service} service
     */
    registerService: function (service) {
        var url = this.getUrl() + "wa/istsos/services";
        this.executeRequest(url, istsos.events.EventType.NEW_SERVICE, "POST", JSON.stringify(service.getServiceJSON()));
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: DELETE_SERVICE
     * @param {istsos.Service} service
     */
    deleteService: function (service) {
        for (var i = 0; i < this.services.length; i++) {
            if (this.services[i].getServiceJSON()["service"] === service.getServiceJSON()["service"]) {
                this.services.splice(i, 1);
            }
        }
        var url = this.url + "wa/istsos/services/" + service.serviceName;
        this.executeRequest(url, istsos.events.EventType.DELETE_SERVICE, "DELETE", JSON.stringify({"name": service.serviceName}));
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: STATUS
     */
    getStatus: function () {
        var url = this.url + "wa/istsos/operations/status";
        this.executeRequest(url, istsos.events.EventType.STATUS, "GET");
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: ABOUT
     */
    getAboutInfo: function () {
        var url = this.url + "wa/istsos/operations/about";
        this.executeRequest(url, istsos.events.EventType.ABOUT, "GET");
    },
    /**
     * @fires istsos.Configuration#istsos.events.EventType: CONFIGURATION
     */
    getConfig: function () {
        this.config.getConf();
    },
    /**
     * @returns {istsos.Configuration}
     */
    getConfigProperty: function () {
        return this.config;
    },
    /**
     * @returns {Array<istsos.Service>}
     */
    getServicesProperty: function () {
        return this.services
    },
    /**
     * @fires istsos.Service#istsos.events.EventType: SERVICES
     */
    getServices: function () {
        var url = this.url + "wa/istsos/services";
        this.executeRequest(url, istsos.events.EventType.SERVICES, "GET");
    },
    /**
     * @fires istsos.Database#istsos.events.EventType: DATABASE
     */
    getDefaultDb: function () {
        this.defaultDb.getDb("default", this);
    },
    /**
     * @returns {istsos.Database}
     */
    getDefaultDbProperty: function () {
        return this.defaultDb;
    },
    /**
     * @returns {String}
     */
    getUrl: function () {
        return this.url;
    }
};

/**
 * @description Event handling
 */
istsos.events.EventType = {
    LOGIN: 'loginReceived',
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
    } else if (this.type === "loginReceived") {
        console.log("LOGIN...");
    }
    else {
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
     * @param {JSON} opt_aggregationConf
     */
     /*
     << HOW TO CREATE AGGREGATION CONF JSON >>
     {
        "function": "SUM", "MAX", "MIN" OR "AVG",
        "interval": example - "P1DT" is (1 day), "PT24H" is (24 hours),
        "noData": optional
        "noDataQi": optional
     }
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
     * @fires istsos.Service#istsos.events.EventType: GETOBSERVATIONS_AGG
     * @param {istsos.Offering} offering
     * @param {Array<istsos.Procedure|istsos.VirtualProcedure>} procedures
     * @param {Array<istsos.ObservedProperty>} observed_properties
     * @param {istsos.Date} begin_time
     * @param {istsos.Date} end_time
     * @param {String} aggFunc allowed - "SUM", "MAX", "MIN" OR "AVG"
     * @param {String} aggInterval example - "P1DT" is 1 day or "PT24H" is 24H...
     * @param {int} aggNoData
     * @param {int} aggNoDataQI
     */
    getObservationsWithAggregation: function (offering, procedures, observed_properties, begin_time, end_time, aggFunc, aggInterval, aggNoData, aggNoDataQI) {
        var proc_names = [];
        var aggTrue = ""
        if(aggFunc && aggInterval) {
            aggTrue = "?"
        }
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
            "/eventtime/" + begin + "/" + end + aggTrue;

        if(aggFunc && aggInterval) {
            if(aggFunc === "SUM" || aggFunc === "MAX" || aggFunc === "MIN" || aggFunc === "AVG") {
                url += "aggregatefunction=" + aggFunc + "&" + "aggregateinterval=" + aggInterval;
            } else {
                console.log("Incorrect aggregate function!!!");
            }

        }

        if(aggNoData && aggNoDataQI) {
            url += "&aggregatenodata=" + aggNoData.toString() + "&aggregatenodataqi=" + aggNoDataQI.toString();
        }


        console.log(url);
        this.executeRequest(url, istsos.events.EventType.GETOBSERVATIONS_AGG, "GET");
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

/** istsos.Offering class */
/**
 * @param {String} offeringName
 * @param {String} offeringDescription
 * @param {boolean} active
 * @param {istsos.Date} expirationDate
 * @param {istsos.Service} service
 * @constructor
 */
istsos.Offering = function (offeringName, offeringDescription, active, expirationDate, service) {
    this.offeringName = offeringName;
    this.offeringDescription = offeringDescription || "";
    this.active = active || false;
    this.expirationDate = (expirationDate && expirationDate.constructor === istsos.Date) ? expirationDate.getDateString() : "";
    this.service = service;
    this.memberProcedures = [];
    service.addOffering(this);
};

istsos.Offering.prototype = {
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
     * @param {istsos.Procedure|istsos.VirtualProcedure} procedure
     */
    addProcedure: function (procedure) {
        this.memberProcedures.push(procedure);
    },
    /**
     * @fires istsos.Offering#istsos.events.EventType: UPDATE_OFFFERING
     * @param {String} newName
     * @param {String} newDescription
     * @param {boolean} newActive
     * @param {istsos.Date} newExpirationDate
     */
    updateOffering: function (newName, newDescription, newActive, newExpirationDate) {
        var oldOfferingName = this.offeringName;
        this.offeringName = newName || this.offeringName
        this.offeringDescription = newDescription || this.offeringDescription;
        this.active = newActive || this.active;
        this.expirationDate = newExpirationDate || this.expirationDate;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/offerings/" + oldOfferingName;
        this.executeRequest(url, istsos.events.EventType.UPDATE_OFFERING, "PUT", JSON.stringify(this.getOfferingJSON()));
    },
    /**
     * @fires istsos.Offering#istsos.events.EventType: DELETE_OFFERING
     */
    deleteOffering: function () {
        for (var i = 0; i < this.service.getOfferingsProperty().length; i++) {
            if (this.offeringName === this.service.getOfferingsProperty()[i]["name"]) {
                this.service.getOfferingsProperty().splice(i, 1);
            }
        }
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/offerings/" + this.getOfferingJSON()["name"];
        var data = {
            "name": this.getOfferingJSON()["name"],
            "description": this.getOfferingJSON()["description"]
        };
        this.executeRequest(url, istsos.events.EventType.DELETE_OFFERING, "DELETE", JSON.stringify(data));
    },
    /**
     * @returns {Array<istsos.Procedure|istsos.VirtualProcedure>}
     */
    getMemberProceduresProperty: function () {
        return this.memberProcedures;
    },
    /**
     * @fires istsos.Offering#istsos.events.EventType: MEMBERLIST
     */
    getMemberProcedures: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/offerings/" + this.getOfferingJSON()["name"] + "/procedures/operations/memberslist";
        this.executeRequest(url, istsos.events.EventType.MEMBERLIST, "GET");
    },
    /**
     * @fires istsos.Offering#istsos.events.EventType: NONMEMBERLIST
     */
    getNonMemberProcedures: function () {
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/offerings/" + this.getOfferingJSON()["name"] + "/procedures/operations/nonmemberslist";
        this.executeRequest(url, istsos.events.EventType.NONMEMBERLIST, "GET");
    },
    /**
     * @returns {JSON}
     */
    getOfferingJSON: function () {
        var offeringJSON = {
            "name": this.offeringName,
            "description": this.offeringDescription,
            "expiration": this.expirationDate
        };
        if (this.active === true) {
            offeringJSON["active"] = "on"
        }
        return offeringJSON;
    }
};

/** istsos.Output clas */
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

/** istsos.Procedure class */
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

/** istsos.VirtualProcedure class */
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

/** istsos.DataQuality class */
/**
 * @param {istsos.Service} service
 * @param {int} codeDQ
 * @param {String} nameDQ
 * @param {String} descrDQ
 * @constructor
 */
istsos.DataQuality = function (service, codeDQ, nameDQ, descrDQ) {
    this.code = codeDQ;
    this.name = nameDQ;
    this.description = descrDQ || "";
    this.service = service;
    service.addDataQuality(this);
};

istsos.DataQuality.prototype = {
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
    getDataQualityJSON: function () {
        var dqJSON = {
            "code": this.code.toString(),
            "name": this.name,
            "description": this.description
        };
        return dqJSON;
    },
    /**
     * @fires istsos.DataQuality#istsos.events.EventType: UPDATE_DATAQUALITY
     * @param {int} newCodeDQ
     * @param {String} newNameDQ
     * @param {String} newDescrDQ
     */
    updateDataQuality: function ( newCodeDQ, newNameDQ, newDescrDQ) {
        var oldName = this.code;
        this.code = newCodeDQ || this.code;
        this.name = newNameDQ || this.name;
        this.description = newDescrDQ || this.description;
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/dataqualities/" + oldName;
        this.executeRequest(url, istsos.events.EventType.UPDATE_DATAQUALITY, "PUT", JSON.stringify(this.getDataQualityJSON()));
    },
    /**
     * @fires istsos.DataQuality#istsos.events.EventType: DELETE_DATAQUALITY
     */
    deleteDataQuality: function () {
        var dataQualities = this.service.getDataQualitiesProperty();
        for (var i = 0; i < dataQualities.length; i++) {
            if (this.code === dataQualities[i]["code"]) {
                dataQualities.splice(i, 1);
            }
        }
        var url = this.service.server.getUrl() + "wa/istsos/services/" + this.service.getServiceJSON()["service"] +
            "/dataqualities/" + this.getDataQualityJSON()["code"];
        this.executeRequest(url, istsos.events.EventType.DELETE_DATAQUALITY, "DELETE", JSON.stringify(this.getDataQualityJSON()));
    }
};
