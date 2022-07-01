const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { response } = require("express");

const app = express();

app.use(express.json());
app.use(express.static("build"));
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);
app.use(cors());

morgan.token("body", (request, response) => {
    return JSON.stringify(request.body);
});

const Todo = require("./models/todo");

app.get("/api/todos", (request, response) => {
    Todo.find({})
        .then((result) => {
            response.json(result);
        })
        .catch((error) => console.log(error));
});

app.get("/api/todos/:id", (request, response) => {
    const targetId = Number(request.params.id);
    Todo.findOne({ id: targetId })
        .then((result) => {
            response.json(result);
        })
        .catch((error) => {
            console.log(error);
            response.status(404).end();
        });

    // if (person) {
    //     response.json(person);
    // } else {
    //     response.status(404).end();
    // }
});

app.delete("/api/todos/:id", (request, response) => {
    const targetId = request.params.id;
    Todo.findByIdAndRemove({ _id: targetId })
        .then((result) => {
            result === null
                ? response.status(404).json({ error: "ID not found" })
                : response.status(200).json(result);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.post("/api/todos", (request, response) => {
    const body = request.body;

    if (!body.title) {
        return response.status(400).json({ error: "title missing" });
    }

    const todo = {
        title: body.title,
        content: body.content,
        status: body.status,
    };
    Todo.create(todo)
        .then((result) => {
            response.json(result);
        })
        .catch((error) => console.log(error));
});

app.put("/api/todos/:id", (request, response) => {
    const updatedTodo = request.body;
    console.log(updatedTodo);
    const targetId = updatedTodo.id;
    targetId;
    Todo.findByIdAndUpdate({ _id: targetId }, updatedTodo)
        .then((result) => {
            console.log(result);
            result === null
                ? response.status(404).json({ error: "ID not found" })
                : response.status(200).json(result);
        })
        .catch((error) => console.log(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on PORT ${PORT}`);
