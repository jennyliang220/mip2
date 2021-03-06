import event from '../../util/dom/event'
import {
  createMoreButtonWrapper,
  createPageMask,
  whenTransitionEnds,
  nextFrame
} from '../util/dom'
import css from '../../util/dom/css'

export default class Header {
  constructor (options = {}) {
    this.$wrapper = options.wrapper || document.body
    this.$el = null
    this.data = options.data
    this.clickButtonCallback = options.clickButtonCallback
  }

  init () {
    this.$el = document.createElement('div')
    this.$el.classList.add('mip-appshell-header', 'mip-border', 'mip-border-bottom', 'transition')
    this.$el.innerHTML = this.render(this.data)
    // this.$wrapper.prepend(this.$el)
    // this.$wrapper.classList.add('mip-fixed')
    this.$wrapper.insertBefore(this.$el, this.$wrapper.firstChild)

    // Create mask and wrapper for more button
    if (this.data.xiongzhang ||
      (Array.isArray(this.data.buttonGroup) && this.data.buttonGroup.length > 0)) {
      let {mask, buttonWrapper} = createMoreButtonWrapper({
        buttonGroup: this.data.buttonGroup,
        xiongzhang: this.data.xiongzhang
      })
      this.$buttonMask = mask
      this.$buttonWrapper = buttonWrapper
    }

    // Create mask covering page
    // Mainly used in dialog within iframe
    this.$pageMask = createPageMask()

    this.bindEvents()
  }

  render (data) {
    let {xiongzhang, buttonGroup, showBackIcon, title, logo} = data
    let headerHTML = `
      ${showBackIcon ? `<span class="back-button" mip-header-btn
        data-button-name="back">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><style/></defs><path d="M769.405 977.483a68.544 68.544 0 0 1-98.121 0L254.693 553.679c-27.173-27.568-27.173-72.231 0-99.899L671.185 29.976c13.537-13.734 31.324-20.652 49.109-20.652s35.572 6.917 49.109 20.652c27.173 27.568 27.173 72.331 0 99.899L401.921 503.681l367.482 373.904c27.074 27.568 27.074 72.231 0 99.899z"/></svg>
      </span>` : ''}
      <div class="mip-appshell-header-logo-title">
        ${logo ? `<img class="mip-appshell-header-logo" src="${logo}">` : ''}
        <span class="mip-appshell-header-title">${title}</span>
      </div>
    `

    let moreFlag = xiongzhang || (Array.isArray(buttonGroup) && buttonGroup.length > 0)
    if (window.MIP.standalone) {
      if (moreFlag) {
        // only more
        headerHTML += `
          <div class="mip-appshell-header-button-group-standalone more" mip-header-btn data-button-name="more">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><style/></defs><path d="M227.4 608c-55 0-99.4-42.8-99.4-96 0-53 44.4-96 99.4-96 55.2 0 99.6 43 99.6 96 0 53.2-44.4 96-99.6 96zM512 608c-55 0-99.6-42.8-99.6-96 0-53 44.6-96 99.6-96 55 0 99.4 43 99.4 96 0 53.2-44.4 96-99.4 96zM796.4 608c-55 0-99.6-42.8-99.6-96 0-53 44.4-96 99.6-96 55 0 99.6 43 99.6 96 0 53.2-44.4 96-99.6 96z"/></svg>
          </div>
        `
      }
    } else {
      if (moreFlag) {
        // more & close
        headerHTML += `
          <div class="mip-appshell-header-button-group">
            <div class="button more" mip-header-btn data-button-name="more">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><style/></defs><path d="M227.4 608c-55 0-99.4-42.8-99.4-96 0-53 44.4-96 99.4-96 55.2 0 99.6 43 99.6 96 0 53.2-44.4 96-99.6 96zM512 608c-55 0-99.6-42.8-99.6-96 0-53 44.6-96 99.6-96 55 0 99.4 43 99.4 96 0 53.2-44.4 96-99.4 96zM796.4 608c-55 0-99.6-42.8-99.6-96 0-53 44.4-96 99.6-96 55 0 99.6 43 99.6 96 0 53.2-44.4 96-99.6 96z"/></svg>
            </div>
            <div class="split"></div>
            <div class="button close" mip-header-btn data-button-name="close">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><style/></defs><path d="M579.888 512l190.064-190.064a48 48 0 0 0-67.888-67.872L512 444.112 321.936 254.064a48 48 0 1 0-67.872 67.872L444.112 512 254.064 702.064a48 48 0 1 0 67.872 67.872L512 579.888l190.064 190.064a48 48 0 0 0 67.872-67.888L579.888 512z" fill="#333"/></svg>
            </div>
          </div>
        `
      } else {
        // only close
        headerHTML += `
          <div class="mip-appshell-header-button-group-standalone">
            <div class="button close" mip-header-btn data-button-name="close">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><style/></defs><path d="M579.888 512l190.064-190.064a48 48 0 0 0-67.888-67.872L512 444.112 321.936 254.064a48 48 0 1 0-67.872 67.872L444.112 512 254.064 702.064a48 48 0 1 0 67.872 67.872L512 579.888l190.064 190.064a48 48 0 0 0 67.872-67.888L579.888 512z" fill="#333"/></svg>
            </div>
          </div>
        `
      }
    }

    return headerHTML
  }

  /**
   * Toggle more button wrapper
   *
   * @param {boolean} toggle display or not
   */
  toggleDropdown (toggle) {
    toggleInner(this.$buttonMask, toggle)

    if (toggle) {
      this.$buttonWrapper.classList.add('show')
    } else {
      this.$buttonWrapper.classList.remove('show')
    }
  }

  /**
   * Toggle display of page mask
   * Mainly used to cover header in iframes
   *
   * @param {boolean} toggle display or not
   * @param {Object} options
   * @param {boolean} options.skipTransition show result without transition
   */
  togglePageMask (toggle, {skipTransition} = {}) {
    toggleInner(this.$pageMask, toggle, skipTransition)
  }

  bindEvents () {
    let clickButtonCallback = this.clickButtonCallback
    this.eventHandler = event.delegate(this.$el, '[mip-header-btn]', 'click', function (e) {
      let buttonName = this.dataset.buttonName
      clickButtonCallback(buttonName)
    })

    if (this.$buttonMask) {
      this.$buttonMask.onclick = () => this.toggleDropdown(false)
    }
  }

  unbindEvents () {
    this.eventHandler && this.eventHandler()
  }

  update (data) {
    this.$el.innerHTML = this.render(data)
  }

  toggleTransition (toggle) {
    toggle ? this.$el.classList.add('transition') : this.$el.classList.remove('transition')
  }

  slideUp () {
    this.$el.classList.add('slide-up')
  }

  slideDown () {
    this.$el.classList.remove('slide-up')
  }
}

function toggleInner (element, toggle, skipTransition) {
  if (skipTransition) {
    css(element, 'display', toggle ? 'block' : 'none')
    return
  }

  let direction = toggle ? 'enter' : 'leave'
  element.classList.add(`fade-${direction}`, `fade-${direction}-active`)
  css(element, 'display', 'block')
  // trigger layout
  /* eslint-disable no-unused-expressions */
  element.offsetWidth
  /* eslint-enable no-unused-expressions */

  whenTransitionEnds(element, 'transition', () => {
    element.classList.remove(`fade-${direction}-to`, `fade-${direction}-active`)
    css(element, 'display', toggle ? 'block' : 'none')
  })

  nextFrame(() => {
    element.classList.add(`fade-${direction}-to`)
    element.classList.remove(`fade-${direction}`)
  })
}
