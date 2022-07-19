/* create a ES6 class */
/**
 * 
 * @param {Function} constructor 
 * @param {Object} staticProperties
 * @param {Function} extendsClass 
 * @returns {Function}
 */
function _defineClass(/* (no use strict demand) className, */constructor, staticProperties, extendsClass) {
  if (typeof constructor !== 'function') throw "constructor MUST be a function"
  let isExtends = typeof extendsClass === 'function'

  /*   (no use strict demand)
    eval(`let ${className}`) // dynamic var name
    eval(`${className} = function (...args) {
      if (isExtends) extendsClass.call(this)
      constructor.call(this, ...args)
    }`) */
  let subClass = function (...args) {
    if (isExtends) extendsClass.call(this, ...args)
    constructor.call(this, ...args)
    if (staticProperties) {
      for (let k in staticProperties)
        subClass.prototype[k] = staticProperties[k]
    }
  }
  function _inherit(subType, superType) {
    let proto = Object.create(superType.prototype)
    proto.constructor = subType
    subType.prototype = proto
  }
  if (isExtends) _inherit(/*(no use strict demand) eval(className) */subClass, extendsClass)
  /*(no use strict demand) return eval(className) */
  return subClass
}

/*****  e.g  ******/
/* 
  I want create a class named Person
*/
/* !! constructor must not be an arrow function */
const Person = _defineClass(
  /* constructor */
  function (name, age) {
    this.name = name
    this.age = age
  },
  /* static properties */
  {
    getName() {
      return this.name
    },
    getAge() {
      return this.age
    }
  }, 
  /* extend */
  null)
let p = new Person("John", 18)

console.log(`My name is ${p.getName()}, my age is ${p.getAge()}`)

const Student = _defineClass(function (name, age, id) {
  this.id = id
}, {
  getId() {
    return this.id
  }
}, Person)
let s = new Student('Alies', 20, '1234567')

console.log(`My name is ${s.getName()}, my age is ${s.getAge()}, my id is ${s.getId()}`)