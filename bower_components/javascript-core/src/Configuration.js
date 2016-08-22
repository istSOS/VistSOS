goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
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