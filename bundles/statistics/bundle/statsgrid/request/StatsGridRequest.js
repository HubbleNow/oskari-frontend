/**
 * @class Oskari.statistics.bundle.statsgrid.request.StatsGridRequest
 * Requests StatsGrid functionality to be activated or disabled
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.request.StatsGridRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Boolean}
 *            blnEnable true to enable, false to disable
 */
function(blnEnable) {
    this._enable = (blnEnable === true);
}, {
    /** @static @property __name request name */
    __name : "StatsGrid.StatsGridRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method isEnabled
     * Returns true if gfi should be enabled, false to disable
     * @return {Boolean}
     */
    isEnabled : function() {
        return this._enable;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
