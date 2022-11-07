import React, { Component, Fragment } from 'react'
import { Modal, Transfer, Table, message, Spin, Form, Input, Button, Row } from 'antd'
import difference from 'lodash/difference'
import uniqBy from 'lodash/uniqBy'
import ListItem from './ListItem'
import requestw from '@/utils/requestw'
import styles from './index.less'

/**
 * onRef
 *
 * leftColumns
 * rightColumns
 * api
 * getPostDataFunc (searchValues,props)=>
 * searchFormRender  (props)
 *
 * title?
 * gapWidth //左侧比右侧多的px 默认60  number
 * isDisabledFunc    (item)=>boolean
 * maxTargetKeysLength  // 最多选择几条数据 默认false 不限制
 * onOk
 */

const { TextArea } = Input

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,

      //数据
      totalData: [],
      targetKeys: [],

      //表格
      tableData: [],

      //loading
      loading_left_table: false,
      targetRows: [],
    }
    this.searchFormRef = React.createRef()
  }

  /**
   * 周期
   */
  componentDidMount() {
    if (this.props.onRef) this.props.onRef(this)
  }

  /**
   * 方法
   */
  open = () => {
    this.setState(
      {
        visible: true,
      },
      () => {
        this.getLeftData()
      }
    )
  }
  close = () => {
    this.setState({
      visible: false,
      /**
       * 重置
       */
      //数据
      totalData: [],
      targetKeys: [],
      //表格
      tableData: [],
    })
  }

  onChange = (nextTargetKeys) => {
    const { targetKeys } = this.state
    const { maxTargetKeysLength = false } = this.props

    this.setState({ targetKeys: nextTargetKeys })
  }

  delteTarget = (record) => {
    const { targetKeys } = this.state
    const nextTargetKeys = targetKeys.filter((str) => str !== record[this.props.keyStr])
    this.onChange(nextTargetKeys)
    this.getLeftData()
  }

  //左侧表格
  //获取数据
  getLeftData = async () => {
    const { keyStr, api, getPostDataFunc } = this.props

    //searchForm
    const searchValues = (this.searchFormRef && this.searchFormRef.current && this.searchFormRef.current.getFieldsValue()) || {}

    let postData = searchValues
    if (getPostDataFunc) {
      postData = getPostDataFunc(searchValues, this.props)
    }
    this.setState({ loading_left_table: true })
    const res = await requestw({
      url: api,
      data: postData,
    })
    if (!res || res.code != '0') {
      this.setState({ loading_left_table: false })
      message.warning('暂无数据')
      return
    }

    const ress = await requestw({
      url: '/web/staff/group/getSelectedListPaging',
      data: postData,
    })
    let list = res.data.data
    list &&
      list.map((item) => {
        item.isnoDelete = false
      })
    let targetRows = []
    if (!ress || ress.code != '0') {
    } else {
      let targetKeys = ''
      if (!ress.data.data) {
      } else {
        ress.data.data.map((item) => {
          item.isnoDelete = true
          targetKeys += item.personCode + ','
        })
        targetKeys = targetKeys.substr(0, targetKeys.length - 1)
        targetRows = ress.data.data
      }
    }
    //成功
    this.setState({
      loading_left_table: false,
      tableData: uniqBy(list, keyStr),
      targetRows,
      totalData: uniqBy(this.state.totalData.concat(list), keyStr),
    })
  }

  resetSearch = () => {
    this.searchFormRef?.current?.resetFields()
  }
  clickSearch = () => {
    this.getLeftData()
  }

  //关闭弹窗
  modalOk = async () => {
    const { targetKeys, totalData } = this.state
    if (!targetKeys.length) {
      this.close()
      return
    }

    //有值
    if (!this.props.onOk) {
      return
    }

    const targetRows = targetKeys.map((str) => {
      let filterArr = totalData.filter((obj) => obj[this.props.keyStr] == str)
      return filterArr[0] || {}
    })

    const res = await this.props.onOk(targetKeys, targetRows)
    if (!res) return
    setTimeout(() => {
      this.close()
    }, 0)
  }

  /**
   * 渲染
   */
  render() {
    const {
      visible,
      totalData, //总数据
      targetKeys,
      //表格
      tableData,
      //loading
      loading_left_table,
      targetRows,
    } = this.state
    const { keyStr, leftColumns, rightColumns, searchFormRender, title, gapWidth = 60, isDisabledFunc } = this.props

    //表格
    const tableData2 = tableData.map((item) => ({
      ...item,
      disabled: targetKeys.includes(item[keyStr]),
    }))
    //列表
    const listData = totalData && Array.isArray(totalData) ? totalData.filter((item) => targetKeys.includes(item[keyStr])) : []
    const height = 490 //modal height

    /**
     * 渲染
     */
    return (
      <Modal title={title || '选择器'} visible={visible} onCancel={this.close} onOk={this.modalOk} maskClosable={false} destroyOnClose={true} centered width={750}>
        <Form ref={this.searchFormRef} layout="inline" style={{ marginBottom: 20 }}>
          {searchFormRender && (
            <Fragment>
              <Row type="flex" style={{ marginBottom: 0 }}>
                {searchFormRender(this.props)}
              </Row>
              <Row type="flex">
                <Button onClick={this.resetSearch} style={{ marginRight: 10 }}>
                  重置
                </Button>
                <Button type="primary" onClick={this.clickSearch}>
                  搜索
                </Button>
              </Row>
            </Fragment>
          )}
        </Form>

        <div style={{ position: 'relative' }}>
          <Transfer
            titles={[<div className={styles.left_table_header}>查询表格</div>]}
            rowKey={(record) => (record && record.employeeCode ? record.employeeCode : '')}
            // rowKey='employeeCode'
            dataSource={totalData}
            targetKeys={targetKeys}
            onChange={this.onChange}
            // oneWay
            listStyle={({ direction }) => {
              return {
                width: direction == 'left' ? `calc(50% - 25px + ${gapWidth}px)` : `calc(50% - 25px - ${gapWidth}px)`,
                height: height,
                position: 'relative',
                flex: 'none',
              }
            }}
          >
            {({
              direction, //	渲染列表的方向	left | right
              disabled, //	是否禁用列表	boolean
              filteredItems, //	过滤后的数据	TransferItem[]
              selectedKeys: listSelectedKeys, //	选中的条目	string[]
              onItemSelect, //	勾选条目	(key: string, selected: boolean)
              onItemSelectAll, //
            }) => {
              const columns = direction === 'left' ? leftColumns : rightColumns
              const dataSource = direction === 'left' ? tableData2 : targetRows
              //       dataSource={direction == 'left'?tableData2 :targetRows}

              const rowSelection = {
                getCheckboxProps: (item) => {
                  //自己的disabled逻辑写在这里
                  let flag = disabled || item.disabled
                  let myDisabled = false
                  if (isDisabledFunc) {
                    myDisabled = isDisabledFunc(item)
                  }
                  return {
                    disabled: flag || myDisabled,
                  }
                },
                // getCheckboxProps: item => ({ disabled:  item.disabled }),
                // onSelectAll(selected, selectedRows) {
                //   const treeSelectedKeys = selectedRows
                //     .filter(item => !item.disabled)
                //     .map(({ key }) => key);
                //   const diffKeys = selected
                //     ? difference(treeSelectedKeys, listSelectedKeys)
                //     : difference(listSelectedKeys, treeSelectedKeys);
                //   onItemSelectAll(diffKeys, selected);
                // },
                onSelectAll(selected, selectedRows) {
                  const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map((record) => record[keyStr])
                  const diffKeys = selected ? difference(treeSelectedKeys, listSelectedKeys) : difference(listSelectedKeys, treeSelectedKeys)
                  onItemSelectAll(diffKeys, selected)
                },
                onSelect(record, selected) {
                  onItemSelect(record[keyStr], selected)
                },
                // onSelect({ key }, selected) {
                //   onItemSelect(key, selected);
                // },
                selectedRowKeys: listSelectedKeys,
              }

              return (
                // <Table
                //   rowSelection={rowSelection}
                //   columns={columns}
                //   rowKey={keyStr}
                //   dataSource={dataSource}
                //       size="small"
                //   onRow={record => ({
                //     onClick: () => {
                //       let myDisabled = false;
                //       if (isDisabledFunc) {
                //         myDisabled = isDisabledFunc(record);
                //       }
                //       if (record.disabled || myDisabled) return;
                //       onItemSelect(record[keyStr], !listSelectedKeys.includes(record[keyStr]));
                //     },
                //   })}
                // />
                <Table
                  rowKey={keyStr}
                  size="small"
                  columns={columns}
                  // columns={rightColumns|| []}
                  dataSource={dataSource}
                  // dataSource={tableData2}
                  loading={loading_left_table}
                  pagination={{
                    showSizeChanger: true,
                  }}
                  rowSelection={rowSelection}
                  onRow={(record) => {
                    return {
                      onClick: () => {
                        let myDisabled = false
                        if (isDisabledFunc) {
                          myDisabled = isDisabledFunc(record)
                        }
                        if (record.disabled || myDisabled) return
                        // onItemSelect(key, !listSelectedKeys.includes(key));
                        onItemSelect(record[keyStr], !listSelectedKeys.includes(record[keyStr]))
                      },
                    }
                  }}
                  scroll={{
                    scrollToFirstRowOnChange: true,
                    y: height - 145,
                  }}
                />
              )
              // if (direction == 'left') {
              //   const rowSelection = {
              //     getCheckboxProps: item => {
              //       //自己的disabled逻辑写在这里
              //       let flag = disabled || item.disabled;
              //       let myDisabled = false;
              //       if (isDisabledFunc) {
              //         myDisabled = isDisabledFunc(item);
              //       }
              //       return {
              //         disabled: flag || myDisabled,
              //       };
              //     },
              //     onSelectAll(selected, selectedRows) {
              //       const treeSelectedKeys = selectedRows
              //         .filter(item => !item.disabled)
              //         .map(record => record[keyStr]);
              //       const diffKeys = selected
              //         ? difference(treeSelectedKeys, listSelectedKeys)
              //         : difference(listSelectedKeys, treeSelectedKeys);
              //       onItemSelectAll(diffKeys, selected);
              //     },
              //     onSelect(record, selected) {
              //       onItemSelect(record[keyStr], selected);
              //     },
              //     selectedRowKeys: listSelectedKeys,
              //   };

              //   return (
              //     <Table
              //       rowKey={keyStr}
              //       size="small"
              //       columns={direction == 'left'?leftColumns :rightColumns|| []}
              //       dataSource={direction == 'left'?tableData2 :targetRows}
              //       // dataSource={tableData2}
              //       loading={loading_left_table}
              //       pagination={{
              //         showSizeChanger: true,
              //       }}
              //       rowSelection={rowSelection}
              //       onRow={record => {
              //         return {
              //           onClick: () => {
              //             let myDisabled = false;
              //             if (isDisabledFunc) {
              //               myDisabled = isDisabledFunc(record);
              //             }
              //             if (record.disabled || myDisabled) return;
              //             onItemSelect(record[keyStr], !listSelectedKeys.includes(record[keyStr]));
              //           },
              //         };
              //       }}
              //       scroll={{
              //         scrollToFirstRowOnChange: true,
              //         y: height - 145,
              //       }}
              //     />
              //   );
              // } else {
              //   const rowSelection = {
              //     getCheckboxProps: item => {
              //       //自己的disabled逻辑写在这里
              //       // let flag = disabled || item.disabled;
              //       // let myDisabled = false;
              //       // if (isDisabledFunc) {
              //       //   myDisabled = isDisabledFunc(item);
              //       // }
              //       // return {
              //       //   disabled: flag || myDisabled,
              //       // };
              //     },
              //     onSelectAll(selected, selectedRows) {
              //       const treeSelectedKeys = selectedRows
              //         .filter(item => !item.disabled)
              //         .map(record => record[keyStr]);
              //       const diffKeys = selected
              //         ? difference(treeSelectedKeys, listSelectedKeys)
              //         : difference(listSelectedKeys, treeSelectedKeys);
              //       onItemSelectAll(diffKeys, selected);
              //     },
              //     onSelect(record, selected) {
              //       onItemSelect(record[keyStr], selected);
              //     },
              //     selectedRowKeys: listSelectedKeys,
              //   };

              //   return (
              //     <Table
              //       rowKey={keyStr}
              //       size="small"
              //       columns={rightColumns|| []}
              //       dataSource={targetRows}
              //       // dataSource={tableData2}
              //       loading={loading_left_table}
              //       pagination={{
              //         showSizeChanger: true,
              //       }}
              //       rowSelection={rowSelection}
              //       onRow={record => {
              //         return {
              //           onClick: () => {
              //             let myDisabled = false;
              //             if (isDisabledFunc) {
              //               myDisabled = isDisabledFunc(record);
              //             }
              //             if (record.disabled || myDisabled) return;
              //             onItemSelect(key, !listSelectedKeys.includes(key));
              //             onItemSelect(record[keyStr], !listSelectedKeys.includes(record[keyStr]));
              //           },
              //         };
              //       }}
              //       scroll={{
              //         scrollToFirstRowOnChange: true,
              //         y: height - 145,
              //       }}
              //     />
              //   );
              //   // return (
              //   //   <div className={styles.list_wrap} style={{ height: height - 41 }}>
              //   //     {listData &&
              //   //       listData.map(record => (
              //   //         <div key={record[keyStr]}>
              //   //           <ListItem
              //   //             columns={rightColumns}
              //   //             item={record}
              //   //             onDelete={() => {
              //   //               this.delteTarget(record);
              //   //             }}
              //   //           />
              //   //         </div>
              //   //       ))}
              //   //   </div>
              //   // );
              // }
            }}
          </Transfer>
        </div>
      </Modal>
    )
  }
}

export default Index
