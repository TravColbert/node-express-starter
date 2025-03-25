const session = require("express-session")
const MemoryStore = require("memorystore")(session)

module.exports = function(app) {
    app.use(session({
        resave: false,
        saveUninitialized: true,  
        store: new MemoryStore(),
        secret: app.locals.sessionSecret,
    }))
}