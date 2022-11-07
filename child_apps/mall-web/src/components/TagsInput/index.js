import { useState, useEffect, useRef } from 'react'
import { Input, Tag, Button } from 'antd'
const Index = (props) => {
  const inputref = useRef()
  const [tagList, setTagList] = useState([])

  useEffect(() => {
    setTagList(props?.value?.length > 0 ? props?.value?.split(',') : [])
  }, [props.value])

  const onClose = (i) => {
    const arr = [...tagList]
    arr.splice(i, 1)
    props.onChange(arr.join(','))
  }
  const add = () => {
    let keywords = inputref.current.value
    if (keywords?.length == 0) return
    const arr = [...tagList, keywords]
    props.onChange(arr.join(','))
    inputref.current.value = ''
  }
  return (
    <>
      <div className="fl fr fac" style={{ height: 32, marginBottom: 8 }}>
        {/* { e.preventDefault 会阻止原tag标签定义的事件 转而交给onClose函数操作数据进行渲染 } */}
        {tagList.length > 0 &&
          tagList.map((e, i) => (
            <div>
              <Tag
                key={i}
                closable
                onClose={(e) => {
                  e.preventDefault()
                  onClose(i)
                }}
                value={e}
              >
                {e}
              </Tag>
            </div>
          ))}
        {tagList.length == 0 && '无'}
      </div>
      <div className="ant-form-item-control-input">
        <div className="ant-form-item-control-input-content">
          <span className="ant-input-affix-wrapper">
            <input
              ref={inputref}
              className="ant-input"
              placeholder="请输入小程序热词"
              onKeyDown={({ keyCode }) => {
                keyCode == 13 && add()
              }}
              style={{ border: 0, width: '100%', height: '100%', outline: 'none' }}
            />
          </span>
        </div>
      </div>
      <Button onClick={add} style={{ marginTop: 10, marginRight: 10 }}>
        添加
      </Button>
    </>
  )
}

export default Index
