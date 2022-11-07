import { Card, Form, Input, Row, Col, Radio, Button, Select } from 'antd'
function Index(props) {
  return (
    <Form.Item label={<span></span>} colon={false} {...props}>
      {props.children}
    </Form.Item>
  )
}
export default Index
