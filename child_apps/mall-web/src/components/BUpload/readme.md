## Props

| 属性         | 类型                 | 默认         | 说明                                                   |
| ------------ | -------------------- | ------------ | ------------------------------------------------------ |
| aspect       | `number`             | `1 / 1`      | 裁切区域宽高比，`width / height`                       |
| shape        | `string`             | `'rect'`     | 裁切区域形状，`'rect'` 或 `'round'`                    |
| grid         | `boolean`            | `false`      | 显示裁切区域网格（九宫格）                             |
| quality      | `number`             | `0.4`        | 图片质量，`0 ~ 1`                                      |
| fillColor    | `string`             | `white`      | 当裁切图像小于画布时的填充颜色                         |
| zoom         | `boolean`            | `true`       | 启用图片缩放                                           |
| rotate       | `boolean`            | `false`      | 启用图片旋转                                           |
| minZoom      | `number`             | `1`          | 最小缩放倍数                                           |
| maxZoom      | `number`             | `3`          | 最大缩放倍数                                           |
| modalTitle   | `string`             | `'编辑图片'` | 弹窗标题                                               |
| modalWidth   | `number` \| `string` | `520`        | 弹窗宽度，`px` 的数值或百分比                          |
| modalOk      | `string`             | `'确定'`     | 弹窗确定按钮文字                                       |
| modalCancel  | `string`             | `'取消'`     | 弹窗取消按钮文字                                       |
| beforeCrop   | `function`           | -            | 弹窗打开前调用，若返回 `false`，弹框将不会打开         |
| cropperProps | `object`             | -            | [react-easy-crop] 的 props（\* [已有 props] 无法重写） |

## 更新

### 2022.05.18

支持多选，但是注意，多选和剪裁互斥
