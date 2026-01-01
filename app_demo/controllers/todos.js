'use strict'

module.exports = function (app) {
    const model = app.locals.models['todos']

    const getTodos = async function (req) {
        const queryObject = {
            where: {
                done: false
            }
        }

        if (req.query.done === 'true') {
            delete queryObject.where.done
        }

        return await model.findAll(queryObject)
    }

    const validateAndSave = async function (res, todo) {
        return await todo.validate()
            .then(async (todo) => {
                return await todo.save()
            })
            .catch((validationError) => {
                return res.status(400).render('todos/new', {
                    todo,
                    errors: validationError.errors,
                    invalidElements: validationError.errors.map(err => err.path)
                })
            })
    }

    const markDone = async function (res, todo) {
        if (!todo) {
            return res.status(404).render('errors/404')
        }

        todo.done = true

        return await validateAndSave(res, todo)
    }

    return {
        new: function (req, res) {
            res.render('todos/fragments/form', {
                todo: {
                    description: '', done: false
                }
            })
        },
        edit: function (req, res) {
            model.findByPk(req.params.id)
                .then((todo) => {
                    if (!todo) {
                        return res.status(404).render('errors/404')
                    }
                    res.render('todos/fragments/form', { todo })
                })
                .catch(() => {
                    res.status(500).render('errors/500')
                })
        },
        markCompleted: function (req, res) {
            model.findByPk(req.params.id)
                .then(async (todo) => {
                    return await markDone(res, todo)
                })
                .then(() => getTodos(req))
                .then((todos) => {
                    res.render('todos/index', { todos })
                })
                .catch(() => {
                    res.status(500).render('errors/500')
                })
        },
        show: function (req, res) {
            model.findByPk(req.params.id)
                .then((todo) => {
                    if (!todo) {
                        return res.status(404).render('errors/404')
                    }
                    res.render('todos/show', { todo })
                })
                .catch(() => {
                    res.status(500).render('errors/500')
                })
        },
        index: function (req, res) {
            getTodos(req)
                .then((todos) => {
                    res.render('todos/index', { todos: todos })
                })
                .catch((e) => {
                    res.status(500).render('errors/500', e)
                })
        },
        create: function (req, res) {
            const newTodo = model.build(req.body.todo)
            validateAndSave(res, newTodo)
                .then(() => getTodos(req))
                .then((todos) => {
                    res.render(`todos/fragments/index`, { todos })
                })
                .catch(() => {
                    res.status(500).render('errors/500')
                })
        },
        destroy: function (req, res) {
            model.findByPk(req.params.id)
                .then(async (todo) => {
                    if (!todo) {
                        return res.status(404).render('errors/404')
                    }
                    return await todo.destroy()
                })
                .then(() => getTodos(req))
                .then((todos) => {
                    res.render('todos/index', { todos: todos })
                })
                .catch(() => {
                    res.status(500).render('errors/500')
                })
        },
        update: function (req, res) {
            model.findByPk(req.params.id)
                .then((todo) => {
                    if (!todo) {
                        return res.status(404).render('errors/404')
                    }

                    todo.set(req.body.todo)

                    validateAndSave(res, todo)
                        .then(() => getTodos(req))
                        .then((todos) => {
                            res.render('todos/index', { todos })
                        })
                        .catch(() => {
                            res.status(500).render('errors/500')
                        })
                })
                .catch(() => {
                    res.status(500).render('errors/500')
                })
        }
    }
}