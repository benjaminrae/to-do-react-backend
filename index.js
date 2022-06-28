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

let todos = [
    {
        title: "test note",
        content: "test note content",
        id: 1,
        status: 0,
    },
    {
        title: "doing test",
        content: "test note content",
        id: 2,
        status: 1,
    },
    {
        title: "done test",
        content: "test note content",
        id: 3,
        status: 2,
    },
];

app.get("/api/todos", (request, response) => {
    response.json(todos);
});

app.get("/api/todos/:id", (request, response) => {
    const id = Number(request.params.id);
    const todo = todos.find((person) => todo.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/todos/:id", (request, response) => {
    const id = Number(request.params.id);
    todos = todos.filter((todo) => todo.id !== id);

    response.status(204).end();
});

app.post("/api/todos", (request, response) => {
    const body = request.body;

    if (!body.title) {
        return response.status(400).json({ error: "title missing" });
    }

    const maxId =
        todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) : 0;

    const todo = {
        id: maxId + 1,
        title: body.title,
        content: body.content,
        status: body.status,
    };

    todos = todos.concat(todo);
    console.log(todos);
    response.json(todo);
});

app.put("/api/todos/:id", (request, response) => {
    const updatedTodo = request.body;
    const id = Number(updatedTodo.id);
    todos = todos.map((todo) => (todo.id !== id ? todo : updatedTodo));
    response.status(200).end();
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on PORT ${PORT}`);
