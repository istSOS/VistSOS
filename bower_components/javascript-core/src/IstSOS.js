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
