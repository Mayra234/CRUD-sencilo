const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./src/models/User");
const Task = require("./src/models/Task");

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (cambia "mongo" por "localhost" si no usas Docker Compose)
mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/taskmanager")
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
  });

// Endpoints usuarios
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

app.put("/users/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(user);
});

app.delete("/users/:id", async (req, res) => {
  console.log("Eliminando usuario ID:", req.params.id);
  await Task.deleteMany({ userId: req.params.id });
  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// Endpoints tareas

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find().populate("userId");
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate("userId");
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// Iniciar servidor
app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});
