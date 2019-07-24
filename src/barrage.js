class Barrage {
  constructor (options) {
    // 检查初始化传入字段
    if (!this._isDom(options.container)) {
      alert('container 字段有误')
      console.warn('container 字段有误')
      return
    }
    
    const data = Object.assign({}, {
      data: [],
      barrageItem: {
        height: 26
      }
    }, options)

    this.container = data.container
    this.data = data.data
    // 弹幕状态映射
    this.itemStatusMap = new Array(this.data.length).fill(true)
    this.itemHeight = data.barrageItem.height
  }

  init () {
    // 初始化弹幕跑道
    this.initLane()
    // 弹幕初始化
    this.initTimer()
  }

  initTimer () {
    if (this.data.length > 0) {
      this.timer = setInterval(() => {
        for (let i = 0; i < this.laneCount; i++) {
          const lane = this.getLane()
          const pointer = this.getOneBarrage()
          if (lane > -1 && pointer > -1) {
            this.laneStatus[lane] = false
            this.initItemDom(pointer, lane)
            this.itemStatusMap[pointer] = false
          }
        }
      }, 1000)
    }
  }

  initItemDom (pointer, lane) {
    const data = this.data[pointer]
    const el = document.createElement('div')
    el.classList.add('barrage')
    const startLeft = this.containerWidth + Math.floor(Math.random() * 30)
    const top = lane * this.itemHeight + lane * this.gap
    el.style = `top: ${top}px; left: ${ startLeft }px; height: ${this.itemHeight}px; border-radius: ${this.itemHeight / 2}px`
    el.innerHTML = `<img class="avatar" src="${data.avatar}" />
      <p class="nickname">${data.nickname}：</p>
      <p class="content">${data.text}</p>`
    this.container.appendChild(el)
    const width = el.offsetWidth
    const animateTime = Math.floor((width + this.containerWidth) / 0.088)
    
    this.animate(el, startLeft, -width, animateTime, () => {
      this.itemStatusMap[pointer] = true
      el.remove()
    })
    
    const inScreenTime = animateTime / (width + this.containerWidth) * width
    setTimeout(() => {
      this.laneStatus[lane] = true
    }, inScreenTime)
  }

  initLane () {
    this.containerWidth = this.container.clientWidth
    this.containerHeight = this.container.clientHeight
    this.laneCount = Math.floor(this.containerHeight / this.itemHeight)
    this.laneStatus = new Array(this.laneCount).fill(true)
    this.gap = Math.floor(this.containerHeight % this.itemHeight / (this.laneCount - 1))
  }

  getLane () {
    let lane = Math.floor(Math.random() * this.laneCount)
    let times = 1
    while (times < this.laneCount) {
      if (this.laneStatus[lane]) {
        return lane
      } else {
        lane === this.laneCount - 1 ? lane = 0 : lane++
        times++
      }
    }
    return -1
  }

  getOneBarrage () {
    return this.itemStatusMap.findIndex(item => item)
  }

  animate (el, start, des, duration, callback) {
    // start 动画初始值
    // des 动画结束值
    // 动画id
    const createTime = () => +new Date()
    const startTime = createTime()

    function tick () {
      const remaining = Math.max(0, startTime + duration - createTime())
      const temp = remaining / duration || 0
      const percent = 1 - temp
      // 最终每次移动的left距离
      const leftPos  = (des - start) * percent + start
      if (1 === percent) {
        window.cancelAnimationFrame(frameId)
        el.style.left = des + 'px'
        callback()
      } else {
        el.style.left = leftPos + 'px'
        window.requestAnimationFrame(tick)
      }
    }

    // 开始执行动画
    const frameId = window.requestAnimationFrame(tick)
  }

  _isDom (el) {
    return el && typeof el === 'object' && el.nodeType === 1 && typeof el.nodeName === 'string'
  }
}

export default Barrage