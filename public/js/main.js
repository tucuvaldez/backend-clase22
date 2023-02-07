const socket = io();

const users = {
  julian: { id: 1, email: "julian@gmail.com", name: "julian" },
  josefina: { id: 2, email: "josefina@gmail.com", name: "josefina" },
  martin: { id: 3, email: "martin@gmail.com", name: "martin" },
  agustin: { id: 4, email: "agustin@gmail.com", name: "agustin" },
};

const newProduct = document.getElementById("newProduct");
newProduct.addEventListener("submit", (event) => {
  event.preventDefault();
  let id = document.getElementById("ID").value;
  let name = document.getElementById("NAME").value;
  let price = document.getElementById("price").value;
  let src = document.getElementById("src").value;
  console.log(`${name}, #${id}, $${price}, ${src}`);
  socket.emit("newProduct", {
    id: id,
    name: name,
    price: price,
    src: src,
  });
  newProduct.reset();
});

const messageForm = document.getElementById("messageForm");
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let today = new Date();
  let date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes();
  let value = document.getElementById("name").value;
  let name = users[value].name;
  let email = users[value].email;
  let userId = users[value].id;
  let messageId = Date.now();
  let message = document.getElementById("message").value;
  socket.emit("new_message", {
    date: date,
    name: name,
    email: email,
    message: message,
    userId: userId,
    messageId: messageId,
  });
  messageForm.reset();
});
socket.on("connect", () => {
  console.warn("Conectado al servidor");
});
socket.on("update_products", (products) => {
  fetch("http://localhost:3001/views/products-render.hbs")
    .then((res) => {
      return res.text();
    })
    .then((plantilla) => {
      let template = Handlebars.compile(plantilla);
      let html = template({ products });
      document.getElementById("productos").innerHTML = html;
    });
});
socket.on("update_messages", (messages) => {
  fetch("http://localhost:3001/views/messages-render.hbs")
    .then((res) => {
      return res.text();
    })
    .then((plantilla) => {
      let template = Handlebars.compile(plantilla);
      let html = template({ messages });
      document.getElementById("messageDisplay").innerHTML = html;
    });
});
