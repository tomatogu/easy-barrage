class Barrage {
  constructor (options) {
    // 检查初始化传入字段
    if (!this._isDom(options.container)) {
      alert('container 字段有误')
      console.warn('container 字段有误')
      return
    }

    // 检查速度值是否合法
    if (options.speed !== undefined && !this._checkSpeed(options.speed)) {
      alert('speed 字段有误')
      console.warn('spped 字段有误')
      return
    }

    // 检查showAvatar
    if (options.showAvatar !== undefined && typeof options.showAvatar !== 'boolean') {
      alert('showAvatar 字段有误')
      console.warn('showAvatar 字段有误')
      return
    }

    // 检查infinite
    if (options.infinite !== undefined && typeof options.infinite !== 'boolean') {
      alert('infinite 字段有误')
      console.warn('infinite 字段有误')
      return
    }
    
    const data = Object.assign({}, {
      data: [],
      barrageHeight: 26,
      speed: 3,
      showAvatar: false,
      infinite: false
    }, options)

    this.container = data.container
    this.data = data.data
    // 弹幕状态映射
    this.itemStatusMap = new Array(this.data.length).fill(true)
    this.itemHeight = data.barrageHeight
    this.speed = data.speed * 0.0293
    this.showAvatar = data.showAvatar
    this.infinite = data.infinite
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
          // 非无限轮播时，弹幕全部滚动结束的情况
          if (pointer === -1 && !this.infinite) {
            clearInterval(this.timer)
            return
          }

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
    const startLeft = this.containerWidth + Math.floor(Math.random() * 50)
    const top = lane * this.itemHeight + lane * this.gap
    el.style = `top: ${top}px; left: ${ startLeft }px; height: ${this.itemHeight}px; border-radius: ${this.itemHeight / 2}px`
    el.innerHTML = `${this.showAvatar ? '<img class="avatar" src="' + data.avatar + '" />' : ''}
      <p class="content">${data.text}</p>`
    this.container.appendChild(el)
    const width = el.offsetWidth
    const animateTime = Math.ceil((width + startLeft) / this.speed)
    
    this.animate(el, startLeft, -width, animateTime, () => {
      if (this.infinite) {
        this.itemStatusMap[pointer] = true
      }
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
    // 上下弹幕之间的间隙
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

  _checkSpeed (speed) {
    return speed % 1 === 0 && speed >=1 && speed <= 5
  }
}

export default Barrage