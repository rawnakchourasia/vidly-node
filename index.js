const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const logger1 = require("./middleware/logger1");
const logger2 = require("./middleware/logger2");

const config = require("config");

const morgan = require("morgan");

const Joi = require("joi");

const genres = require("./routes/genres");
const home = require("./routes/home");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/genres", genres);
app.use("/", home);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  startupDebugger(`Server running at Port ${port}`);
});
