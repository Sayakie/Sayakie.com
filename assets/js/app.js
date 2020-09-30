/**
 * Sayakie.com Application 0.2.12
 * Author: Sayakie
 */

// AMD with global, Node, or global
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function() {
      // Also create a global in case some scripts
      // that are loaded still are looking for
      // a global even when an AMD loader is in use.
      return (root.App = factory())
    })
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory()
  } else {
    // Browser globals (root is self)
    root.App = factory()
  }
})(this, function() {
  // Baseline
  const App = {}
  App.VERSION = '0.2.11'

  App.body = document.querySelector('body')
  App.windowWidth = window.innerWidth
  App.windowHeight = window.innerHeight
  App.isMobile =
    is.iphone() ||
    is.ipod() ||
    is.ipad() ||
    is.androidPhone() ||
    is.androidTablet() ||
    is.windowsPhone() ||
    is.windowsTablet() ||
    is.blackberry()

  App.RAF = (() => {
    class RAF {
      constructor() {
        this.subscribers = []

        this._raf = null
        this._framelate = 16
        this._now = Date.now()
        this._dt = 0
        this._lt = this._now
        this._elapsedInterval = 0
      }

      update = () => {
        this._now = Date.now()
        this._dt = this._now - this._lt
        this._elapsedInterval += this._dt

        this._elapsedInterval >= this._framelate && ((this._elapsedInterval = 0), this._processUpdate())

        this._lt = this._now
        this._raf = window.requestAnimationFrame(this.update)
      }

      _processUpdate = () => {
        const subscribers = this.subscribers.length

        for (let i = 0; i < subscribers; i++) {
          const Subscriber = this.subscribers[i]

          Subscriber[1]()
        }
      }

      subscribe = (fn, handler) => {
        this.subscribers.push([fn, handler])
      }

      unsubscribe = fn => {
        const subscribers = this.subscribers.length

        for (let i = 0; i < subscribers; i++) {
          // If identification function name does exist in subscribers,
          // pop and execute cleanup function to unsubscribe that.
          if (this.subscribers[i][0] === fn) {
            // Only runs when cleanup function was provided.
            const cleanup = this.subscribers[i][1]()
            typeof cleanup === 'function' && cleanup()

            // Remove from subscribes
            this.subscribers.splice(i, 1)
          }
        }
      }

      start = () => {
        this._raf = window.requestAnimationFrame(this.update)
      }

      stop = () => {
        window.cancelAnimationFrame(this._raf)
      }

      resume = this.start
    }

    return new RAF()
  })()

  App.Extender = (() => {
    class Extender {
      constructor() {
        this.eachNodes = []
      }

      addClass(className) {
        this.eachNodes.forEach(node => {
          node.classList.add(className)
        })
      }

      removeClass(className) {
        this.eachNodes.forEach(node => {
          node.classList.remove(className)
        })
      }

      toggleClass(className) {
        this.eachNodes.forEach(node => {
          node.classList.toggle(className)
        })
      }
    }

    return Extender
  })()

  App.Cursor = (() => {
    class Cursor extends App.Extender {
      constructor() {
        super()

        this.cursorEl = document.querySelector('#Cursor')
        this.cursorStalkerEl = document.querySelector('#Cursor-Stalker')
        this.eachNodes = [this.cursorEl, this.cursorStalkerEl]

        this.mouseX = 0
        this.mouseY = 0
        this.cursorXOffset = 0
        this.cursorYOffset = 0

        if (App.isMobile) {
          this.addClass('hide')
        }

        App.body.style.cursor = 'none'
        App.RAF.subscribe('raf_cursor', this.render)

        this.updateStat()
        this.attachEvent()
      }

      handleMouseMove = event => {
        App.body.style.cursor = 'none'

        this.mouseX = event.clientX
        this.mouseY = event.clientY
      }

      updateStat = () => {
        this.cursorXOffset = this.cursorEl.offsetWidth / 2
        this.cursorYOffset = this.cursorEl.offsetHeight / 2
      }

      attachEvent = () => {
        document.addEventListener('mousemove', this.handleMouseMove)
        window.addEventListener('resize', this.updateStat, false)
      }

      render = () => {
        const cursorX = this.mouseX - this.cursorXOffset
        const cursorY = this.mouseY - this.cursorYOffset

        this.eachNodes.forEach(node => {
          node.style.display = 'block'
          node.style.transform =  `translate3d(${cursorX}px, ${cursorY}px, 0px)`
        })
        
        return () => this.eachNodes.forEach(node => {
          node.style.display = 'none'
        })
      }
    }

    return new Cursor()
  })()

  App.CountDischargeDate = (() => {
    class CountDischargeDate {
      constructor() {
        this.selector = document.querySelector('#DischargeDate-Viewer')
        this.dischargeDate = new Date('2021/06/26')
        this._second = 1000
        this._minute = this._second * 60
        this._hour = this._minute * 60
        this._day = this._hour * 24
        this.preventChanceOnce = false

        App.RAF.subscribe('raf_count', this.render)
      }

      render = () => {
        const remainDateTimestamp = this.dischargeDate - new Date()

        if (remainDateTimestamp < 0 && !this.preventChanceOnce) {
          this.preventChanceOnce = !0
          App.RAF.unsubscribe('raf_count')
        }

        const remainDays = Math.floor(remainDateTimestamp / this._day)
        const remainHours = String(Math.floor((remainDateTimestamp % this._day) / this._hour)).padStart(2, 0)
        const remainMinutes = String(Math.floor((remainDateTimestamp % this._hour) / this._minute)).padStart(2, 0)
        const remainSeconds = String(Math.floor((remainDateTimestamp % this._minute) / this._second)).padStart(2, 0)

        const text = `전역까지 ${remainDays}일 ${remainHours}시간 ${remainMinutes}분 ${remainSeconds}초 남음!`
        if (this.selector.innerText !== text)
            this.selector.innerText = text

        return () => this.selector.innerText = '축하해주세요! 전역했습니다 :)'
      }
    }

    return new CountDischargeDate()
  })()

  App.CountDischargeDate2 = (() => {
    class CountDischargeDate2 {
      constructor() {
        this.selector = document.querySelector('#DischargeDate-Viewer-2')
        this.dischargeDate = new Date('2021/01/07')
        this._second = 1000
        this._minute = this._second * 60
        this._hour = this._minute * 60
        this._day = this._hour * 24
        this.preventChanceOnce = false

        App.RAF.subscribe('raf_count2', this.render)
      }

      render = () => {
        const remainDateTimestamp = this.dischargeDate - new Date()

        if (remainDateTimestamp < 0 && !this.preventChanceOnce) {
          this.preventChanceOnce = !0
          App.RAF.unsubscribe('raf_count')
        }

        const remainDays = Math.floor(remainDateTimestamp / this._day)
        const remainHours = String(Math.floor((remainDateTimestamp % this._day) / this._hour)).padStart(2, 0)
        const remainMinutes = String(Math.floor((remainDateTimestamp % this._hour) / this._minute)).padStart(2, 0)
        const remainSeconds = String(Math.floor((remainDateTimestamp % this._minute) / this._second)).padStart(2, 0)

        const text = `전역까지 ${remainDays}일 ${remainHours}시간 ${remainMinutes}분 ${remainSeconds}초 남음!`
        if (this.selector.innerText !== text)
            this.selector.innerText = text

        return () => this.selector.innerText = '축하해주세요! 전역했습니다 :)'
      }
    }

    return new CountDischargeDate2()
  })()


  return App
})
