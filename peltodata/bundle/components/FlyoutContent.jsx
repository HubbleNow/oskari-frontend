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
            activePanel: null,
            newFieldTemplate: {
                farmfieldId: -1,
                farmfieldDescription: localization.new_field,
                farmfieldCropType: 'oat',
                farmfieldCropSowingDate: new Date(),
            },
            fields: [],
        };
        this.handleFarmfieldAdded = this.handleFarmfieldAdded.bind(this);
        this.handleFarmfieldSaved = this.handleFarmfieldSaved.bind(this);
        this.handleFarmfieldDeleted = this.handleFarmfieldDeleted.bind(this);
        this.handleActivePanelChange = this.handleActivePanelChange.bind(this);
    }

    handleFarmfieldSaved(farm) {
        const fields = this.state.fields;
        const field = fields.find(f => f.farmfieldId === farm.farmfieldId);
        field.farmfieldDescription = farm.farmfieldDescription;
        field.farmfieldSowingDate = farm.farmfieldSowingDate;
        field.farmfieldCropType = farm.farmfieldCropType;
        this.setState({ fields });
    }
    handleFarmfieldAdded(farm) {
        const fields = this.state.fields;
        const field = fields.find(f => f.farmfieldId === -1);
        field.farmfieldDescription = farm.farmfieldDescription;
        field.farmfieldId = farm.farmfieldId;

        const activePanels = this.state.activePanel;
        const activePanel = activePanels.filter(a => a !== "-1");
        activePanel.push(`${farm.farmfieldId}`);

        this.setState({ fields: []});
        this.loadFields().then(() => {
            this.setState({ activePanel });
        });
    }

    handleActivePanelChange(panels) {
        this.setState({ activePanel: panels });
    }

    handleFarmfieldDeleted() {
        this.loadFields();
    }

    async loadFields() {
        const fields = [];
        try {
            const response = await axios.get("peltodata/api/farms");
            response.data.forEach(d => fields.push(d));
        } catch (error) {
            console.log(error);
        }

        fields.push(Object.assign({}, this.state.newFieldTemplate));
        this.setState({
            fields,
        })
    }

    render() {
        const fields = [];
        this.state.fields.forEach(field => {
            fields.push(
                <Panel header={field.farmfieldDescription} key={field.farmfieldId}>
                    <FarmFieldForm onFarmfieldAdded={this.handleFarmfieldAdded}
                                   onFarmfieldSaved={this.handleFarmfieldSaved}
                                   onFarmfieldDeleted={this.handleFarmfieldDeleted}
                                   field={field}/>
                </Panel>,
            )
        });

        return <div>
            <Collapse activeKey={this.state.activePanel} onChange={this.handleActivePanelChange}>
                {fields}
            </Collapse>
        </div>
    }
}
