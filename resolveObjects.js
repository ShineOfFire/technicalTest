import _indexOf from 'lodash/indexOf'

/**
 * Recursive function build object from object element.
 * @param {object} src
 * @param {object} res
 * @returns {object}
 */
const recursive = src => res => {
  Object.entries(src).map(
    ([k, v]) => {
      if (_indexOf(k, '.') === -1 && !isObject(v)) {
        res[k] = v
      } else if (_indexOf(k, '.') === -1) {
        if(!res[k]) res[k] = {}
        recursive(v)(res[k])
      } else {
        const tab = k.split('.')
        const rest = tab.slice(1, tab.length).join('.')
        if (!res[tab[0]]) res[tab[0]] = {}
        recursive({ [rest]: v })(res[tab[0]])
      }
    })
  return res
};

/**
 * Set src to recursive function.
 * @param {object} src
 * @returns {object}
 */
const resolveObjects = src => recursive(src)({})

/**
 * Simple object check.
 * @param {} item
 * @returns {boolean}
 */
const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

export default resolveObjects
