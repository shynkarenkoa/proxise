"use strict"

const {Proxy, handler} = require("./proxils")
    , {flatten} = require("./utils")
    , fy = require("./proxisefy")

class Proxise extends Promise
{
    constructor()
    {
        super(...arguments)

        let apply = ({}, _, args) =>
            this.then(fn => fn(...args))

        return Proxy(this, { get, apply })
    }

    finally(fn)
    {
        return this.then(fn, fn)
    }

    [Symbol.toPrimitive]()
    {
        return {}.toString.call(this)
    }

    get [Symbol.toStringTag]()
    {
        return this.constructor.name
    }

    get __proto__()
    {
        return this.then(Object.getPrototypeOf)
    }

    static get Proxise()
    {
        return this
    }

    static get all()
    {
        return (...args) => super.all(flatten(args))
    }

    static get fy()
    {
        return fy(this)
    }
}

function get(promise, key)
{
    let reflect = typeof key == "symbol"
        || (key in promise != key in {})

    if (reflect)
    {
        let value = Reflect.get(...arguments)
        let isMethod = typeof value == "function"
            && !(value instanceof promise.constructor)

        return isMethod
            ? value.bind(promise)
            : value
    }

    let proxy = promise.then(value => value[key])

    handler(proxy).apply = ({}, _, args) =>
        promise.then(value => value[key](...args))

    return proxy
}

module.exports = Proxise