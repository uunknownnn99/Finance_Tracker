const Expenses = require("../models/expense");

async function getExpenseByMonth(username) {
    const expData = {};
    const exp = await Expenses.find({ user: username }).sort({ date: 1 });
    for (const e of exp) {
      const monthYear = e.date.toISOString().slice(0, 7);
      // Initialize the array for this month if it doesn’t exist
      if (!expData[monthYear]) {
        expData[monthYear] = [];
      }
  
      expData[monthYear].push({
        description: e.description,
        amount: e.amount,
        date: e.date,
        type: e.type,
      });
    }
    return expData;
}
async function getTotalExpense(currentMonth,exp){
  let total = 0;
  const transactions = exp[currentMonth];
  transactions.forEach(transaction => {
    if(transaction.type == 'credit'){
      total += transaction.amount;
    }else{
      total -= transaction.amount;
    }
  });
  return total;
}
module.exports = { getExpenseByMonth, getTotalExpense }
  