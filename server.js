const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 4000;

const { handleLogin, handleSignUp } = require("./controllers/user");
const Expenses = require("./models/expense");
const { getExpenseByMonth, getTotalExpense } = require("./services/getData");
const { getUser } = require("./services/user");

const secretKey = "Abhinav1409";

const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index", { error: req.query.error });
});

app.post("/login", async (req, res) => {
  const data = req.body;
  await handleLogin(data, req, res);
});

app.post("/signup", async (req, res) => {
  const data = req.body;
  await handleSignUp(data, req, res);
});

app.get("/finance", async (req, res) => {
  const id = req.cookies.uid;
  jwt.verify(id, secretKey, (err) => {
    if (err) {
      res.status(401).send("Invalid token");
    }
  });
  const user = await getUser(id);
  var exp = await getExpenseByMonth(user.email);
  var months = Object.keys(exp);
  var curr = months.length - 1;
  res.render("finance", {
    currentMonth: months[curr],
    username: user.name,
    transactions: exp,
    totalExpense: await getTotalExpense(months[curr], exp),
  });
});

app.get("/finance/prev", async (req, res) => {
  const id = req.cookies.uid;
  jwt.verify(id, secretKey, (err) => {
    if (err) {
      res.status(401).send("Invalid token");
    }
  });

  const user = await getUser(id);
  let exp = await getExpenseByMonth(user.email);
  let months = Object.keys(exp);
  let currMonth = req.query.currentMonth; // Get current month from query
  let currIndex = months.indexOf(currMonth);
  let prevMonth = months[(currIndex - 1 + months.length) % months.length];
  res.render("finance", {
    currentMonth: prevMonth,
    username: user.name,
    transactions: exp,
    totalExpense: await getTotalExpense(prevMonth, exp),
  });
});

app.get("/finance/next", async (req, res) => {
  const id = req.cookies.uid;
  jwt.verify(id, secretKey, (err) => {
    if (err) {
      res.status(401).send("Invalid token");
    }
  });

  const user = await getUser(id);
  let exp = await getExpenseByMonth(user.email);
  let months = Object.keys(exp);
  let currMonth = req.query.currentMonth; // Get current month from query
  let currIndex = months.indexOf(currMonth);
  let nextMonth = months[(currIndex + 1) % months.length];
  res.render("finance", {
    currentMonth: nextMonth,
    username: user.name,
    transactions: exp,
    totalExpense: await getTotalExpense(nextMonth, exp),
  });
});

app.post("/credit", async (req, res) => {
  const user = await getUser(req.cookies.uid);
  const data = new Expenses({
    description: req.body.description,
    amount: parseFloat(req.body.amount),
    type: "credit",
    date: new Date().toISOString().slice(0, 10),
    user: user.email,
  });
  await data.save();
  res.redirect("finance");
});

app.post("/debit", async (req, res) => {
  const user = await getUser(req.cookies.uid);
  const data = new Expenses({
    description: req.body.description,
    amount: parseFloat(req.body.amount),
    type: "debit",
    date: new Date().toISOString().slice(0, 10),
    user: user.email,
  });
  await data.save();
  res.redirect("finance");
});

app.listen(port, () => {
  console.log(`Listning at ${port}`);
});
