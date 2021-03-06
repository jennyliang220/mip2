# MIP 2.0 共享数据的使用

关于 MIP 2.0 的数据设置、绑定，请查看 `mip-bind` 章节，本节将介绍关于共享数据的使用与实践。

## 支持多页共享数据

### 背景介绍

在 mip2 的环境里，我们提供整站沉浸式（伪 SPA）的体验，如果要打造复杂的业务场景，页面与页面之间共享数据是必不可少的。因此在 `mip-data` 的实现基础上，MIP2 新增了允许整站共享数据的操作。

**比如这么一个场景：** 某电商平台的购物流程中，到了订单确认页，需要新增收货地址。这时候点击跳转到新增收货地址页面，对收货地址列表(假设为 addressList)进行了一些增删改的操作，再返回到订单确认页时，确认页需要读取 addressList 的内容并加入到订单信息中，那么这时候的 addressList 就是一个页面间需要共享的数据。我们这个章节就是介绍如何设置和使用这个共享数据。


### 概念介绍
在讲解如何设置和使用共享数据之前，我们首先来明晰一些概念

1. 站的概念：

    首次访问 mip2 页面 a.html 后，后续在 a.html 页面通过一定规则打开的其他 mip2 页面（假设为 b.html、c.html 等）都能读取和使用到 a 页面提供的共享数据， 同时b、c 页面也能够持续地丰富共享数据
2. 页面数据：只有当前页面可以访问和使用
3. 共享数据：站内多页面可用
4. 页面可用数据/全局数据：页面数据 + 共享数据

### 提要
1. 通过 `#` 标识共享数据，否则仅为页面独有数据；
2. 通过站内访问路径，逐步构建全站共享数据；
3. MIP 站点内各页面都能通过 `mip-bind` 组件正常绑定共享数据，前提是定义了共享数据的页面已被访问；
4. 使用数据时，优先从页面数据源中查找，找不到再查找共享数据源；
5. 页面间如果存在共享数据字段冲突，将根据打开页面的顺序进行数据覆盖；
6. 下面将以递进的方式提供例子，每一步都以前一步的输出为输入，请留意。


### 设置共享数据

使用 `mip-data` 设置数据时，如果在需要共享的数据前添加 `#` 标识（仅检测数据第一层），该数据将被提升成共享数据， 如：
```html
<!-- a.html -->
<mip-data>
    <script type="application/json">
        {
            "#global": 1,
            "#global2": 2,
            "test": {
                "#info": 3
            },
            "name": "a"
        }
    </script>
</mip-data>
```
此时 a 页面可用的数据源为
```json
{
    "global": 1,
    "global2": 2,
    "test": {
        "#info": 3
    },
    "name": "a"
}
```
此时共享数据源为：
```json
{
    "global": 1,
    "global2": 2
}
```

### 修改共享数据
1. 提升为共享态的数据将在站内每个页面(a、b、c)都能被读取和使用;

    **如果** b 页面使用到了数据 global 而 b 页面自身的数据源中不存在该数据，MIP2 将向上查找共享数据，如：
    ```html
    <!-- b.html -->
    <mip-data>
        <script type="application/json">
            {
                "name": "b",
                "age": 1
            }
        </script>
    </mip-data>
    ```
    此时 b 页面可用的数据源为
    ```json
    {
        "global": 1,
        "global2": 2,
        "name": "b",
        "age": 1
    }
    ```
    此时共享数据源为：
    ```json
    {
        "global": 1,
        "global2": 2
    }
    ```
    
    **如果** c 页面自身的数据源存在与共享数据冲突的字段

	1. 页面自身的数据没有 `#` 标识，即仅为页面数据，将优先读取页面数据，不影响共享数据
    2. 页面自身的数据带有 `#` 标识，将提升为共享数据，覆盖共享数据中同样字段的数据，同时影响其他使用了该共享数据的页面
        ```html
        <!-- c.html -->
        <mip-data>
            <script type="application/json">
                {
                    "#global": 3,
                    "global2": 2333,
                    "name": "c"
                }
            </script>
        </mip-data>
        ```
        此时 c 页面可用的数据源为
        ```json
        {
            "global": 3,
            "global2": 2333,
            "name": "c"
        }
        ```
        此时共享数据源为：
        ```json
        {
            "global": 3,
            "global2": 2
        }
        ```

