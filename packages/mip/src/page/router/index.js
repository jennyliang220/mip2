import HTML5History from './history'

export default class Router {
  constructor (options = {}) {
    this.options = options
    this.history = new HTML5History(this)
  }

  init () {
    const history = this.history

    let currentLocation = history.getCurrentLocation()
    history.transitionTo(currentLocation)
  }

  listen (cb) {
    this.history.listen(cb)
  }

  push (location) {
    if (!window.MIP.standalone) {
      this.history.replace(location)
    } else {
      this.history.push(location)
    }
  }

  replace (location) {
    this.history.replace(location)
  }

  go (n) {
    this.history.go(n)
  }

  back () {
    this.go(-1)
  }

  forward () {
    this.go(1)
  }
}
