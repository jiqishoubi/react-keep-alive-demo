import { connect } from 'dva'

import { Steps, Form, Input, DatePicker, Button, Radio, Row, Checkbox } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import StepsOwn from '@/pages/channel/ChannelTool/components/StepsOwn'
import StepsTwo from '@/pages/channel/ChannelTool/components/StepsTwo'
import { router } from 'umi'

const Minute = (props) => {
  const {
    dispatch,
    channelToolModel: {},
  } = props
  const { Step } = Steps
  const [stepsNumber, setStepsNumber] = useState(0)
  const [activeCode, setActiveCode] = useState()
  const [setting, setSetting] = useState(false)

  const getSettingCode = () => {
    let code = props.history.location.query?.settingCode
    let show = props.history.location.query?.setting
    if (code) {
      setActiveCode(code)
    }
    if (show) {
      setSetting(true)
    }
  }
  useEffect(() => {
    getSettingCode()
  }, [])

  //点击下一步
  const stepsClick = (code) => {
    if (stepsNumber !== 2) {
      setStepsNumber(stepsNumber + 1)
    } else {
      setActiveCode('')
      router.push('/web/company/business/activemgr')
    }
    if (code) {
      setActiveCode(code)
    }
  }
  //返回首页修改
  const stepsCallback = () => {
    setStepsNumber(0)
  }
  //步骤条被点击
  const stepOnChange = (e) => {
    let code = props.history.location.query?.settingCode
    if (code) {
      setStepsNumber(e)
    }
  }

  return (
    <>
      <Steps current={stepsNumber} labelPlacement="vertical" onChange={stepOnChange}>
        <Step title="设置预售规则" />
        <Step title="选择商品" />
        <Step title="设置预售信息" />
      </Steps>
      {stepsNumber === 0 ? <StepsOwn stepsClick={stepsClick} activeCode={activeCode} settingShow={setting} /> : null}

      {stepsNumber === 1 ? <StepsTwo stepsClick={stepsClick} activeCode={activeCode} setting={false} stepsCallback={stepsCallback} settingShow={setting} /> : null}

      {stepsNumber === 2 ? <StepsTwo stepsClick={stepsClick} activeCode={activeCode} setting={true} stepsCallback={stepsCallback} settingShow={setting} /> : null}
    </>
  )
}

export default connect(({ channelToolModel }) => {
  return {
    channelToolModel,
  }
})(Minute)
