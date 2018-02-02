Oskari.clazz.define('Oskari.statistics.statsgrid.TogglePlugin', function(sandbox, locale) {
    this.sb = sandbox;
    this.locale = locale;
    this.element = null;
    this._clazz = 'Oskari.statistics.statsgrid.TogglePlugin';
    this._index = 4;
    this._defaultLocation = 'bottom right';
}, {
    showTool: function (tool, shown) {
        if (!this.element) {
            return;
        }
        var stats = this.sb.findRegisteredModuleInstance('StatsGrid');
        var toolElement = this.element.find('.' + tool);
        if ( !shown ) {
            toolElement.hide();
            return;
        }
        toolElement.show();
        var map = this.element.find('.map');
        if(shown) {
            toolElement.trigger('click');
        } else {
            map.trigger('click');
        }
    },
    /**
     * Creates UI for coordinate display and places it on the maps
     * div where this plugin registered.
     * @private @method _createControlElement
     *
     * @return {jQuery}
     */
    _createControlElement: function () {
        if(this.element) {
            return this.element;
        }
        var me = this;
        var toggleButtons = jQuery('<div class="statsgrid-published-toggle-buttons mapplugin"><div class="map"></div><div class="table" style="display:none"></div><div class="diagram" style="display:none"></div>');
        var map = toggleButtons.find('.map');
        var table = toggleButtons.find('.table');
        var diagram = toggleButtons.find('.diagram');
        var stats = this.sb.findRegisteredModuleInstance('StatsGrid');
        var flyoutManager =  stats.getTile().getFlyoutManager();

        map.attr('title', me.locale.showMap);
        table.attr('title', me.locale.showTable);

        map.bind('click', function() {
            if(!map.hasClass('active')) {
                map.addClass('active');
                stats.getEmbeddedTools().forEach( function (tool) {
                    me.element.find('.' + tool).removeClass('active');
                    stats.toggleEmbeddedTools(tool);
                });
            }
        });

        table.bind('click', function () {
            stats.toggleEmbeddedTools("table");
            var flyout = flyoutManager.getFlyout("table");
            
            if( flyout.isVisible() ) {
                map.removeClass('active');
                table.addClass('active');
            } else {
                table.removeClass('active');
            }
        });
        diagram.bind('click', function () {
            stats.toggleEmbeddedTools("diagram");  
            var flyout = flyoutManager.getFlyout("diagram");

            if ( flyout.isVisible() ) {
                map.removeClass('active');
                diagram.addClass('active');
            } else {
                diagram.removeClass('active');
            }
        });
        this.element = toggleButtons;
        return this.element;
    },
    /**
     * Handle plugin UI and change it when desktop / mobile mode
     * @method  @public redrawUI
     */
    redrawUI: function() {
        var me = this;
        me._element = me._createControlElement();
        this.addToPluginContainer(me._element);
    },
    teardownUI : function(stopping) {
        this.sb.postRequestByName('userinterface.UpdateExtensionRequest',[null, 'close', 'StatsGrid']);
        //detach old element from screen
        this.removeFromPluginContainer(this._element, !stopping);
        if(stopping) {
            this.element = null;
        }
    },
    stopPlugin: function(){
        this.teardownUI(true);
    }
}, {
    'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
    /**
     * @static @property {string[]} protocol array of superclasses
     */
    'protocol': [
        "Oskari.mapframework.module.Module",
        "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
    ]
});
