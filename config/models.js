const fs = require('fs')
const path = require('path')

module.exports = function (app) {
    // Get all .js files from router path
    const modelPath = path.join(__dirname, '/..', app.locals.modelPath)
    const modelFiles = fs.readdirSync(modelPath)
        .filter(file => file.endsWith('.js'))

    // Load and mount each router
    modelFiles.forEach(file => {
        const modelName = path.parse(file).name
        app.locals.debug && console.debug(`Hydrating model: ${modelName}`)
        require(path.join(modelPath, file))
    })

}