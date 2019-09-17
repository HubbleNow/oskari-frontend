Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.event.LayersChangedEvent',
    function (status, id) {
        this._status = status;
        this._id = id;
    }, {
        __name: 'LayersChanged',
        getName: function () {
            return this.__name;
        },
        getId: function () {
            return this._id;
        },
        getStatus: function () {
            return this._status;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });
