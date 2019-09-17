/**
 * @class Oskari.mapframework.bundle.backendstatus.BackendStatusBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.peltodata.bundle.PeltodataBundle", function () {

}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.peltodata.bundle.PeltodataInstance");
    },
    "update": function (manager, bundle, bi, info) {

    },
}, {

    "protocol": ["Oskari.bundle.Bundle"],
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
        }, {
            "type": "text/javascript",
            "src": "./LayersChangedEvent.js"
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
    }
});

Oskari.bundle_manager.installBundleClass("peltodata", "Oskari.peltodata.bundle.PeltodataBundle");
