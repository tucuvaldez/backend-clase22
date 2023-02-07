//Imports

import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import * as handlebars from "express-handlebars";
import FakerContainer from "./container/FakerProducts/FakerContainer.js";
import FSContainer from "./container/FSContainer/FSContainer.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

//Instancias

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const hbs = handlebars.create({
  extname: ".hbs",
  defaultLayout: "index.hbs",
  layoutsDir: __dirname + "/public/views",
  partialsDir: __dirname + "/public/views/partials",
});
const productos = new FakerContainer();
const mensajes = new FSContainer("./src/container/FSContainer/messages.txt");

//APP use and set

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs"); //Registra motor de plantilla
app.set("views", "./public/views"); //Especifica directorio de vistas

//Get, Post and Socket

app.get("/", (req, res) => {
  res.render("index", {});
});
io.on("connection", async (socket) => {
  const products = productos.createMany(10);
  const messages = await mensajes.getAll();
  const normalizada = await mensajes.normalize(mensajes);
  console.log(normalizada);
  socket.emit("update_products", products);
  socket.emit("update_messages", messages);
  socket.on("new_product", async (product) => {
    product = await productos.saveProduct(product);
    products.push(product);
    io.sockets.emit("update_products", products);
  });
  socket.on("new_message", async (message) => {
    // messages.push(message);
    await mensajes.save(message);
    io.sockets.emit("update_messages", messages);
  });
});

//Port Settings
const PORT = 3001;
const connectedServer = httpServer.listen(PORT, () => {
  console.log(`Server connected at port: http://localhost:${PORT}`);
});
connectedServer.on("err", (err) => console.log("Error en el servidor" + err));
