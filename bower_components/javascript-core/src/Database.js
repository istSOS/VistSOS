goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
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