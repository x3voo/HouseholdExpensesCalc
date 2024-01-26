using System;
using System.Collections.Generic;
using System.Text;

namespace HECDB.Models
{
    public class Expense
    {
        //public int Id { get; set; }
        //public decimal Amount { get; set; }
        //public string Description { get; set; }
        //public DateTime Date { get; set; }
        //public Category ExpenseCategory { get; set; }
        public string expenseName { get; set; }
        public int? expenseValue { get; set; }
        public string? expenseFrequency { get; set; }
        public string NAME_PL { get; set; }

    }
}
