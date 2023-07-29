const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

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
startupDebugger("Application Name: " + config.get("name")); // Application Name: My Express App - Development
startupDebugger("Mail Server: " + config.get("mail.host")); // Mail Server: dev-mail-server
startupDebugger("Mail Password: " + config.get("mail.password")); // Mail Password: 1234

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled..."); // Morgan enabled...
}

// Db work...
dbDebugger("Connected to the database...");

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
  startupDebugger(`Server running at Port ${port}`);
});
