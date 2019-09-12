import React from 'react';
import axios from 'axios';
import moment from 'moment';

import { Input, Form, Select, Popconfirm, Button, Divider, DatePicker, Col, Row, Upload, Icon, message, Modal, Progress } from 'antd';
const { Option } = Select;

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
import 'antd/lib/modal/style/css';

import './FarmFieldForm.css';

export class FarmFieldForm extends React.Component {
    constructor(props) {
        super(props);
        const localization = Oskari.getLocalization("peltodata");
        this.state = {
            localization,
            date: moment(props.field.farmfieldSowingDate),
            id: props.field.farmfieldId,
            farmfieldIdString: props.field.farmfieldIdString,
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
            }],
            showDroneDateDialog: false,
            file: false,
            droneFileProgress: 0,
            droneFileUploaded: false,
            droneDate: null,
            droneDateDialogAccepted: false,
            droneFileUploadCancelled: false,
        };

        this.droneUploadRef = React.createRef();

        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleIdStringChange = this.handleIdStringChange.bind(this);
        this.handleSowingDateChange = this.handleSowingDateChange.bind(this);
        this.handleCropTypeChange = this.handleCropTypeChange.bind(this);
        this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
        this.handleOnDeleteConfirm = this.handleOnDeleteConfirm.bind(this);
        this.getFileUploadPathForCropEstimation = this.getFileUploadPathForCropEstimation.bind(this);
        this.cropEstimationBeingUploaded = this.cropEstimationBeingUploaded.bind(this);
        this.yieldDataUploaded = this.yieldDataUploaded.bind(this);
        this.getFileUploadPathForYieldData = this.getFileUploadPathForYieldData.bind(this);
        this.handleDroneDateOk = this.handleDroneDateOk.bind(this);
        this.handleDroneDateCancel = this.handleDroneDateCancel.bind(this);
        this.startProcessingCropEstimation = this.startProcessingCropEstimation.bind(this);
        this.handleDroneDateChange = this.handleDroneDateChange.bind(this);
        this.resetDroneDateDialog = this.resetDroneDateDialog.bind(this);
    }
    handleDescriptionChange(event) {
        this.setState({ farmfieldDescription: event.target.value, dirty: true });
    }
    handleIdStringChange(event) {
        this.setState({ farmfieldIdString: event.target.value, dirty: true });
    }
    handleSowingDateChange(date) {
        this.setState({ date, dirty: true });
    }
    handleDroneDateChange(droneDate) {
        this.setState({ droneDate });
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
            farmfieldId: this.state.farmfieldIdString,
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
            farmfieldId: this.state.farmfieldIdString,
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
    cropEstimationBeingUploaded(e) {
        if (this.state.droneFileUploadCancelled) {
            if (e.file && e.file.status === "uploading") {
                this.droneUploadRef.current.handleManualRemove(e.file);
                return;
            } else if (e.file && (e.file.status === "done" || e.file.status === "removed")) {
                this.setState({droneFileUploadCancelled: false}, () => {
                 this.resetDroneDateDialog();
                });
                return;
            }
            return;
        };

        let showDroneDateDialog = this.state.showDroneDateDialog;
        let droneFileUploaded = this.state.droneFileUploaded;
        let droneFileProgress = 0;
        let file = false;

        if (!showDroneDateDialog && !droneFileUploaded) {
          showDroneDateDialog = true;
        }

        if (e.file && e.file.status === "uploading") {
          if (e.event) {
            droneFileProgress = Math.ceil(e.event.percent);
          }
        }
        if (e.file && e.file.status === "done") {
          droneFileProgress = 100;
          droneFileUploaded = true;
          file = e.file;
        }

        this.setState({
          showDroneDateDialog: showDroneDateDialog,
          droneFileUploaded: droneFileUploaded,
          droneFileProgress: droneFileProgress,
          file: file,
        });

        if (this.state.droneDateDialogAccepted && droneFileUploaded && this.state.droneDate) {
          this.startProcessingCropEstimation();
        }
    }
    async startProcessingCropEstimation() {
        this.setState({showDroneDateDialog: false});
        const file = this.state.file;
        if (file.status === 'done') {
          const filePath = file.response;
          const farmfieldId = this.state.id;
          try {
            await Promise.all([this.addCropEstimationLayer(farmfieldId, filePath), this.addCropEstimationRawLayer(farmfieldId, filePath)])
            this.resetDroneDateDialog();
            message.success(this.state.localization.layer_creation_started);
          } catch (error) {
            this.resetDroneDateDialog();
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
    async yieldDataUploaded() {
        const file = this.file;
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
    handleDroneDateOk() {
        if (this.state.droneFileUploaded && this.state.droneDate) {
          this.startProcessingCropEstimation();
        } else {
          this.setState({droneDateDialogAccepted: true});
        }
    }
    handleDroneDateCancel() {
        this.setState({showDroneDateDialog: false, droneFileUploadCancelled: true});
        this.resetDroneDateDialog();
    }
    resetDroneDateDialog() {
      this.setState({
        file: false,
        droneFileProgress: 0,
        droneFileUploaded: false,
        droneDate: null,
        droneDateDialogAccepted: false,
      });
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
                        <Form.Item label={ this.state.localization.field_id } style={{ 'marginBottom': '12px' }}>
                            <Input value={ this.state.farmfieldIdString } onChange={ this.handleIdStringChange }></Input>
                        </Form.Item>
                        <Form.Item label={ this.state.localization.sowing_date } style={{ 'marginBottom': '12px' }}>
                            <DatePicker popupStyle={datePickerPopupStyle}
                                        placeholder={ this.state.localization.select_date }
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
                        <Col span={14}>
                        { this.state.localization.add_drone_data_help }
                        </Col>
                        <Col span={9} offset={1}>
                            <Upload accept=".tif"
                                    ref={this.droneUploadRef}
                                    showUploadList={false}
                                    onChange={ this.cropEstimationBeingUploaded }
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
                        <Col span={14}>
                            { this.state.localization.add_yield_data_help }
                        </Col>
                        <Col span={9} offset={1}>
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
          <Modal
            title={this.state.localization.add_drone_date_title}
            visible={this.state.showDroneDateDialog}
            onOk={this.handleDroneDateOk}
            okText={this.state.droneDateDialogAccepted ? this.state.localization.waiting_for_upload_to_be_completed : this.state.localization.start_processing_drone_image}
            okButtonProps={{ disabled: (this.state.droneDate === null) }}
            confirmLoading={ this.state.droneDateDialogAccepted }
            onCancel={this.handleDroneDateCancel}
            cancelText={this.state.localization.cancel}
            closable={false}
            maskClosable={false}
          >
            <Form>
              <Form.Item style={{ 'marginBottom': '12px' }}>
                <DatePicker popupStyle={datePickerPopupStyle}
                            placeholder={ this.state.localization.select_date }
                            getCalendarContainer={() => { return document.getElementById('droneDateCalendarContainer') }}
                            onChange={this.handleDroneDateChange} value={this.state.droneDate}/>
              </Form.Item>
            </Form>
            <div style={{'marginTop': '18px', 'marginBottom': '18px', 'color': 'rgba(0, 0, 0, 0.85)'}}>
              { this.state.localization.uploading_image }:
              <Progress percent={this.state.droneFileProgress} status={ this.state.droneFileProgress < 100 ? 'active' : 'success'} />
            </div>
            <div>
              <p>{ this.state.localization.drone_date_help }</p>
              <p><strong>{ this.state.localization.attention }!</strong> { this.state.localization.drone_date_warning }</p>
            </div>
            <div id="droneDateCalendarContainer" style={{'position': 'absolute' , 'top': '0px', 'left': '0px', 'width': '100%', 'zIndex': '9999999999'}}></div>
          </Modal>
        </div>
    }
}
