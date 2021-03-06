/**
 * @file helpers.js
 * @author sfe-sy (sfe-sy@baidu.com)
 */

/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
export const camelize = (str) => str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')

/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /([^-])([A-Z])/g
export const hyphenate = str => str
  .replace(hyphenateRE, '$1-$2')
  .replace(hyphenateRE, '$1-$2')
  .toLowerCase()

// Convert an Array - like object to a real Array.
export function toArray (list, start = 0) {
  let i = list.length - start
  const ret = new Array(i)
  while (i--) { // eslint-disable-line no-plusplus
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * object string parser like JSON5
 * Refer to https://github.com/douglascrockford/JSON-js/blob/9139a9f6729f3c1623ca3ff5ccd58dec1523acab/json2.js
 *
 * @param {String} jsonStr Object string
 */
export function parseJSON (jsonStr) {
  jsonStr = jsonStr
    .replace(/(['"]).*?\1/g, item => item.replace(/[/*]/g, s => '\\' + s))
    .replace(/\/\/.*\n?/g, '')
    .replace(/\/\*.*\*\//g, '')

  let rxone = /^[\],:{}\s]*$/
  let rxtwo = /\\(?:["'\\/bfnrt]|u[0-9a-fA-F]{4})/g
  let rxthree = /"[^"\n\r]*"|'[^'\n\r]*'|[+-]?(Infinity|NaN)|([\u2e80-\u9fff]+|[_\w$][_\w\d$]*)\s*:|true|false|null|[+-]?\.?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?([xX][0-9a-fA-F]{1,2})?/g
  let rxfour = /(?:^|:|,)(?:\s*\[)+/g
  let validate = jsonStr
    .replace(rxtwo, '@')
    .replace(rxthree, item => (']' + /:$/.test(item) ? ':' : ''))
    .replace(rxfour, '')

  if (rxone.test(validate)) {
    try {
      /* eslint-disable */
      return eval('(' + jsonStr + ')')
      /* eslint-enable */
    } catch (e) { throw e }
  } else {
    throw new Error(jsonStr + ' Content should be a valid JSON string!')
  }
}
