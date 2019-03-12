/**
 * Sayakie.com Application 0.1.0
 * Author: Sayakie (Kim Ji Min)
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
  App.VERSION = '0.1.0'

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

      subscribe = (f, l) => {
        this.subscribers.push([f, l])
      }

      unsubscribe = f => {
        const subscribers = this.subscribers.length

        for (let i = 0; i < subscribers; i++) {
          this.subscribers[i][0] === f && this.subscribers.splice(l, 1)
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
        } else {
          App.body.style.cursor = 'none'
          App.RAF.subscribe('raf_cursor', this.render)

          this.updateStat()
          this.attachEvent()
        }
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

        this.cursorEl.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`
        this.cursorStalkerEl.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`
      }
    }

    return new Cursor()
  })()

  return App
})
