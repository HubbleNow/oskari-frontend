import React from 'react';
import axios from 'axios';
import moment from 'moment';

import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
const { Option } = Select;
import Popconfirm from 'antd/lib/popconfirm';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import DatePicker from 'antd/lib/date-picker';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Upload from 'antd/lib/upload';
import Icon  from 'antd/lib/icon';
import message from 'antd/lib/message';

import 'antd/lib/form/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/select/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/divider/style/css';
import 'antd/lib/date-picker/style/css';
import 'antd/lib/col/style/css';
import 'antd/lib/row/style/css';
import 'antd/lib/upload/style/css';
import 'antd/lib/icon/style/css';
import 'antd/lib/popconfirm/style/css';
import 'antd/lib/message/style/css';

import './FarmFieldForm.css';

export class FarmFieldForm extends React.Component {
    constructor(props) {
        super(props);
        const localization = Oskari.getLocalization("peltodata");
        this.state = {
            localization,
            date: moment(props.field.farmfieldSowingDate),
            id: props.field.farmfieldId,
            farmfieldDescription: props.field.id === -1 ? '' : props.field.farmfieldDescription,
            cropType: props.field.farmfieldCropType,
            dirty: false,
            onFarmfieldAdded: props.onFarmfieldAdded,
            onFarmfieldSaved: props.onFarmfieldSaved,
            onFarmfieldDeleted: props.onFarmfieldDeleted,
            cropTypes: [{
                value: 'oat',
                text: localization.crop_types.oat,
            }, {
                value: 'wheat',
                text: localization.crop_types.wheat,
            }, {
                value: 'rye',
                text: localization.crop_types.rye,
            }, {
                value: 'barley',
                text: localization.crop_types.barley,
            }]
        };

        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleSowingDateChange = this.handleSowingDateChange.bind(this);
        this.handleCropTypeChange = this.handleCropTypeChange.bind(this);
        this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
        this.handleOnDeleteConfirm = this.handleOnDeleteConfirm.bind(this);
        this.getFileUploadPathForCropEstimation = this.getFileUploadPathForCropEstimation.bind(this);
        this.cropEstimationUploaded = this.cropEstimationUploaded.bind(this);
        this.yieldDataUploaded = this.yieldDataUploaded.bind(this);
        this.getFileUploadPathForYieldData = this.getFileUploadPathForYieldData.bind(this);
    }
    handleDescriptionChange(event) {
        this.setState({ farmfieldDescription: event.target.value, dirty: true });
    }
    handleSowingDateChange(date) {
        this.setState({ date, dirty: true });
    }
    handleCropTypeChange(cropType) {
        this.setState({
            cropType: cropType,
            dirty: true,
        });
    }
    async addNewField() {
        const data = {
            farmfieldDescription: this.state.farmfieldDescription,
            farmfieldSowingDate: this.state.date,
            farmfieldCropType: this.state.cropType,
        };
        try {
            const response = await axios.post('/peltodata/api/farms', data);
            if (this.state.onFarmfieldAdded != null) {
                this.state.onFarmfieldAdded(response.data);
            }

            message.success(this.state.localization.field_added);
        } catch (error) {
            message.error(this.state.localization.errors.failed_to_add_new_field);
            console.log(error);
        }
    }
    async updateField() {
        const data = {
            farmfieldDescription: this.state.farmfieldDescription,
            farmfieldSowingDate: this.state.date,
            farmfieldCropType: this.state.cropType,
        };
        try {
            const response = await axios.post(`/peltodata/api/farms/${this.state.id}`, data);
            if (this.state.onFarmfieldSaved != null) {
                this.state.onFarmfieldSaved(response.data);
            }
            message.success(this.state.localization.field_updated);
        } catch (error) {
            message.error(this.state.localization.errors.failed_to_update_field);
            console.log(error);
        }
    }
    async deleteField() {
        try {
            await axios.delete(`/peltodata/api/farms/${this.state.id}`);
            if (this.state.onFarmfieldDeleted != null) {
                this.state.onFarmfieldDeleted(this.state.id);
            }
            message.success(this.state.localization.field_deleted);
        } catch (error) {
            message.error(this.state.localization.errors.failed_to_delete_field);
            console.log(error);
        }
    }
    handleOnDeleteConfirm() {
        this.deleteField();
    }
    handleSaveButtonClick() {
        if (this.state.id === -1) {
            this.addNewField();
        } else {
            this.updateField();
        }
    }
    getCropTypeOptions() {
        const options = [];
        this.state.cropTypes.forEach(cropType => options.push(<Option key={cropType.value} value={ cropType.value }> {cropType.text }</Option>));
        return options;
    }
    getSaveButtonDescription() {
        if (this.state.id === -1) {
            return this.state.localization.add_new_field;
        } else {
            return this.state.localization.save_field;
        }
    }
    getFileUploadPathForCropEstimation() {
        return `/peltodata/api/farms/${this.state.id}/file?type=crop_estimation_original`
    }
    addCropEstimationLayer(farmfieldId, filePath) {
        return axios.post(`/peltodata/api/farms/${farmfieldId}/layer?filename=${filePath}&type=crop_estimation`)
    }
    addCropEstimationRawLayer(farmfieldId, filePath) {
        return axios.post(`/peltodata/api/farms/${farmfieldId}/layer?filename=${filePath}&type=crop_estimation_raw`)
    }
    async cropEstimationUploaded(e) {
        const file = e.file;
        if (file.status === 'done') {
            const filePath = file.response;
            const farmfieldId = this.state.id;
            try {
                await Promise.all([this.addCropEstimationLayer(farmfieldId, filePath), this.addCropEstimationRawLayer(farmfieldId, filePath)])
                message.success(this.state.localization.layer_creation_started);
            } catch (error) {
                message.error(this.state.localization.errors.failed_to_create_layers);
                console.log(error);
            }
        }
    }
    getFileUploadPathForYieldData() {
        return `/peltodata/api/farms/${this.state.id}/file?type=yield_raw`
    }
    addYieldLayer(farmfieldId, filePath) {
        return axios.post(`/peltodata/api/farms/${farmfieldId}/layer?filename=${filePath}&type=yield`)
    }
    async yieldDataUploaded(e) {
        const file = e.file;
        if (file.status === 'done') {
            const filePath = file.response;
            const farmfieldId = this.state.id;
            try {
                await this.addYieldLayer(farmfieldId, filePath);
                message.success(this.state.localization.yield_layer_creation_started);
            } catch (error) {
                message.error(this.state.localization.errors.failed_to_create_yield_layer);
                console.log(error);
            }
        }
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 16 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const noLabelWrapperCol = {
            xs: { span: 24, offset: 16 },
            sm: { span: 16, offset: 8 },
        };

        const datePickerPopupStyle = {
            'zIndex': 400000,
        };

        return <div>
            <Row>
                <Col span={24}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label={ this.state.localization.field_description } style={{ 'marginBottom': '12px' }}>
                            <Input value={ this.state.farmfieldDescription } onChange={ this.handleDescriptionChange }></Input>
                        </Form.Item>
                        <Form.Item label={ this.state.localization.sowing_date } style={{ 'marginBottom': '12px' }}>
                            <DatePicker popupStyle={datePickerPopupStyle}
                                        onChange={this.handleSowingDateChange} value={this.state.date}></DatePicker>
                        </Form.Item>
                        <Form.Item  label={ this.state.localization.crop_type } style={{ 'marginBottom': '12px' }}>
                            <Select onChange={ this.handleCropTypeChange } dropdownStyle={ datePickerPopupStyle } defaultValue={this.state.cropType}>
                                { this.getCropTypeOptions() }
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={ noLabelWrapperCol } style={{ 'marginBottom': '12px' }}>
                            <Button type="primary" onClick={ this.handleSaveButtonClick } htmlType="button" style={ { float: 'right' }}>
                                <Icon type="save" />
                                { this.getSaveButtonDescription() }
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            { this.state.id !== -1 &&
                <div>
                    <Row>
                        <Divider style={{ margin: 12 }}></Divider>
                    </Row>
                    <Row>
                        <Col span={16}>
                        { this.state.localization.add_drone_data_help }
                        </Col>
                        <Col span={8}>
                            <Upload accept=".tif"
                                    onChange={ this.cropEstimationUploaded }
                                    action={ this.getFileUploadPathForCropEstimation }>
                                <Button type="primary" >
                                    <Icon type="upload" />
                                    { this.state.localization.add_drone_data_button }
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                    <Row>
                        <Divider style={{ margin: 12 }}></Divider>
                    </Row>
                    <Row>
                        <Col span={16}>
                            { this.state.localization.add_yield_data_help }
                        </Col>
                        <Col span={8}>
                            <Upload accept=".zip"
                                    onChange={ this.yieldDataUploaded }
                                    action={ this.getFileUploadPathForYieldData }>
                                <Button type="primary" >
                                    <Icon type="upload" />
                                    { this.state.localization.add_yield_data_button }
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                    <Row>
                        <Divider style={{ margin: 12 }}></Divider>
                    </Row>
                    <Row>
                        <Col span={16}>
                            { this.state.localization.delete_farmfield_help }
                        </Col>
                        <Col span={8}>
                            <Popconfirm
                                title={this.state.localization.confirm_delete_text}
                                onConfirm={this.handleOnDeleteConfirm }
                                okText={this.state.localization.confirm_delete_yes}
                                okType="danger"
                                overlayStyle={ datePickerPopupStyle }
                                cancelText={this.state.localization.confirm_delete_cancel}>
                                <Button type="danger" style={ { float: 'right' }}>
                                    <Icon type="delete" />
                                    { this.state.localization.delete_farmfield_button }
                                </Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                </div>
            }
        </div>
    }
}
