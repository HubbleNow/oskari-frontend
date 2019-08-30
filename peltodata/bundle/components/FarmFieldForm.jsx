import React from 'react';
import axios from 'axios';
import moment from 'moment';

import Input from 'antd/lib/input';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
const { Option } = Select;
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import DatePicker from 'antd/lib/date-picker';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Upload from 'antd/lib/upload';
import Icon  from 'antd/lib/icon';

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

import './FarmFieldForm.css';

export class FarmFieldForm extends React.Component {
    constructor(props) {
        super(props);
        const localization = Oskari.getLocalization("peltodata");
        this.state = {
            localization,
            date: moment(props.field.sowingDate),
            id: props.field.farmfieldId,
            farmfieldDescription: props.field.id === -1 ? '' : props.field.farmfieldDescription,
            cropType: props.field.cropType,
            dirty: false,
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
        };
        try {
            const response = await axios.post('/peltodata/api/farms', data);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }
    async updateField() {
        console.log(this);
        const data = {
            farmfieldDescription: this.state.farmfieldDescription,
        };
        try {
            const response = await axios.post(`/peltodata/api/farms/${this.state.id}`, data);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
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
                            <Upload accept=".tif">
                                <Button type="primary" style={ { float: 'right' }}>
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
                            <Upload accept=".zip">
                                <Button type="primary" style={ { float: 'right' }}>
                                    <Icon type="upload" />
                                    { this.state.localization.add_yield_data_button }
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </div>
            }
        </div>
    }
    handleSubmit(e) {
        console.log('submit', e);
    }
}
