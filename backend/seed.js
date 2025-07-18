const waitPort = require("wait-port");
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Task = require("./src/models/Task");

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/taskmanager";

const seed = async () => {
  try {
    console.log("Esperando que MongoDB esté disponible...");

    await waitPort({ host: "mongo", port: 27017, timeout: 10000 });

    await mongoose.connect(MONGO_URL);
    console.log("Conectado a MongoDB");

    await User.deleteMany();
    await Task.deleteMany();

    const users = await User.insertMany([
      { name: "Ana" },
      { name: "Carlos" },
      { name: "Laura" },
    ]);

    await Task.insertMany([
      { title: "Comprar leche", completed: false, userId: users[0]._id },
      { title: "Revisar correos", completed: true, userId: users[1]._id },
      { title: "Actualizar CV", completed: false, userId: users[2]._id },
    ]);

    console.log("Seed completado con éxito.");
  } catch (err) {
    console.error("Error durante el seed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
