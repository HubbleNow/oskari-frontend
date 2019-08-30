import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Collapse from 'antd/lib/collapse';
const { Panel } = Collapse;

import { FarmFieldForm } from './FarmFieldForm';

import 'antd/lib/collapse/style/css';


export class FlyoutContent extends React.Component {
    constructor(props) {
        super(props);
        const localization = Oskari.getLocalization("peltodata");

        this.loadFields();

        this.state = {
            newFieldTemplate: {
                id: -1,
                farmfieldDescription: localization.new_field,
                sowingDate: new Date(),
                cropType: ''
            },
            fields: []
        };
    }
    async loadFields() {
        const fields = [];
        try {
            const response = await axios.get("peltodata/api/farms");
            response.data.forEach(d => fields.push(d));
        } catch (error) {
            console.log(error);
        }

        fields.push(this.state.newFieldTemplate);
        this.setState({
            fields,
        })
    }
    render() {
        const fields = [];
        this.state.fields.forEach(field => {
            fields.push(
                <Panel header={ field.farmfieldDescription } key={ field.farmfieldId }>
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
