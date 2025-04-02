'use strict'

module.exports = function (app) {
    app.locals.debug && console.debug('Loading greetings controller')

    return {
        index: function (req, res) {
            const greetingsCollection = req.query.lang ? app.locals.models['greetings'].find(req.query.lang) : app.locals.models['greetings'].all()
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
            const insertedGreetingId = app.locals.models['greetings'].create(newGreeting)

            if (!insertedGreetingId) {
                return res.status(400).render('greetings/new', {
                    errors: [
                        {
                            error: `A greeting in ${newGreeting.lang} already exists`
                        }
                    ]
                })
            }

            res.redirect(`/greetings/${insertedGreetingId}`)
        },
        destroy: function (req, res) {
            app.locals.models['greetings'].destroy(req.params.lang)
            res.redirect('/greetings')
        },
        show: function (req, res) {
            const greeting = app.locals.models['greetings'].find(req.params.lang)

            if (greeting) {
                return res.render('greetings/show', { greeting })
            }

            res.status(404).render('errors/404')
        },
        edit: function (req, res) {
            const greeting = app.locals.models['greetings'].find(req.params.lang)
            if (!greeting) {
                return res.status(404).render('errors/404')
            }
            res.render('greetings/edit', { greeting })
        },
        update: function (req, res) {
            const updatedGreeting = {
                lang: req.body.lang,
                greeting: req.body.greeting
            }

            const updatedGreetingId = app.locals.models['greetings'].update(updatedGreeting)

            if (!updatedGreetingId) {
                return res.status(400).render('greetings/new', {
                    errors: [
                        {
                            error: `Could not update greeting`
                        }
                    ]
                })
            }

            res.redirect(`/greetings/${updatedGreetingId}`)
        }
    }
}