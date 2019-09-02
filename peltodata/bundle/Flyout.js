import React from 'react';
import ReactDOM from 'react-dom';
import { FlyoutContent } from './components/FlyoutContent';

const ExtraFlyout = Oskari.clazz.get('Oskari.userinterface.extension.ExtraFlyout');

export class PeltodataFlyout extends ExtraFlyout {
    constructor (title, options) {
        super(title, options);
        this.element = null;
        this.on('show', () => {
            if (!this.getElement()) {
                this.createUi();
            } else {
                this.update();
            }
        });
        this.on('hide', () => {
            this.cleanUp();
        });
    }
    setElement (el) {
        this.element = el;
    }
    getElement () {
        return this.element;
    }
    createUi () {
        this.setElement(jQuery('<div></div>'));
        this.addClass('peltodata-flyout');
        this.setContent(this.getElement());
        this.update();
    }
    update () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        const element = el[0];
        ReactDOM.render(<FlyoutContent></FlyoutContent>, element);
    }
    cleanUp () {
        const el = this.getElement();
        if (!el) {
            return;
        }
        ReactDOM.unmountComponentAtNode(el.get(0));
    }
}
