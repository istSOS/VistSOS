goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.net.XhrIo');
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