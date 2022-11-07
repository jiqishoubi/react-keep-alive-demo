import React, { useEffect } from 'react'
import { Modal, Form, Input, Table } from 'antd'
import { IUseModalController } from '@/hooks/useModalController'
import useTable from '@/hooks/useTable'
import requestw from '@/utils/requestw'
import { message } from 'antd/es'

// 接口继承
interface IProps extends IUseModalController {
  title: string
  columns: any[]
  getDataAjax: () => Promise<{ list: any[]; total: number }>
}

const Index: React.FC<IProps> = (props) => {
  const {
    // modal
    modalProps,
    controller,
    title = '',
    columns,
    getDataAjax,
  } = props
  const [formRef] = Form.useForm()

  const {
    tableId,
    rowKey,
    //表格
    currentPage,
    currentPageSize,
    tableData,
    tableTotalNum,
    isTableLoading,
    //方法
    setCurrentPage,
    setCurrentPageSize,
    getData, //刷新表格 页码不变
    search, //刷新表格 页码变成1
    //columns
    showColumns,
    //table宽度
    tableWidth,
    //批量操作
    selectedRows,
    selectedRowKeys,
    setSelectedRows,
    updateSelectedRows,
  } = useTable({
    columns,
    ajax: getDataAjax,
    manul: true,
  })

  useEffect(() => {
    if (modalProps.visible && controller.payload?.record?.distributeCode) {
      search()
    }
  }, [modalProps.visible, controller.payload])

  return (
    <Modal
      title={title}
      {...modalProps}
      onCancel={() => {
        controller.close()
        formRef.resetFields()
      }}
      onOk={() => controller.close()}
      width={850}
    >
      <Form form={formRef}>{props.children}</Form>

      <Table
        size="small"
        id={tableId}
        rowKey={rowKey}
        columns={showColumns}
        dataSource={tableData}
        loading={isTableLoading}
        pagination={{
          showQuickJumper: true,
          current: currentPage,
          pageSize: currentPageSize,
          total: tableTotalNum,
          showTotal: (total, range) => `当前显示${range[0]}-${range[1]}条 共${total}条`,
        }}
        onChange={({ current, pageSize }) => {
          setCurrentPage(current)
          setCurrentPageSize(pageSize)
        }}
        scroll={{ x: tableWidth }}
      />
    </Modal>
  )
}
export default Index
