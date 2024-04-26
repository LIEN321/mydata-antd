import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Modal, Table, Divider } from 'antd';
import Panel from '../../../components/Panel';
import { DATA_LIST, BIZ_FIELD_LIST, BIZ_DATA_LIST } from '../../../actions/data';
import Grid from '../../../components/Sword/Grid';
import BizData from './BizData';

const FormItem = Form.Item;

@connect(({ data, loading }) => ({
  data,
  loading: loading.models.data,
}))
@Form.create()
class Data extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentData: {},
      currentEnvId: null,
      bizDataModalVisible: false,
    };
  }

  // ============ 查询 ===============
  handleSearch = params => {
    const { dispatch } = this.props;
    dispatch(DATA_LIST(params));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={24}>
          <FormItem label="编号">
            {getFieldDecorator('dataCode')(<Input placeholder="编号" />)}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="名称">
            {getFieldDecorator('dataName')(<Input placeholder="名称" />)}
          </FormItem>
        </Col>
        <Col>
          <div style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={onReset}>
              重置
            </Button>
          </div>
        </Col>
      </Row>
    );
  };

  showBizData = (data, envId) => {
    this.setState({ bizDataModalVisible: true });
    this.setState(() => ({ currentData: data, currentEnvId: envId }));
  };

  closeBizData = () => {
    this.setState({ bizDataModalVisible: false, currentData: {} });
  };

  render() {
    const code = 'data';

    const {
      form,
      data: { data, bizField, bizData },
    } = this.props;

    const { currentData, currentEnvId } = this.state;

    const columns = [
      {
        title: '数据编号',
        dataIndex: 'dataCode',
        width: '200px',
      },
      {
        title: '数据名称',
        dataIndex: 'dataName',
        width: '200px',
      },
      {
        title: '所属项目',
        dataIndex: 'projectName',
        width: '200px',
      },
      {
        title: '数据量',
        render: (text, record) => {
          const { bizDataList } = record;
          if (bizDataList && bizDataList.length > 0) {

            return <>
              {bizDataList[0].envName}: <a onClick={() => { this.showBizData(record, bizDataList[0].envId) }}>{bizDataList[0].dataCount}</a>
              {bizDataList.slice(1).map(bizData => (
                <><Divider type='vertical'/>{bizData.envName}: <a onClick={() => { this.showBizData(record, bizData.envId) }}>{bizData.dataCount}</a></>
              ))}
            </>;
          }
          return <></>;
        },
      },
    ];

    const bizDataColumns = [];
    if (bizField) {
      for (let i = 0; i < bizField.length; i++) {
        const field = bizField[i];
        bizDataColumns.push({
          title: field.fieldName,
          dataIndex: field.fieldCode,
        });
      }
    }
    bizDataColumns.push({
      title: "最后更新时间",
      dataIndex: "_MD_UPDATE_TIME_"
    });

    return (
      <Panel>
        <Grid
          code={code}
          form={form}
          onSearch={this.handleSearch}
          renderSearchForm={this.renderSearchForm}
          columns={columns}
          data={data}
        />
        {/* 业务数据 弹出框 */}
        {this.state.bizDataModalVisible &&
          <BizData
            visible={this.state.bizDataModalVisible}
            onClose={this.closeBizData}
            currentData={currentData}
            envId={currentEnvId}
            projectId={currentData.projectId}
          />
        }
      </Panel>
    );
  }
}
export default Data;
