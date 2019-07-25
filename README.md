# easy-barrage

### **简单实现一个弹幕库**

### **背景**

    将文字内容以弹幕墙的形式展示在页面上，需要无限循环滚动播放。
    在网上查找一番之后找不到满足需求的库，于是自己动手实现。

    tips：该库实现的比较简单，针对特定的需求，需要扩展可以在此基础上自行扩展，或者提出issue，一起学习，共同进步。

### **基本实现原理**

    1、根据每条弹幕高度和弹幕展示区域的高度计算出弹幕的行数（称为跑道） laneCount
    2、定义一个跑道的状态映射 laneStatus 用来表示该跑道当前的状态 空闲（true）or 占用（false）
    3、定义一个数组 data 存储弹幕数据；data 每一个元素是一条弹幕
    4、定义一个弹幕状态的映射 itemStatusMap 用来表示该弹幕当前的状态 正在展示中（true）or 不在展示中（false）
    4、每隔1秒循环一次跑道(laneStatus)，如果有空闲状态的跑道再从弹幕数组(data)中取出一条数据开始渲染，从弹幕展示区域右边进入
    5、在弹幕开始进入弹幕展示区域时，将该跑道状态置为false，在完全进入弹幕展示区域后，将该跑道状态置为true
    6、在弹幕完全滚出弹幕展示区域时，将该弹幕dom节点删除，并将该弹幕状态置为false

### **附上效果**

![](demo/img/barrage-demo.png)

### **使用方法**

  将 src 目录下的 barrage.js 文件复制下来（dist目录下的 barrage.js 为打包后的），通过import方式引入，使用方式如下：

  ```
    import Barrage from '../src/barrage'
    import { barrageData } from './data'

    const el = document.getElementsByClassName('container')[0]

    const barrage = new Barrage({
      container: el, // 必填 弹幕容器
      data: barrageData, // 弹幕数据
      barrageHeight: 26, // 必填 弹幕的高度 单位px
      speed: 3, // 速度参数 可选值为1到5 数值越大速度越快 默认为3
      showAvatar: true, // 是否需要显示头像 默认不显示
      infinite: true // 是否无限循环 默认是
    })

    barrage.init()
  ```

### **本地运行**

    git clone
    npm install
    npm run dev
    浏览器打开 http://0.0.0.0:8080 即可预览