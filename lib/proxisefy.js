"use strict"

const {isSync, dasherize} = require("./utils")

module.exports = Proxise =>
{
    function get(target, key)
    {
        let value = Reflect.get(...arguments)

        if (typeof value != "function" || isSync(key))
            return value

        return Object.defineProperties((...args) =>
        {
            let [last] = args.slice(-1)

            if (typeof last == "function")
                return value.apply(target, args)

            let promise = new Proxise((resolve, reject) =>
            {
                args.push((error, result) =>
                {
                    if (error) reject(error)
                    else resolve(result)
                })
            })

            let result = value.apply(target, args)

            return result === undefined
                ? promise
                : result
        },
        {
            length: { value: value.length },
            name: { value: value.name }
        })
    }

    let fy = target =>
    {
        if (typeof target == "string")
            target = require(dasherize(target))

        return new Proxy(target, { get })
    }

    return new Proxy(fy,
    {
        get: ({}, key) => fy(key)
    })
}