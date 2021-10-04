import dotenv from "dotenv/config";
import express from "express";
import cronJob from "node-cron";
import loadData from "./cronData.js";
import jwt from "jsonwebtoken";

//express app
const app = express();
app.use(express.json());

//sending response as cron data
cronJob.schedule("* * * * * *", () => {
  console.log(loadData("John Doe", "john@mail.com"));
});

// routes
app.post("/createToken", (req, res) => {
  const userName = req.body.username;
  const email = req.body.email;

  const user = loadData(userName, email);
  console.log(user);

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  res.send(accessToken);
});

//To check the Token
app.post("/", authenticateToken, (req, res) => {
  res.send("JWT Token Validation Success!");
});

//Middleware function for authentication after getting TOKEN
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).send("token null");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Token does not matched");
    req.user = user;
    next();
  });
}

app.listen(3200);
