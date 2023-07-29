const logger1 = require("./logger1");
const logger2 = require("./logger2");
const config = require("config");
const morgan = require("morgan");
const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configuration
console.log("Application Name: " + config.get("name")); // Application Name: My Express App - Development
console.log("Mail Server: " + config.get("mail.host")); // Mail Server: dev-mail-server
console.log("Mail Password: " + config.get("mail.password")); // Mail Server: dev-mail-server

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled..."); // Morgan enabled...
}
app.use(logger1);
app.use(logger2);

const genres = [
  {
    id: 1,
    genre: "Comedy",
  },
  {
    id: 2,
    genre: "Horror",
  },
  {
    id: 3,
    genre: "Romance",
  },
];

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find((x) => x.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found");

  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    genre: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
});

app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find((x) => x.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const index = genres.indexOf(genre);
  genres[index].genre = req.body.name;
  res.send(genre);
});

app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find((x) => x.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre not found");

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

function validateGenre(result) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(result);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at Port ${port}`);
});
