import React from 'react';
import ReactDOM from 'react-dom';
import { FlyoutContent } from './components/FlyoutContent';

const name = 'Oskari.mapframework.bundle.peltodata.Flyout';

Oskari.clazz.define(name,
    function (instance) {
        this.instance = instance;
        this.container = null;
        this.state = null;
    }, {
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return name;
        },
        /**
         * @method setEl
         * @param {Object} el reference to the container in browser
         *
         * Interface method implementation
         */
        setEl: function (el) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('peltodata-flyout')) {
                jQuery(this.container).addClass('peltodata-flyout');
            }
        },
        /**
         * @method startPlugin
         *
         * Interface method implementation, assigns the HTML templates that will be used to create the UI
         */
        startPlugin() {
            this.refresh();
        },
        /**
         * @method stopPlugin
         *
         * Interface method implementation, does nothing atm
         */
        stopPlugin: function () {

        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the flyout
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
         * @param {String} state
         *      close/minimize/maximize etc
         * Interface method implementation, does nothing atm
         */
        setState: function (state) {
            this.state = state;
        },
        createUi: function () {
            console.log('createUI');
            this.refresh();
        },
        refresh() {
         const element = this.container;
         console.log(element);
         ReactDOM.render(<FlyoutContent></FlyoutContent>, element);
        },
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.userinterface.Flyout']
    });
