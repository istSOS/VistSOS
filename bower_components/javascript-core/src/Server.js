goog.require("goog.events");
goog.require("goog.events.Event");
goog.require("goog.events.EventTarget");
goog.require("goog.net.XhrIo");

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
    this.url = (url.endsWith("/")) ? url : url + "/";
    this.defaultDb = defaultDb;
    this.config = opt_config || new istsos.Configuration(null, this);
    this.loginConfig = opt_loginConfig || {};
    this.services = [];
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
