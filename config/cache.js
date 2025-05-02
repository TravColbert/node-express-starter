const NodeCache = require('node-cache')

module.exports = function (app) {
    var cache = false
    if (app.locals.cacheTtl) {
        cache = new NodeCache({ stdTTL: app.locals.cacheTtl || 60 }) // If unset expires after 60 secs
    }

    app.locals.cache = async function (key, func) {
        if (!cache) {
            app.locals.debug && console.debug("Cache is not enabled")
            return await func()
        }

        app.locals.debug && console.log("Cache is initialized, checking for value...")

        let value = cache.get(key)

        if (value == undefined) {
            app.locals.debug && console.log("Cache miss, setting value")
            const slowValue = await func()
            cache.set(key, slowValue)
            return slowValue
        } else {
            app.locals.debug && console.log("Cache hit:", value)
            return value
        }
    }
}