import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cloneDeep } from 'lodash'
import { Table, Button } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import InputModal from './InputModal'
import Component_FromItemForSku from './FromItemForSku'
import { calcDescartes, formatSkuFromValues as func_formatSkuFromValues } from './utils'
import styles from './index.less'
import './index_localName.less'
import { IProperty, IInputModal, ISku, IValue } from './types' // 类型
import { ColumnsType } from 'antd/es/table'
export const formatSkuFromValues = func_formatSkuFromValues
export const FromItemForSku = Component_FromItemForSku

interface IProps {
  value?: IValue | undefined
  onChange?: (v: IValue) => void
  columns: ColumnsType<ISku>
  tableData: Array<{ goodsPropertyStr: string }> // 如果从外部传入tableData了 那就把它和组件内tableData按照goodsPropertyStr合并一下
  disabled: boolean
  tableWidth: any
}

function getSkuJsonArrByPropertyArr(propertyArr: IProperty[]) {
  const arr = propertyArr.map((property) => property.children)
  return calcDescartes(arr).map((o: string[] | string) => {
    if (Array.isArray(o)) {
      return o.join(',')
    }
    return o
  })
}

/**
 *
 * @param props
 * @returns
 */
function Index(props: IProps): React.ReactElement<IProps> {
  const { value, onChange, columns = [], tableData = [], disabled = false, tableWidth } = props

  const [tableBoxWidth, setTableBoxWidth] = useState<number>(0)
  const inputModalRef = useRef<IInputModal | null>(null)

  // const [propertyArr, setPropertyArr] = useState<IProperty[]>([]); // 规格名称
  const propertyArr = value?.propertyArr ?? []

  const skuJsonArr: string[] = useMemo(() => getSkuJsonArrByPropertyArr(propertyArr), [propertyArr])

  function emitValue(setArrFunc: (arr: IProperty[]) => IProperty[]) {
    const arr = cloneDeep(propertyArr)
    const newArr = setArrFunc(arr)
    onChange &&
      onChange({
        propertyArr: newArr,
        skuJsonArr: getSkuJsonArrByPropertyArr(newArr),
      })
  }

  // 新增规格名
  async function handleAddPropertyName() {
    const value = (await inputModalRef.current?.open()) as string
    emitValue((arr) => {
      return [...arr, { name: value, children: [] }]
    })
  }

  // 删除规格名
  function handleDeletePropertyName(nameStr: string) {
    emitValue((arr) => {
      return arr.filter((property) => property.name !== nameStr) ?? []
    })
  }

  // 新增规格值
  async function handleAddPropertyValue(index: number) {
    const value = (await inputModalRef.current?.open()) as string
    emitValue((arr) => {
      arr[index].children.push(value)
      return arr
    })
  }

  // 删除规格值
  function handleDeletePropertyValue(propertyNameIndex: number, propertyValue: string) {
    emitValue((arr) => {
      arr[propertyNameIndex].children = arr[propertyNameIndex].children.filter((str) => str !== propertyValue) ?? []
      return arr
    })
  }

  const tableColumns: ColumnsType<ISku> = [{ title: '规格', dataIndex: 'goodsPropertyStr' }, ...columns]

  const showTableData = skuJsonArr.map((str) => {
    let paramTableDataItem = {}
    if (tableData.length > 0) {
      paramTableDataItem = tableData.find((item) => item.goodsPropertyStr == str) ?? {}
    }
    return {
      goodsPropertyStr: str,
      ...paramTableDataItem,
    }
  })

  // table
  const showTableWidth = useMemo(() => {
    if (tableWidth) return tableWidth
    const minColumnWidth = 200
    if (tableBoxWidth / columns.length >= minColumnWidth) {
      return undefined
    } else {
      return columns.length * minColumnWidth
    }
  }, [tableWidth, columns, tableBoxWidth])
  // 记录table wrap 的宽度
  useEffect(() => {
    const tableBoxWidth = document.getElementById('sku_table_id')?.clientWidth
    setTableBoxWidth(tableBoxWidth ?? 0)
  }, [])

  return (
    <div className="custom_sku_input_container">
      {propertyArr.length > 0 && (
        <div className={styles.property_box}>
          {propertyArr.map((property, index) => {
            return (
              <div key={property.name}>
                <div className={styles.propertyName_title}>
                  <div>规格名：{property.name}</div>
                  {!disabled && (
                    <div className={styles.propertyName_btn_wrap}>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                          handleAddPropertyValue(index)
                        }}
                      >
                        新增规格值
                      </Button>
                      <CloseCircleOutlined
                        className={styles.del_icon}
                        onClick={() => {
                          handleDeletePropertyName(property.name)
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.propertyValue_wrap}>
                  {property.children.length > 0 ? (
                    property.children.map((propertyValue) => {
                      return (
                        <div key={propertyValue} className={styles.propertyValue}>
                          <div>{propertyValue}</div>
                          {!disabled && (
                            <CloseCircleOutlined
                              className={styles.del_icon}
                              onClick={() => {
                                handleDeletePropertyValue(index, propertyValue)
                              }}
                              style={{ position: 'relative', top: 1 }}
                            />
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <>{!disabled && <div className={styles.propertyValue_wrap_empty_tip}>请添加规格值</div>}</>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!disabled && (
        <Button type="primary" onClick={handleAddPropertyName} style={{ margin: '10px 0' }}>
          新增规格名
        </Button>
      )}

      <Table
        id="sku_table_id"
        bordered
        size="small"
        rowKey="goodsPropertyStr"
        columns={tableColumns}
        dataSource={showTableData}
        pagination={false}
        scroll={{ x: showTableWidth }}
        style={{ marginTop: 10 }}
      />

      {/* 模态 */}
      <InputModal onRef={(e: any) => (inputModalRef.current = e)} />
    </div>
  )
}
export default Index
