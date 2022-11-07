import { randomStrKey } from '@/utils/utils'

export const defaultItem = () => ({
  id: randomStrKey(),
  type: 'text',
  //常规
  content: '文本',
  goType: undefined,
  goUrl: '',
  //样式
  height: '',
  fontSize: 14,
  color: '#000000',
  fontWeight: 'normal',
  justifyContent: '',
  backgroundColor: 'transparent',
  //2020.12.31
  isIndent: false, //是否缩进
  marginTopBottom: 10,
  marginLeftRight: 10,
})
