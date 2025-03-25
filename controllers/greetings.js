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
    index: function (req, res) {
        const greetingsCollection = req.query.lang ? greetings.filter(g => g.lang === req.query.lang) : greetings
        res.render('greetings/index', { greetings: greetingsCollection })
    },
    new: function (req, res) {
        res.render('greetings/new')
    },
    create: function (req, res) {
        const newGreeting = {
            lang: req.body.lang,
            greeting: req.body.greeting
        }
        // If a greeting with this language already exists
        // return a 400 error with a new form
        if (greetings.some(g => g.lang === newGreeting.lang)) {
            return res.status(400).render('greetings/new', { errors: [
                {
                    error: `A greeting in ${newGreeting.lang} already exists`
                }
            ]})
        }
        greetings.push(newGreeting)
        res.redirect(`/greetings/${newGreeting.lang}`)
    },
    destroy: function (req, res) {
        greetings = greetings.filter(g => g.lang !== req.params.lang)
        res.redirect('/greetings')
    },
    show: function (req, res) {
        const greeting = greetings.find(g => g.lang === req.params.lang)

        if (greeting) {
            res.render('greetings/show', { greeting })
        }

        res.status(404).render('errors/404')
    }
}