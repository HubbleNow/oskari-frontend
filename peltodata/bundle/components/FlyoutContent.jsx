import React from 'react';
import axios from 'axios';

import Collapse from 'antd/lib/collapse';

const { Panel } = Collapse;

import { FarmFieldForm } from './FarmFieldForm';

import 'antd/lib/collapse/style/css';

export class FlyoutContent extends React.Component {
    constructor(props) {
        super(props);
        const localization = Oskari.getLocalization("peltodata");

        this.state = {
            activePanel: null,
            newFieldTemplate: {
                farmfieldId: -1,
                farmfieldDescription: localization.new_field,
                farmfieldCropType: 'oat',
                farmfieldCropSowingDate: new Date(),
            },
            fields: [],
            fieldExecutions: [],
            shouldFieldExecutionsBePolled: false,
        };

        this.handleFarmfieldAdded = this.handleFarmfieldAdded.bind(this);
        this.handleFarmfieldSaved = this.handleFarmfieldSaved.bind(this);
        this.handleFarmfieldDeleted = this.handleFarmfieldDeleted.bind(this);
        this.handleActivePanelChange = this.handleActivePanelChange.bind(this);
        this.triggerFieldExecutionsPolling = this.triggerFieldExecutionsPolling.bind(this);
    }

    componentDidMount() {
      this.loadFields();
      this.loadExecutions();
    }

    handleFarmfieldSaved(farm) {
        const fields = this.state.fields;
        const field = fields.find(f => f.farmfieldId === farm.farmfieldId);
        field.farmfieldDescription = farm.farmfieldDescription;
        field.farmfieldIdString = farm.farmfieldIdString;
        field.farmfieldSowingDate = farm.farmfieldSowingDate;
        field.farmfieldCropType = farm.farmfieldCropType;
        this.setState({ fields });
    }
    handleFarmfieldAdded(farm) {
        const fields = this.state.fields;
        const field = fields.find(f => f.farmfieldId === -1);
        field.farmfieldDescription = farm.farmfieldDescription;
        field.farmfieldIdString = farm.farmfieldIdString;
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

    componentDidUpdate(prevProps, prevState) {
      if (prevState.shouldFieldExecutionsBePolled !== this.state.shouldFieldExecutionsBePolled) {
        if (this.state.shouldFieldExecutionsBePolled) {
          this.pollExecutions();
        }
      }
    }

    pollExecutions() {
      setTimeout(() => {
        this.loadExecutions()
          .then(() => {
            if (this.state.shouldFieldExecutionsBePolled) this.pollExecutions();
          })
      }, 5000);
    }

    triggerFieldExecutionsPolling() {
      if (!this.state.shouldFieldExecutionsBePolled) {
        this.loadExecutions();
      }
    }

    async loadExecutions() {
        const fieldExecutions = [];
        try {
            const response = await axios.get("peltodata/api/farms/executions");
            response.data.forEach(d => fieldExecutions.push(d));
        } catch (error) {
            console.log(error);
        }

        const shouldFieldExecutionsBePolled = fieldExecutions.findIndex(fe => fe.state === -10 || fe.state === 0) > -1;

        this.setState({ fieldExecutions, shouldFieldExecutionsBePolled });
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

    getFieldExecutions(farmfieldId) {
        return this.state.fieldExecutions.filter(fe => fe.farmfieldId === farmfieldId);
    }

    render() {
        const fields = [];
        this.state.fields.forEach(field => {
            fields.push(
                <Panel header={field.farmfieldDescription} key={field.farmfieldId}>
                    <FarmFieldForm onFarmfieldAdded={this.handleFarmfieldAdded}
                                   onFarmfieldSaved={this.handleFarmfieldSaved}
                                   onFarmfieldDeleted={this.handleFarmfieldDeleted}
                                   fieldExecutions={this.getFieldExecutions(field.farmfieldId)}
                                   triggerFieldExecutionsPolling={this.triggerFieldExecutionsPolling}
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
