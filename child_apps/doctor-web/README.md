# 安装 husky pre-commit

```
npx husky add .husky/pre-commit 'npx lint-staged'
```

# tinymce

作为子应用，tinymce 会有问题，因为 init 的时候，组件中又去请求 js 了，请求地址错误  
我修改了`tinymce/tinymce.js`文件，同时把这个文件夹放到了基座应用的 public 里。
