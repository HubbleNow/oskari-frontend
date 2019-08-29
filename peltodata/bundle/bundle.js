/**
 * @class Oskari.mapframework.bundle.backendstatus.BackendStatusBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.mapframework.bundle.peltodata.PeltodataBundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.mapframework.bundle.peltodata.PeltodataInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    },
}, {

    "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source": {
        "scripts": [{
            "type": "text/javascript",
            "src": "./instance.js",
        }, {
            "type": "text/javascript",
            "src": "./Tile.js",
        }, {
            "type": "text/javascript",
            "src": "./Flyout.js",
        }],
        "locales": [{
            "lang": "fi",
            "type": "text/javascript",
            "src": "./resources/locale/fi.js",
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "./resources/locale/en.js",
        }, {
            "lang": "en",
            "type": "text/javascript",
            "src": "./resources/locale/en.js",
        }],
    },
    "bundle": {
        "manifest": {},
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies": ["jquery"],
});

Oskari.bundle_manager.installBundleClass("peltodata", "Oskari.mapframework.bundle.peltodata.PeltodataBundle");
