// CD 唱片 ---------------------------------------------------------------
// 環境變數
const updateFPS = 30
let time = 0
const bgColor = 'rgba(0, 0, 0, 0)'

// 二維向量
class Vec2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  set(x, y) {
    this.x = x
    this.y = y
  }
  move(x, y) {
    this.x += x
    this.y += y
  }
  add(v) {
    return new Vec2(this.x + v.x, this.y + v.y)
  }
  sub(v) {
    return new Vec2(this.x - v.x, this.y - v.y)
  }
  mul(s) {
    return new Vec2(this.x * s, this.y * s)
  }
  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  set length(nv) {
    let temp = this.unit.mul(nv)
    this.set(temp.x, temp.y)
  }
  clone() {
    return new Vec2(this.x, this.y)
  }
  toString() {
    return `(${this.x}, ${this.y})`
  }
  equal(v) {
    return this.x === v.x && this.y === v.y
  }
  get angle() {
    return Math.atan2(this.y, this.x)
  }
  get unit() {
    return this.mul(1 / this.length)
  }
}


const player = document.querySelector('audio')
player.volume = 0.3

// Canvas 初始化
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

// 繪製圓形
ctx.circle = function (v, r) {
  ctx.arc(v.x, v.y, r, 0, Math.PI * 2)
}

// 繪製線條
ctx.line = function (v1, v2) {
  ctx.moveTo(v1.x, v1.y)
  ctx.lineTo(v2.x, v2.y)
}

function initCanvas() {
  ww = canvas.width = 420
  wh = canvas.height = 420
}

initCanvas()

// 建立 CD 類別
class CD {
  constructor(args) {
    let def = {
      r: 200,
      p: new Vec2(0, 0),
      angle: 0,
      angleSpeed: 2,
      dragging: false,
      friction: 0.99,
    }
    Object.assign(def, args)
    Object.assign(this, def)
  }
  draw() {
    ctx.save()
    ctx.rotate(this.angle)
    function circle(p, r, fillColor, strokeColor) { //畫圓形的函數
      ctx.beginPath()
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
      if (fillColor) {
        ctx.fillStyle = fillColor
        ctx.fill()
      }
      if (strokeColor) {
        ctx.strokeStyle = strokeColor
        ctx.stroke()
      }
    }

    ctx.shadowBlur = 100
    ctx.shadowColor = '#fff'
    circle(this.p, this.r, 'black') //中間的黑色大圓
    circle(this.p, 70, '#bac4cc') //中間的圖片底色
    ctx.shadowBlur = 0


    const img = document.querySelector('img')
    ctx.globalCompositeOperation = 'color-burn' //圖層疊合模式
    ctx.drawImage(img, -this.r / 1.5, -this.r / 1.5)
    ctx.globalCompositeOperation = 'source-over'


    ctx.lineWidth = 5
    circle(this.p, 70, null, 'white')
    circle(this.p, 40, 'black')
    circle(this.p, 15, '#bac4cc')
    ctx.lineWidth = 1

    for (let i = 0; i < 40; i++) { //網格，白色線條
      circle(
        this.p,
        (i * this.r) / 40,
        null,
        `rgba(255, 255, 255, ${(i % 5) / 20})`
      )
    }
    for (let i = 0; i < 10; i++) { //旋轉時的速度線
      ctx.beginPath()
      let startAngle = i
      let endAngle = i + Math.PI / 2 * this.angleSpeed * 0.5
      let opacity = Math.abs(this.angleSpeed) * i / 20 + 0.1
      ctx.arc(this.p.x, this.p.y, this.r * i / 10, startAngle, endAngle)

      ctx.lineWidth = 0.5
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.stroke()
    }
    ctx.restore()
  }
  update() {
    this.angle += this.angleSpeed
    this.angleSpeed *= this.friction

  }
}

var cd = null


// 初始化CD
function init() {
  cd = new CD({
    angleSpeed: 0
  })
}

// 更新設定
function update() {
  time++
  cd.update()
  // if (mousePosDown) {
  //   if (!cd.lastAngle) {
  //     cd.lastAngle = cd.angle
  //   }
  //   cd.dragging = true

  //   let delta =
  //     mousePos.sub(new Vec2(ww / 2, wh / 2)).angle -
  //     mousePosDown.sub(new Vec2(ww / 2, wh / 2)).angle
  //   cd.angle = cd.lastAngle + delta
  //   cd.angleSpeed = delta
  // } else {
  //   cd.dragging = false
  //   cd.lastAngle = null
  // }

  // //音樂播放速度控制
  let cur = Math.abs(cd.angleSpeed)
  let volume = Math.sqrt(Math.abs(cd.angleSpeed)) / 3
  if (cur > 0 && cur < 0.1) {
    cur = 0.1
  }
  player.playbackRate = cur
  player.volume = volume
}

// 繪圖設定
function draw() {
  // 清空畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 清空背景
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, ww, wh)

  // ---繪畫區塊---

  ctx.save()
  ctx.translate(ww / 2, wh / 2)
  ctx.beginPath()
  ctx.arc(0, 0, cd.r, 0, Math.PI * 2)
  ctx.clip() //讓圖片只顯示在圓形範圍內
  cd.draw()
  ctx.restore()

  // 繪製陰影
  ctx.save();
  ctx.translate(ww / 2, wh / 2);
  ctx.shadowBlur = 200; // 增加陰影的模糊程度
  ctx.shadowColor = 'rgba(0,0,0,0.5)'; // 增加陰影的顏色的不透明度
  ctx.shadowOffsetX = 20; // 設定陰影的偏移量
  ctx.shadowOffsetY = 20; // 設定陰影的偏移量
  ctx.beginPath();
  ctx.arc(0, 0, cd.r + 1, 0, Math.PI * 2, true); // 繪製一個圓形
  ctx.closePath();
  ctx.strokeStyle = 'transparent'; // 設定圓形的邊緣顏色為透明
  ctx.stroke(); // 繪製圓形的邊緣
  ctx.restore();
  requestAnimationFrame(draw)
}

function loaded() {
  initCanvas()
  init()
  requestAnimationFrame(draw)
  setInterval(update, 1000 / updateFPS)
}

window.addEventListener('load', loaded)
window.addEventListener('resize', initCanvas)

// 滑鼠事件跟紀錄
// const mousePos = new Vec2(0, 0)
// let mousePosDown = null
// let mousePosUp = null

// window.addEventListener('mousemove', mousemove)
// window.addEventListener('mouseup', mouseup)
// window.addEventListener('mousedown', mousedown)

// function mousemove(e) {
//   mousePos.set(e.x, e.y)
// }



// function mouseup(e) {
//   mousePos.set(e.x, e.y)
//   mousePosUp = mousePos.clone()
//   mousePosDown = null
// }

// function mousedown(e) {
//   mousePos.set(e.x, e.y)
//   mousePosDown = mousePos.clone()
//   player.play()
//   cd.friction = 0.99
// }