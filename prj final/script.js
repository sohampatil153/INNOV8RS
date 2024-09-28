document.addEventListener('DOMContentLoaded', () => {
  const transactionForm = document.getElementById('transactionForm');
  const transactionList = document.getElementById('transactionList');
  const balanceElement = document.getElementById('balance');
  const incomeElement = document.getElementById('income');
  const expenseElement = document.getElementById('expense');
  const deleteAllBtn = document.getElementById('deleteAllBtn');
  const statusElement = document.getElementById('status');
  const generatePdfBtn = document.getElementById('downloadReportBtn'); // Reverted to original button ID

  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpense = 0;

  // Function to update the balance display
  function updateBalance() {
      balanceElement.textContent = `₹${totalBalance.toFixed(2)}`; // Changed to Rupees
      incomeElement.textContent = `₹${totalIncome.toFixed(2)}`;   // Changed to Rupees
      expenseElement.textContent = `₹${totalExpense.toFixed(2)}`; // Changed to Rupees
  }

  // Function to handle form submission
  transactionForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const formData = new FormData(transactionForm);
      const type = formData.get('type') ? 'Income' : 'Expense';
      const name = formData.get('name');
      const amount = parseFloat(formData.get('amount'));
      const category = formData.get('category');
      const date = formData.get('date');
      
      // Update totals
      if (type === 'Income') {
          totalIncome += amount;
          totalBalance += amount;
      } else {
          totalExpense += amount;
          totalBalance -= amount;
      }
      
      // Create a new transaction item with bullet points
      const listItem = document.createElement('li');
      listItem.textContent = `${name} - ₹${amount.toFixed(2)} (${category}) on ${date}`; // Changed to Rupees
      transactionList.appendChild(listItem);
      
      // Clear the form
      transactionForm.reset();
      updateBalance();
      statusElement.textContent = "Transaction added successfully!";
  });

  // Function to delete all transactions
  deleteAllBtn.addEventListener('click', () => {
      transactionList.innerHTML = '';
      totalBalance = 0;
      totalIncome = 0;
      totalExpense = 0;
      updateBalance();
      statusElement.textContent = "All transactions deleted!";
  });

  // Function to generate PDF report
  generatePdfBtn.addEventListener('click', async () => {
      const { jsPDF } = window.jspdf;

      const doc = new jsPDF();
      doc.text("Expense Tracker Report", 10, 10);
      doc.text(`Total Balance: ₹${totalBalance.toFixed(2)}`, 10, 20); // Changed to Rupees
      doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`, 10, 30);   // Changed to Rupees
      doc.text(`Total Expense: ₹${totalExpense.toFixed(2)}`, 10, 40); // Changed to Rupees

      doc.text("Transactions:", 10, 50);
      transactionList.querySelectorAll('li').forEach((item, index) => {
          doc.text(`${index + 1}. ${item.textContent}`, 10, 60 + (10 * index));
      });

      doc.save('expense_report.pdf');
  });
});
