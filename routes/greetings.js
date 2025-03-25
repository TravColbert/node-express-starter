const express = require("express")
const router = express.Router({ mergeParams: true })
const path = require('path')

// Require the connected controller
const greetingsController = require(path.join(__dirname, '../controllers/greetings'))

module.exports = function () {
    router.route("/new")
        .get((req, res) => {
            console.log("new")
            greetingsController.new(req, res)
        })

    router.route("/:lang")
        .get((req, res) => {
            console.log("show")
            greetingsController.show(req, res)
        })

    router.route("/")
        .get((req, res) => {
            greetingsController.index(req, res)
        })
        .post((req, res) => {
            /**
             * CREATE A RESOURCE
             * Purpose: Used to create a new resource on the server.
             * Idempotency: Not idempotent (multiple requests create multiple resources).
             * Behavior: The server generates a new resource and assigns it an identifier (like an id).
             * Typical Response: 201 Created with the location of the new resource.
             * 
             * EXAMPLE:
             * 
             * POST /users HTTP/1.1
             * Host: example.com
             * Content-Type: application/json
             * 
             * {
             *   "name": "John Doe",
             *   "email": "john@example.com"
             * }
             * 
             * Response:
             * HTTP/1.1 201 Created
             * Location: /users/123
             */
            return greetingsController.create(req, res)
        })
        .put((_req, res) => {
            /**
             * UPDATE A RESOURCE:
             * Purpose: Used to update an existing resource on the server.
             * Idempotency: Idempotent (multiple requests with the same input will have the same effect).
             * Behavior: The server updates the existing resource with the new data.
             * Typical Response: 200 OK with the updated resource.
             * 
             * EXAMPLE:
             * 
             * PUT /users/123 HTTP/1.1
             * Host: example.com
             * Content-Type: application/json
             * 
             * {
             *   "name": "John Doe",
             *   "email": "john@example.com"
             * }
             * 
             * Response:
             * HTTP/1.1 200 OK
             * 
             * {
             *   "id": 123,
             *   "name": "John Doe",
             *   "email": "john@example.com"
             * }
             * 
             * If modifying a specific resource: Use PUT /resource/{id}.
             * If creating a resource: Use POST /resource/.
             * If PUT on the collection is invalid: Return 405 Method Not Allowed or 400 Bad Request.
             */
            res.send("Hello World (PUT)")
        })
        .delete((_req, res) => {
            return greetingsController.destroy(req, res)
        })
        .patch((_req, res) => {
            /**
             * PATCH A RESOURCE:
             * Purpose: Used to update a specific part of a resource on the server.
             * Idempotency: Not always idempotent (multiple requests with the same input will have different effects).
             * Behavior: The server updates the specified part of the resource.
             * Typical Response: 200 OK with the updated resource.
             * 
             * EXAMPLE:
             * 
             * PATCH /users/123 HTTP/1.1
             * Host: example.com
             * Content-Type: application/json
             * 
             * {
             *   "name": "John Doe"
             * }
             * 
             * Response:
             * HTTP/1.1 200 OK
             */
            res.send("Hello World (PATCH)")
        })
        .options((_req, res) => {
            res.send("Hello World (OPTIONS)")
        })
        .head((_req, res) => {
            res.send("Hello World (HEAD)")
            // HEAD is used to get the headers of the response
            // it is not used to get the body of the response
            // So, in this case, the above string will be sent
        })
        
    return router
}
