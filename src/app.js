const express = require("express");
const cors = require("cors");
const app = express();

const usersController = require("./controllers/usersController");
// const logController = require("./controllers/logController");
// const authMiddleware = require("./middlewares/authMiddleware");

app.use(cors());
app.use(express.json());

// User routes
app.post("/api/sign-up", usersController.signUp);
app.post("/api/sign-in", usersController.signIn);
// app.post("/api/users/sign-out", authMiddleware, usersController.postSignOut);
//app.put("/api/users/edit", authMiddleware, usersController.putUser);

// Post routes
// app.get("/api/log", logController.getLog);
// app.post("/api/entry", authMiddleware, logController.postEntry);
// app.post("/api/pullout", authMiddleware, logController.postPullOut);

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
