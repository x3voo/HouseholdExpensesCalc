using System;
using System.Collections.Generic;
using System.Text;
using HECDB.Models;

namespace HECDB
{
    public class DummyDatabase
    {
        public static List<Expenses> ExpensesData = new List<Expenses>();
        public static List<Income> IncomeData = new List<Income>();

        public static List<Expense> Expenses { get; } = new List<Expense>();
        public static List<Category> Categories { get; } = new List<Category>
        {
            new Category { Id = 1, Name = "Groceries", Description = "Expenses related to grocery shopping" },
            new Category { Id = 2, Name = "Utilities", Description = "Expenses for utility bills" },
            // Add more categories as needed
        };
    }
}
