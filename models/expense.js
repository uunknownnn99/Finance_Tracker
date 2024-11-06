const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/financeTracker")
  .then(() => {
    console.log("DataBase Connected");
  })
  .catch((err) => {
    console.log("Error");
  });

const financeSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Finance = new mongoose.model("Finance", financeSchema);
module.exports = Finance;
