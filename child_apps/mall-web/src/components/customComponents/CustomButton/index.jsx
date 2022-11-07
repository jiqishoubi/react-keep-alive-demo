import { useMemo } from 'react'
import { Button } from 'antd'

/**
 *
 * @param {object} props
 * @param {('primary'|'default')} props.type='default'
 * @param {boolean} [props.isHaveBottom=false] 条件筛选里的custom button 需要有一个margin-bottom
 * @returns
 */
function Index(props) {
  const { type = 'default', isHaveBottom, ...restProps } = props
  function handleClick() {
    props.onClick && props.onClick()
  }
  const className = useMemo(() => {
    if (type == 'default') {
      return 'buttonNoSize'
    }
    return ''
  }, [type])
  return (
    <Button className={className} style={{ borderRadius: '4px', marginBottom: isHaveBottom ? 24 : 0 }} type={type} size="middle" {...restProps} onClick={handleClick}>
      {props.children}
    </Button>
  )
}
export default Index
