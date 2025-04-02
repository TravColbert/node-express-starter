'use strict'

var greetings = [
    {
        "lang": "en",
        "greeting": "Hello World"
    },
    {
        "lang": "es",
        "greeting": "Hola Mundo"
    },
    {
        "lang": "fr",
        "greeting": "Bonjour le monde"
    },
    {
        "lang": "de",
        "greeting": "Hallo Welt"
    },
    {
        "lang": "it",
        "greeting": "Ciao mondo"
    },
    {
        "lang": "ja",
        "greeting": "こんにちは世界"
    },
    {
        "lang": "zh",
        "greeting": "你好，世界"
    }
]

module.exports = {
    all: function () {
        return greetings
    },
    find: function (lang) {
        return greetings.filter(g => g.lang === lang)[0]
    },
    create: function (newGreeting) {
        if (greetings.some(g => g.lang === newGreeting.lang)) return false
        // validation would be nice here
        greetings.push(newGreeting)
        return newGreeting.lang
    },
    destroy: function (lang) {
        if (greetings.some(g => g.lang === newGreeting.lang)) return false
        greetings = greetings.filter(greeting => greeting.lang != lang)
        return lang
    },
    update: function (updatedGreeting) {
        if (!greetings.some(g => g.lang === updatedGreeting.lang)) return false
        greetings = greetings.map(greeting => {
            if (greeting.lang === updatedGreeting.lang) {
                return updatedGreeting
            }
            return greeting
        })
        return updatedGreeting.lang
    }
}