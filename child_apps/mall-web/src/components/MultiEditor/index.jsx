import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig } from '@wangeditor/editor'

function MyEditor(props) {
  const [editor, setEditor] = useState(null)

  const toolbarConfig = {}
  const editorConfig = {
    placeholder: '请输入内容...',
  }
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar editor={editor} defaultConfig={toolbarConfig} mode="default" style={{ borderBottom: '1px solid #ccc' }} />
        <Editor
          defaultConfig={editorConfig}
          value={props.value}
          onCreated={setEditor}
          onChange={(editor) => props.onChange(editor.getHtml())}
          mode="default"
          style={{ height: '500px', 'overflow-y': 'hidden' }}
        />
      </div>
    </>
  )
}

export default MyEditor
