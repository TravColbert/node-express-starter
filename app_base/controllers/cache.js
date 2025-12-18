/**
 * This function is intended to simulate a slow function.
 * But the goal is to cache the result so that the 2nd call is fast.
 * 
 * @returns 
 */
const slowFunction = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                message: "Hello from slow function",
                timestamp: new Date().toISOString()
            })
        }, 3000)
    })
}

module.exports = function (app) {
    return {
        cacheTest: async function (_req, res) {
            const cacheKey = "cacheTest"

            const result = await app.locals.cache(cacheKey, slowFunction)
            res.json(result)
        },
    }
}