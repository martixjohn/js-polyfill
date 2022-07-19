function _defineClass(className, constructor, extendsClass) {
  let isExtends = typeof extendsClass === 'function'
  if (typeof constructor !== 'function') throw "constructor MUST be a function"
  eval(`let ${className}`) // dynamic var name
  eval(`${className} = function (...args) {
    if (isExtends) extendsClass.call(this)
    constructor.call(this, ...args)
  }`)
  function _inherit(subType, superType) {
    let proto = Object.create(superType.prototype)
    proto.constructor = subType
    subType.prototype = proto
  }
  if (isExtends) _inherit(eval(className), extendsClass)
  return eval(className)
}