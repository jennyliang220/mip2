# 组件开发说明

## 内置编译工具

mip-cli 的组件编译模块使用 webpack4 实现，内置了以下 loader：

1. vue-loader: 默认将 `.vue` 文件编译成 `.js`，`<style>` 样式部分启用 scoped，往 `<head>` 动态注入样式，`<template>` 模板部分编译生成 render 函数；

2. babel-loader：默认支持所有 ES6 转 ES5，并支持 async/await 的 ES7 语法。注：由于 babel-polyfill 体积过大，因此默认没有开启，请开发者自行在需要 babel-polyfill 的文件地方自行引入相应的 polyfill 文件；

3. css-loader

4. less-loader：默认支持 `.vue` 单文件组件的 style 标签使用 `lang="less"`；

5. stylus-loader：默认支持 `.vue` 单文件组件的 style 标签使用 `lang="stylus"`；

6. postcss-loader：默认支持 css autoprefixer

7. url-loader：默认支持 `.png|.jpg|.jpeg|.gif` 等图片资源和 `.otf|.ttf|eot|svg|woff|woff2` 等字体文件资源的引用，默认小于 1000b 的资源直接生成 base64 字符串。

## 资源引用

### 资源位置

mip-cli 允许开发者引入 npm 包，通过在项目根目录 `npm install --save [包名]` 安装 npm 包，可在组件代码中通过 `import '[包名]'` 或者是 `require('[包名]')` 的方式引入。同时，对于项目中多个组件公用的资源，可以放在 `common` 文件夹中。

### 后缀省略

在进行资源引用的时候，允许省略的后缀有：`.js`、`.json`、`.vue`。

比如 `/common/utils/index.js` 可以简写为 `/common/utils/index` 或 `/common/utils`；

### 别名

对于样式文件里的本地资源引用建议使用绝对路径，默认提供了 `@` 别名指向工程目录，假设项目目录结构为：

```
test-proj
... components/
....... mip-example/
........... mip-example.vue
... static/
....... mip.png
... mip.config.js
```

那么 mip-example.vue 文件的 style 标签内引用 mip.png 建议写成：

```html
<style scoped>
    .class-name {
        background: url(~@/static/mip.png);
    }
</style>
```

### 异步加载

`mip-cli@1.0.13` 以上版本支持组件异步加载，可通过 `import()` 或 `require.ensure()` 实现，这两个方法返回 Promise 对象，函数的具体说明可以查看 [webpack dynamic import](https://webpack.js.org/guides/code-splitting/#dynamic-imports)，在使用的时候可如下所示：

```javascript
export default {
    async mounted() {
        let etpl = await import('etpl/src/main')
        console.log(etpl.version)
    }
}
```

## 沙盒机制

mip 在组件开发的时候限制使用 `window`、`document` 等对象或函数，在组件构建时，会将组件内使用诸如 `document.createElement()` 会被替换成 `mip.sandbox.document.createElement()`，在运行时会限制原有的能力，或者是直接抛出错误。

详情请阅读 [mip 沙盒机制](../util/sandbox.md) 进行了解。
