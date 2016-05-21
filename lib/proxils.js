"use strict"

const proxies = new WeakSet
    , targets = new WeakMap
    , handlers = new WeakMap

const keys = Reflect.ownKeys(Reflect)
    , revokedProxy = () => { throw new TypeError }

module.exports =
{
    Proxy(target, traps = {})
    {
        let reflect = typeof target != "function"
            && ("apply" in traps || "construct" in traps)

        if (reflect)
        {
            let handler = {}
            let fn = "construct" in traps
                ? Function()
                : () => {}

            var proxy = new Proxy(fn, handler)

            keys.forEach(trap =>
            {
                handler[trap] = ({}, ...args) =>
                    (traps[trap] || Reflect[trap])
                        .call(traps, target, ...args)
            })
        }
        else proxy = new Proxy(target, traps)

        proxies.add(proxy)
        targets.set(proxy, target)
        handlers.set(proxy, traps)

        return proxy
    },

    isProxy: proxy => proxies.has(proxy),
    target: proxy => targets.get(proxy),
    handler: proxy => handlers.get(proxy),

    revoke(proxy)
    {
        let target = targets.get(proxy)
        let handler = handlers.get(proxy)

        if (!target || !handler) return proxy

        targets.delete(proxy)
        handlers.delete(proxy)

        for (let trap of keys)
            if (trap in handler)
                handler[trap] = revokedProxy

        Object.freeze(handler)

        return target
    },

    isRevoked(proxy)
    {
        return proxies.has(proxy)
            && !targets.has(proxy)
            && !handlers.has(proxy)
    }
}