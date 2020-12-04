const express = require("express");
const cors = require("cors");
const app = express();

const usersController = require("./controllers/usersController");
const logController = require("./controllers/logController");

app.use(cors());
app.use(express.json());

// User routes
app.post("/api/sign-up", usersController.signUp);
app.post("/api/sign-in", usersController.signIn);
app.post("/api/logout", usersController.logout);

// Logs routes
app.get("/api/log", logController.getLog);
app.post("/api/entry", logController.postEntry);
app.post("/api/pullout", logController.postPullOut);

module.exports = app;
