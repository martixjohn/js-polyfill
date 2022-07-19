Function.prototype.bind = function(context) {
  if(!(this instanceof Function)) throw "CANNOT BIND NON FUNCTION"
  return (...args) => {
    this.apply(context, args)
  }
}
