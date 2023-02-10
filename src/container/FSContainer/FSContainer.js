import { promises as fs } from "fs";
import { normalize, schema } from "normalizr";
import * as util from "util";

const nameSchema = new schema.Entity("name");
const emailSchema = new schema.Entity("email");
const dateSchema = new schema.Entity("date");
const messageSchema = new schema.Entity("message");
const userIdSchema = new schema.Entity("userId");
const messageIdSchema = new schema.Entity("messageId");

// const authorSchema = new schema.Entity("author", {
//   id: userIdSchema,
//   name: nameSchema,
//   mail: emailSchema,
// });

// const commentSchema = new schema.Entity("comment", {
//   messageId: messageIdSchema,
//   message: messageSchema,
//   date: dateSchema,
// });
// const postSchema = new schema.Entity("post", {
//   name: authorSchema.name,
//   message: commentSchema.message,
// });
const user = new schema.Entity("users", {
  name: nameSchema,
  email: emailSchema,
  date: dateSchema,
  message: messageSchema,
  userID: userIdSchema,
  messageId: messageIdSchema,
});
const chat = new schema.Entity("chats", {
  name: user.name,
  message: user.message,
});
const post = new schema.Entity("posts", {
  chats: [chat],
});

class FSContainer {
  constructor(route) {
    this.route = route;
  }
  async getAll() {
    try {
      let messages = await fs.readFile(this.route, "utf-8");
      return JSON.parse(messages);
    } catch (err) {
      console.error("Error de lectura");
      console.error(err);
      return [];
    }
  }
  async save(mensaje) {
    const mensajes = await this.getAll();
    mensajes.push(mensaje);
    try {
      await fs.writeFile(this.route, JSON.stringify(mensajes, null, 2));
      return console.log("Guardado con éxito");
    } catch (err) {
      console.log("Error de escritura");
      return console.log(err);
    }
  }
  getTime() {
    let today = new Date();
    return (
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " " +
      today.getHours() +
      ":" +
      today.getMinutes()
    );
  }
  async normalize() {
    const mensajes = await this.getAll();
    const normalizedData = normalize(mensajes, post);
    console.log(JSON.stringify(normalizedData, false, 12, true));
  }
}

export default FSContainer;
