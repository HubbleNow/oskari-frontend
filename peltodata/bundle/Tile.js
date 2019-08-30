import { PeltodataFlyout } from './Flyout';

/*
 * @class Oskari.framework.bundle.peltodata.Tile
 *
 * Renders the layer rights management tile.
 */
Oskari.clazz.define('Oskari.framework.bundle.peltodata.Tile',

    /**
       * @method create called automatically on construction
       * @static
       * @param {Oskari.mapframework.bundle.search.SearchBundleInstance} instance
       *        reference to component that created the tile
       */
    function (instance) {
        var me = this;
        me.instance = instance;
        me.container = null;
        me.template = null;
        me.flyoutVisible = false;
        me.flyout = new PeltodataFlyout(this.instance.getLocalization('title'), { width: '500px', height: '800px'});
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.framework.bundle.peltodata.Tile';
        },
        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function (el, width, height) {
            this.container = jQuery(el);
        },
        /**
         * @method startPlugin
         * Interface method implementation, calls #refresh()
         */
        startPlugin: function () {
            this.refresh();
        },
        hideFlyout() {
            console.log('hideFlyout');
            this.flyoutVisible = false;

            this.container.removeClass('oskari-tile-attached');
            this.container.addClass('oskari-tile-closed');
            this.flyout.hide();
        },
        showFlyout() {
            console.log('showFlyout');
            this.flyoutVisible = true;
            this.container.addClass('oskari-tile-attached');
            this.container.removeClass('oskari-tile-closed');
            this.flyout.show();
            this.flyout.move(200, 30, true);
        },
        clickHandler(data) {
            console.log(data);
            if (this.flyoutVisible) {
                this.hideFlyout();
            } else {
                this.showFlyout();
            }
        },
        /**
         * @method stopPlugin
         * Interface method implementation, clears the container
         */
        stopPlugin: function () {
            this.container.empty();
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the tile
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the tile
         */
        getDescription: function () {
            return this.instance.getLocalization('desc');
        },
        /**
         * @method getOptions
         * Interface method implementation, does nothing atm
         */
        getOptions: function () {

        },
        /**
         * @method setState
         * @param {Object} state
         *      state that this component should use
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            console.log('state')
        },
        /**
         * @method refresh
         * Creates the UI for a fresh start
         */
        refresh: function () {

        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Tile']
    });
