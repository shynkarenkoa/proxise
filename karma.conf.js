"use strict"

const files = [ "test/*.js" ]

module.exports = config => config.set
({
    frameworks: [ "browserify", "mocha" ],
    preprocessors: { [files]: [ "browserify"] },
    files, browsers:
    [
    //  "Chrome Canary.app", (https://bugs.chromium.org/p/v8/issues/detail?id=5004)
    //  "WebKit Nightly.app", (https://bugs.webkit.org/show_bug.cgi?id=157972)
        "Firefox Nightly.app"
    ]
})