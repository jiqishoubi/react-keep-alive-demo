import { useState, useEffect } from 'react'
import requestw from '@/utils/requestw'
import api_tibao from '@/services/api/tibao'

const useMissionSelect = () => {
  const [missionSelectList, setMissionSelectList] = useState([])
  const [missionSelectedValue, setMissionSelectedValue] = useState(undefined)
  const [loadingMissionSelect, setLoadingMissionSelect] = useState(false)
  // const [formContent, setFormContent] = useState([])

  useEffect(() => {
    try {
      let list = JSON.parse(missionSelectedRecord?.formContent)
    } catch (e) {}
  }, [missionSelectedValue])

  const getMissionSelect = async () => {
    setLoadingMissionSelect(true)
    const res = await requestw({
      url: api_tibao.missionSelectApi,
    })
    setLoadingMissionSelect(false)
    if (res && res.code && res.data && res.data.length) {
      setMissionSelectList(res.data)
    } else {
      setMissionSelectList([])
    }
  }
  const missionSelectedRecord = missionSelectList.filter((obj) => obj.missionCode == missionSelectedValue)[0]
  let formContent = []
  if (missionSelectedRecord) {
    formContent = JSON.parse(missionSelectedRecord?.formContent)
    // setFormContent(list)
  }

  let specs = null
  try {
    specs = missionSelectedRecord && missionSelectedRecord.missionSpecs && JSON.parse(missionSelectedRecord.missionSpecs)
  } catch (e) {}
  return {
    missionSelectList, //下拉框
    getMissionSelect, //获取下拉框
    loadingMissionSelect,
    missionSelectedValue, //选择value
    setMissionSelectedValue,
    missionSelectedRecord, //选择record
    formContent, //完工报告
    // setFormContent,
    specs, //规格
  }
}

export default useMissionSelect
