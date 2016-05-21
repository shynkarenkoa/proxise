"use strict"

const isIterable = value =>
    value != null && typeof
    value[Symbol.iterator] == "function"

const isSync = key =>
    typeof key == "string"
        && key.endsWith("Sync")

const dasherize = string => string
    .replace(/([a-z])(?=[A-Z])/g, "$1-")
    .toLowerCase()

function* flatten(iterable)
{
    for (let item of iterable)
        if (isIterable(item)) yield* item
        else yield item
}

module.exports =
{
    isIterable,
    isSync,
    dasherize,
    flatten
}