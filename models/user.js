const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://financeTracker:FinanceTracker@data.5veo4.mongodb.net/?retryWrites=true&w=majority&appName=data")
  .then(() => {
    console.log("User DataBase Connected");
  })
  .catch((err) => {
    console.log("Error");
  });

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Users = new mongoose.model("Users", User);
module.exports = Users;
