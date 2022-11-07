// 物流面单打印页面

import React, { useEffect, useState } from 'react'
import { router } from 'umi'
import { batchGetExpressOrder } from '@/services/order'

const mianDanList = [
  'https://cdn.s.bld365.com/test/shangyao/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201221192601.jpg',
  // 'https://cdn.s.bld365.com/test/shangyao/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_202012211534511.png',
  // 'https://filedown.bld365.com/bld_mall/image/ExpressOrder/20201221/IMG2020122120bc4200058.jpg',
  // 'https://cdn.s.bld365.com/test/shangyao/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201221153451.png',
  // 'https://filedown.bld365.com/bld_mall/image/ExpressOrder/20201221/IMG20201221e9f6f700059.jpg',
  // 'https://filedown.bld365.com/bld_mall/image/ExpressOrder/20201221/IMG2020122113d7ee00064.jpg',
  // 'https://filedown.bld365.com/bld_mall/image/ExpressOrder/20201221/IMG20201221f5118200066.jpg',
  // 'https://filedown.bld365.com/bld_mall/image/ExpressOrder/20201221/IMG202012218b456100067.jpg',
]

function BldPage(props) {
  const [expressList, setexpressList] = useState([])
  const [batchExportLoading, setbatchExportLoading] = useState(false)

  useEffect(() => {
    // getLoadImageFinished(mianDanList);
    let urls = sessionStorage.getItem('expressExportSessionKey') || ''
    urls && batchFunc(urls)
  }, [])

  function batchFunc(tradeNoList) {
    setbatchExportLoading(true)
    batchGetExpressOrder({
      tradeNoList,
    }).then((res) => {
      if (res && res.code === '0') {
        let urls = res.data || []
        setexpressList(urls || [])
        getLoadImageFinished(urls)
      }
    })
  }

  function getLoadImageFinished(urls) {
    let parent = document.getElementById('printImgBox')
    let arr = []
    urls.forEach((url) => {
      arr.push(
        new Promise((resolve, reject) => {
          let img = new Image()
          img.src = url
          img.style = 'width: 400px;margin: 10px'
          img.onload = (e) => {
            resolve(img)
            parent.appendChild(img)
          }
        })
      )
    })
    Promise.all(arr).then((res) => {
      setbatchExportLoading(false)
      window.print()
    })
  }

  return (
    <div
      id="printImgBox"
      style={{
        width: '420px',
        margin: '0 auto',
      }}
    ></div>
  )
}

export default BldPage
