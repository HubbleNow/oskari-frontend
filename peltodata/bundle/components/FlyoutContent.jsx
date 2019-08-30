import React from 'react';
import PropTypes from 'prop-types';

import Collapse from 'antd/lib/collapse';
const { Panel } = Collapse;

import { FarmFieldForm } from './FarmFieldForm';

import 'antd/lib/collapse/style/css';


export class FlyoutContent extends React.Component {
    constructor(props) {
        super(props);
        const localization = Oskari.getLocalization("peltodata");
        this.state = {
            fields: [{
                id: 1,
                description: 'Pelto #1',
                sowingDate: new Date(),
                cropType: 'oat'
            }, {
                id: 2,
                description: 'Pelto #2',
                sowingDate: new Date(),
                cropType: 'wheat'
            }, {
                id: -1,
                description: localization.new_field,
                sowingDate: new Date(),
                cropType: ''
            }]
        };
    }
    render() {
        const fields = [];
        this.state.fields.forEach(field => {
            fields.push(
                <Panel header={ field.description } key={ field.id }>
                    <FarmFieldForm field={ field }></FarmFieldForm>
                </Panel>
            )
        });

        return <div>
            <Collapse>
                { fields }
            </Collapse>
        </div>
    }
}
