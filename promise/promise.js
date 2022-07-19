// You can use microtask that recommended
const { nextTick } = require("process")
const setTimeout = nextTick
class myPromise {
  static PENDING = Symbol.for('pending')
  static FULFILLED = Symbol.for('fulfilled')
  static REJECTED = Symbol.for('rejected')

  constructor(executor) {
    this.promiseState = myPromise.PENDING
    this.promiseResult = undefined
    this.promiseCallbacks = []

    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (err) {
      this.reject(err)
    }
  }
  resolve(result) {
    if (this.promiseState === myPromise.PENDING) {
      setTimeout(() => {
        this.promiseState = myPromise.FULFILLED
        this.promiseResult = result
        this.promiseCallbacks.forEach(cbs => {
          cbs.onFulfilled()
        })
      })
    }

  }
  reject(reason) {
    if (this.promiseState === myPromise.PENDING) {
      setTimeout(() => {
        this.promiseState = myPromise.REJECTED
        this.promiseResult = reason
        this.promiseCallbacks.forEach(cbs => {
          cbs.onRejected()
        })
      })
    }

  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected =
      typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    let promise2 = new myPromise((resolve, reject) => {
      if (this.promiseState === myPromise.FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.promiseResult)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      } else if (this.promiseState === myPromise.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.promiseResult)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      } else if (this.promiseState === myPromise.PENDING) {
        this.promiseCallbacks.push({
          onFulfilled: () => {
            try {
              let x = onFulfilled(this.promiseResult)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          },
          onRejected: () => {
            try {
              let x = onRejected(this.promiseResult)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          },
        })
      }
    })

    return promise2
  }

}
/**
   * 
   * @param {myPromise} promise2 
   * @param { any } x 
   * @param { Function } resolve 
   * @param { Function } reject 
   */
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  if (x instanceof myPromise) {
    if (x.promiseState === myPromise.PENDING) {
      x.then(y => {
        resolvePromise(promise2, y, resolve, reject)
      }, reject)
    } else if (x.promiseState === myPromise.FULFILLED) {
      resolve(x.promiseResult)
    } else if (x.promiseState === myPromise.REJECTED) {
      reject(x.promiseResult)
    }
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let then
    try {
      then = x.then
    } catch (e) {
      return reject(e)
    }
    if (typeof then === 'function') {
      let called = false
      try {
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (e) {
        if (called) return
        called = true
        reject(e)
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }

}

/* promise a plus test */
/* myPromise.deferred = function () {
  let x = {};
  x.promise = new myPromise((resolve, reject) => {
    x.resolve = resolve;
    x.reject = reject;
  });
  return x;
}

module.exports = myPromise; */