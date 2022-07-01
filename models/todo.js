const mongoose = require("mongoose");
require("dotenv").config();

const password = process.env.MONGO_DB_KEY;

const url = `mongodb+srv://todoreact:${password}@cluster0.itfhm.mongodb.net/?retryWrites=true&w=majority`;

mongoose
    .connect(url)
    .then((result) => {
        console.log("connected");
    })
    .catch((error) => console.log("error connecting: ", error));

const todoSchema = new mongoose.Schema({
    title: String,
    content: String,
    status: Number,
    id: String,
});

todoSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
module.exports = mongoose.model("Todo", todoSchema);
