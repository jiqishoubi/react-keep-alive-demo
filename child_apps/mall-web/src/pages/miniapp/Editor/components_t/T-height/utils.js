import { randomStrKey } from '@/utils/utils'

export const defaultItem = () => ({
  id: randomStrKey(),
  type: 'height',
  height: 30,
  haveLine: true,
  marginLeftRight: 0,
  paddingLeftRight: 12,
  backgroundColor: 'transparent',
})
