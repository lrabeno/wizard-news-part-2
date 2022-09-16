const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");
const postList = require("./views/postList");
const postDetails = require("./views/postDetails");
const client = require("./db/index");

// console.log("CLIENT ----------------->", client);

const app = express();

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res, next) => {
  // const posts = postBank.list();
  // res.send(postList(posts));
  try {
    const data = await client.query("SELECT * FROM posts");
    const posts = data.rows;
    res.send(postList(posts));
  } catch (error) {
    next(error);
  }
});

app.get("/posts/:id", async (req, res) => {
  const data = await client.query(`SELECT * FROM posts WHERE ID =$1`, [
    req.params.id,
  ]);

  const [post] = data.rows;

  // without destructuring
  // const post = data.rows[0];
  res.send(postDetails(post));
  console.log(post);
  // const data = await client.query("SELECT * FROM posts");
  // console.log("REG PARAMS ID ---->", req.params.id);
  // console.log("here the data", data.rows);
  // const post = data.rows.find((post) => post.id === req.params.id);
  // console.log("Single post", post);
  // res.send(postDetails(post));
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