2. 调用 `MIP.setData` 方法修改数据时
	1. 如果指定必须修改共享数据，则在数据前添加 `#` 标识，如：
        
        在 c 页面调用 `MIP.setData({'#global2': 4})`

        此时 c 页面可用的数据源为
        ```json
        {
            "global": 3,
            "global2": 2333,
            "name": "c"
        }
        ```
        此时共享数据源为(global已被修改)：
        ```json
        {
            "global": 3,
            "global2": 4
        }

	2. 其余情况，MIP2 会自行判断该数据是共享数据还是当前页面的数据
    如果要修改的数据字段既存在于共享数据源也存在于页面数据源，将优先修改页面的数据源
        ① 如：在 c 页面调用 `MIP.setData({'global2': 2444})`

        此时 c 页面可用的数据源为
        ```json
        {
            "global": 3,
            "global2": 2444,
            "name": "c"
        }
        ```
        此时共享数据源不变（因 global2 对 c 页面而言是页面数据，修改不影响共享数据），为：
        ```json
        {
            "global": 3,
            "global2": 4
        }
        ```

        ② 如：在 c 页面调用 `MIP.setData({'name': 'name-c'})`

        此时 c 页面可用的数据源为
        ```json
        {
            "global": 3,
            "global2": 2444,
            "name": "new-c"
        }
        ```
        此时共享数据源不变（同样的，修改的是 c 页面的页面数据）
        <br />

        ③ 如：在 c 页面调用 `MIP.setData({' global': '5'})`

        此时 c 页面可用的数据源为
        ```json
        {
            "global": 5,
            "global2": 2444,
            "name": "new-c"
        }
        ```
        此时共享数据源为：
        ```json
        {
            "global": 5,
            "global2": 4
        }
        ```

### 使用共享数据

#### HTML 页面中使用数据

如 `mip-bind` 章节介绍，在 html 页面中使用数据，可以通过 `m-bind` 或 `m-text` 来绑定数据。

#### 组件内使用数据

**类单向数据流**

**[规范]** 仅允许在 html 页面使用 `m-bind` 来绑定数据，以 `props` 的形式向组件传递数据。组件内部 ***不允许*** 使用 `m-bind` 语法来绑定全局数据，也无法直接读取到全局数据 `m`，仅允许绑定通过 props 获得的数据。
组件内部需要使用 props 预定义所需数据。对于 Object/Array 类型的数据，需要显式指定数据类型。

如果组件内部实现存在自定义标签嵌套的情况，传递数据时 `应` 按照 vue 父子组件的写法来传递数据。

组件内部可以通过调用 `MIP.setData` 来修改全局数据，以此触发重新渲染。

如：

index.html：

```html
<mip-data>
    <script type="application/json">
        {
            "userInfo": {
                "name": "baidu"
            },
            "list": [1, 2, 3],
            "num": 2,
            "msg": "info",
            "loading": false
        }
    </script>
</mip-data>
<mip-a m-bind:userinfo="userInfo"
    m-bind:list="list"
    m-bind:num="num"
    m-bind:msg="msg"
    m-bind:loading="loading"></mip-a>
```

mip-a 组件内部：

```javascript
template: `
    <div>
        <mip-b :userinfo="userinfo"></mip-b>
        <p @click="changeData"></p>
        <p v-if="loading">{{msg}}</p>
    </div>
`,
props: {
    userinfo: {
        type: Object
    },
    list: {
        type: Array
    },
    num: Number,
    loading: Boolean,
    msg: String
},
methods: {
    changeData() {
        MIP.setData({
            userInfo: {
                name: 'baidu2'
            }
        });
    }
}
```

mip-b 组件内部：

```javascript
template: `
    <p>{{userinfo.name}}</p>
`,
props: {
    userinfo: {
        type: Object
    }
}
```