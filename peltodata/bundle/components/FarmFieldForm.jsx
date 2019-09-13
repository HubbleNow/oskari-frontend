import React from 'react';
import axios from 'axios';
import moment from 'moment';

import _ from 'lodash';

import { Input, Form, Select, Popconfirm, Button, Divider, DatePicker, Col, Row, Upload, Icon, message, Modal, Progress, Spin, Card } from 'antd';
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
import 'antd/lib/spin/style/css';
import 'antd/lib/card/style/css';

import './FarmFieldForm.css';

class FieldExecutionStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const execution = this.props.execution;
    return <Row>
        <Col span={24}>
          {execution.state === -10 && <Spin indicator={<Icon type="exclamation-circle" style={{ fontSize: 14, color: '#ffa940', marginRight: '7px' }} />} />}
          {execution.state === 0 && <Spin indicator={<Icon type="loading" style={{ fontSize: 14, marginRight: '7px' }} spin />} />}
          {execution.state === 10 && <Spin indicator={<Icon type="check-circle" style={{ fontSize: 14, marginRight: '7px', color: '#73d13d' }} />} />}
          <span style={{fontSize: '12px', paddingTop: '2px'}}>
            {execution.state === -10 && <strong>{ this.props.localization.in_error_state }! </strong>}{this.props.localization[execution.outputType]} ({this.props.localization.started}: {moment(execution.executionStartedAt).format('HH:mm DD.MM.YY')})
          </span>
        </Col>
      </Row>
  }
}

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
            fieldExecutionsInProgress: [],
            showYieldProgressDialog: false,
            yieldFileProgress: 0,
            yieldProgressDialogAccepted: false,
            yieldUploadCancelled: false,
        };

        this.droneUploadRef = React.createRef();
        this.yieldUploadRef = React.createRef();

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
        this.setFieldExecutionsInProgress = this.setFieldExecutionsInProgress.bind(this);
        this.fieldExecutionsInProgressForType = this.fieldExecutionsInProgressForType.bind(this);
        this.resetYieldProgressDialog = this.resetYieldProgressDialog.bind(this);
        this.handleYieldDialogCancel = this.handleYieldDialogCancel.bind(this);
        this.handleYieldDialogOk = this.handleYieldDialogOk.bind(this);
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
    updateFileDate(farmfieldId, farmfieldFileId, date) {
        const data = {
            date,
        };
        return axios.post(`/peltodata/api/farms/${farmfieldId}/file/${farmfieldFileId}`, data);
    }
    addCropEstimationLayer(farmfieldId, farmfieldFileId) {
        return axios.post(`/peltodata/api/farms/${farmfieldId}/layer?file_id=${farmfieldFileId}&type=crop_estimation`)
    }
    addCropEstimationRawLayer(farmfieldId, farmfieldFileId) {
        return axios.post(`/peltodata/api/farms/${farmfieldId}/layer?file_id=${farmfieldFileId}&type=crop_estimation_raw`)
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
        this.props.triggerFieldExecutionsPolling();
        this.setState({showDroneDateDialog: false});
        const file = this.state.file;
        if (file.status === 'done') {
          const farmfieldFile = file.response;
          const farmfieldId = this.state.id;
          try {
            await this.updateFileDate(farmfieldId, farmfieldFile.id, this.state.date);
            await Promise.all([this.addCropEstimationLayer(farmfieldId, farmfieldFile.id), this.addCropEstimationRawLayer(farmfieldId, farmfieldFile.id)])
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
    addYieldLayer(farmfieldId, farmfieldFileId) {
        return axios.post(`/peltodata/api/farms/${farmfieldId}/layer?file_id=${farmfieldFileId}&type=yield`)
    }
    async yieldDataUploaded(e) {
        if (this.state.yieldUploadCancelled) {
          if (e.file && e.file.status === "uploading") {
            this.yieldUploadRef.current.handleManualRemove(e.file);
            return;
          } else if (e.file && (e.file.status === "done" || e.file.status === "removed")) {
            this.setState({yieldUploadCancelled: false}, () => {
              this.resetYieldProgressDialog();
            });
            return;
          }
          return;
        };

        let showYieldProgressDialog = this.state.showYieldProgressDialog;
        let yieldDataUploaded = this.state.yieldDataUploaded;
        let yieldFileProgress = 0;

        if (this.state.yieldProgressDialogAccepted && yieldDataUploaded) {
          showYieldProgressDialog = false;
        } else {
          showYieldProgressDialog = true;
        }

        if (e.file && e.file.status === "uploading") {
          if (e.event) {
            yieldFileProgress = Math.ceil(e.event.percent);
          }
        }

        if (e.file && e.file.status === "done") {
          yieldFileProgress = 100;
          yieldDataUploaded = true;

          const farmfieldFile = e.file.response;
          const farmfieldId = this.state.id;
          try {
            if (this.state.yieldProgressDialogAccepted) {
              this.resetYieldProgressDialog();
            } else {
              this.setState({
                yieldDataUploaded: yieldDataUploaded,
                yieldFileProgress: yieldFileProgress,
              });
            }
            await this.updateFileDate(farmfieldId, farmfieldFile.id, this.state.date);
            await this.addYieldLayer(farmfieldId, farmfieldFile.id);
            this.props.triggerFieldExecutionsPolling();
            message.success(this.state.localization.yield_layer_creation_started);
          } catch (error) {
            message.error(this.state.localization.errors.failed_to_create_yield_layer);
            console.log(error);
          }
        } else {
          this.setState({
            showYieldProgressDialog: showYieldProgressDialog,
            yieldDataUploaded: yieldDataUploaded,
            yieldFileProgress: yieldFileProgress,
          });
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

    handleYieldDialogOk() {
        if (this.state.yieldDataUploaded) {
          this.resetYieldProgressDialog();
        } else {
          this.setState({yieldProgressDialogAccepted: true});
        }
    }
    handleYieldDialogCancel() {
        this.setState({showYieldProgressDialog: false, yieldUploadCancelled: true});
        this.resetYieldProgressDialog();
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

    resetYieldProgressDialog() {
        this.setState({
          showYieldProgressDialog: false,
          yieldFileProgress: 0,
          yieldProgressDialogAccepted: false,
          yieldUploadCancelled: false,
        });
    }

    componentDidUpdate(prevProps) {
      if (!_.isEqual(prevProps.fieldExecutions, this.props.fieldExecutions)) {
        this.setFieldExecutionsInProgress();
      }
    }

    componentDidMount() {
      this.setFieldExecutionsInProgress();
    }

    setFieldExecutionsInProgress() {
      let fieldExecutionsInProgress = [];
      const now = moment();
      this.props.fieldExecutions.forEach(fe => {
        if (parseInt(fe.state, 10) !== 10) {
          fieldExecutionsInProgress.push(fe);
        } else if (moment(fe.executionStartedAt).isSame(now, 'day')) {
          fieldExecutionsInProgress.push(fe);
        }
      })
      this.setState({ fieldExecutionsInProgress });
    }

    fieldExecutionsInProgressForType(type) {
        return this.state.fieldExecutionsInProgress.findIndex(fe => fe.outputType.includes(type)) > -1;
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
                        <Divider></Divider>
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
                    {this.fieldExecutionsInProgressForType('crop_estimation')  &&
                      <Row>
                        <Col span={24} style={{paddingTop: '15px'}}>
                          <Card bodyStyle={{padding: '6px 10px'}} style={{background: '#e6f7ff', borderColor: '#bae7ff'}}>
                            {this.state.fieldExecutionsInProgress.map(execution => {
                              if (!execution.outputType.includes('crop_estimation')) return;
                              return (
                                <FieldExecutionStatus execution={execution} key={execution.id} localization={this.state.localization} />
                              )
                            })}
                          </Card>
                        </Col>
                      </Row>
                    }
                    <Row>
                        <Divider></Divider>
                    </Row>
                    <Row>
                        <Col span={14}>
                            { this.state.localization.add_yield_data_help }
                        </Col>
                        <Col span={9} offset={1}>
                            <Upload accept=".zip"
                                    ref={this.yieldUploadRef}
                                    showUploadList={false}
                                    onChange={ this.yieldDataUploaded }
                                    action={ this.getFileUploadPathForYieldData }>
                                <Button type="primary" >
                                    <Icon type="upload" />
                                    { this.state.localization.add_yield_data_button }
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                    {this.fieldExecutionsInProgressForType('yield') &&
                    <Row>
                      <Col span={24} style={{paddingTop: '15px'}}>
                        <Card bodyStyle={{padding: '6px 10px'}} style={{background: '#e6f7ff', borderColor: '#bae7ff'}}>
                          {this.state.fieldExecutionsInProgress.map(execution => {
                            if (!execution.outputType.includes('yield')) return;
                            return (
                              <FieldExecutionStatus execution={execution} key={execution.id} localization={this.state.localization} />
                            )
                          })}
                        </Card>
                      </Col>
                    </Row>
                    }
                    <Row>
                        <Divider></Divider>
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

          <Modal
            title={this.state.localization.yield_data_progress_title}
            visible={this.state.showYieldProgressDialog}
            onOk={this.handleYieldDialogOk}
            okText={this.state.yieldProgressDialogAccepted ? this.state.localization.waiting_for_upload_to_be_completed : 'Ok'}
            confirmLoading={ this.state.yieldProgressDialogAccepted }
            onCancel={this.handleYieldDialogCancel}
            cancelText={this.state.localization.cancel}
            closable={false}
            maskClosable={false}
          >
            <div style={{'marginBottom': '18px', 'color': 'rgba(0, 0, 0, 0.85)'}}>
              { this.state.localization.uploading_file }:
              <Progress percent={this.state.yieldFileProgress} status={ this.state.yieldFileProgress < 100 ? 'active' : 'success'} />
            </div>
            <div>
              <p><strong>{ this.state.localization.attention }!</strong> { this.state.localization.yield_data_upload_warning }</p>
            </div>
            <div id="droneDateCalendarContainer" style={{'position': 'absolute' , 'top': '0px', 'left': '0px', 'width': '100%', 'zIndex': '9999999999'}}></div>
          </Modal>
        </div>
    }
}
